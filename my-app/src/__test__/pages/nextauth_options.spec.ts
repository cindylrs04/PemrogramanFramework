import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("@/utlis/db/servicefirebase", () => ({
  signIn: jest.fn(),
  signInWithGoogle: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn((options: any) => options),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn((cfg: any) => ({ id: "credentials", ...cfg })),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn((cfg: any) => ({ id: "google", ...cfg })),
}));

jest.mock("next-auth/providers/github", () => ({
  __esModule: true,
  default: jest.fn((cfg: any) => ({ id: "github", ...cfg })),
}));

const bcrypt = require("bcrypt");
const { signIn, signInWithGoogle } = require("@/utlis/db/servicefirebase");
const { authOptions } = require("@/pages/api/auth/[...nextauth]");

describe("NextAuth Options", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("has expected providers and signIn page", () => {
    expect(authOptions.providers).toHaveLength(3);
    expect(authOptions.pages.signIn).toBe("/auth/login");
    expect(authOptions.session.strategy).toBe("jwt");
  });

  it("credentials authorize returns null for missing credentials", async () => {
    const credentialsProvider: any = authOptions.providers[0];
    const result = await credentialsProvider.authorize(null);
    expect(result).toBeNull();
  });

  it("credentials authorize returns mapped user for valid password", async () => {
    const credentialsProvider: any = authOptions.providers[0];

    signIn.mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      fullname: "Test",
      role: "admin",
      password: "hashed",
    });
    bcrypt.compare.mockResolvedValue(true);

    const result = await credentialsProvider.authorize({
      email: "test@mail.com",
      password: "secret",
    });

    expect(signIn).toHaveBeenCalledWith("test@mail.com");
    expect(result).toEqual({
      id: "1",
      email: "test@mail.com",
      fullname: "Test",
      role: "admin",
    });
  });

  it("credentials authorize returns null when password invalid", async () => {
    const credentialsProvider: any = authOptions.providers[0];

    signIn.mockResolvedValue({
      id: "1",
      email: "test@mail.com",
      fullname: "Test",
      role: "admin",
      password: "hashed",
    });
    bcrypt.compare.mockResolvedValue(false);

    const result = await credentialsProvider.authorize({
      email: "test@mail.com",
      password: "wrong",
    });

    expect(result).toBeNull();
  });

  it("jwt callback maps credentials user into token", async () => {
    const token = await authOptions.callbacks.jwt({
      token: {},
      account: { provider: "credentials" },
      user: {
        email: "cred@mail.com",
        fullname: "Cred User",
        role: "member",
      },
    });

    expect(token.email).toBe("cred@mail.com");
    expect(token.fullname).toBe("Cred User");
    expect(token.role).toBe("member");
  });

  it("jwt callback maps oauth result into token", async () => {
    signInWithGoogle.mockImplementation(async (_data: any, cb: Function) => {
      cb({
        status: true,
        data: {
          fullname: "OAuth User",
          email: "oauth@mail.com",
          image: "img.png",
          type: "google",
          role: "member",
        },
      });
    });

    const token = await authOptions.callbacks.jwt({
      token: {},
      account: { provider: "google" },
      user: {
        name: "OAuth User",
        email: "oauth@mail.com",
        image: "img.png",
      },
    });

    expect(signInWithGoogle).toHaveBeenCalled();
    expect(token.email).toBe("oauth@mail.com");
    expect(token.fullname).toBe("OAuth User");
    expect(token.role).toBe("member");
    expect(token.type).toBe("google");
  });

  it("session callback maps token fields to session user", async () => {
    const session = {
      user: {
        email: "",
        fullname: "",
        image: "",
        role: "",
        type: "",
      },
    };

    const token = {
      email: "a@mail.com",
      fullname: "A",
      image: "img.png",
      role: "admin",
      type: "github",
    };

    const result = await authOptions.callbacks.session({ session, token });

    expect(result.user.email).toBe("a@mail.com");
    expect(result.user.fullname).toBe("A");
    expect(result.user.image).toBe("img.png");
    expect(result.user.role).toBe("admin");
    expect(result.user.type).toBe("github");
  });
});
