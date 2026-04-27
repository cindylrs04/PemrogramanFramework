import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const redirectMock = jest.fn((url: URL) => ({ type: "redirect", url: url.toString() }));
const nextMock = jest.fn(() => ({ type: "next" }));

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: (url: URL) => redirectMock(url),
    next: () => nextMock(),
  },
}));

const { getToken } = require("next-auth/jwt");
const { middleware, config } = require("@/middleware");
const withAuth = require("@/Middleware/withAuth").default;

describe("Middleware and withAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to login when token is missing", async () => {
    getToken.mockResolvedValue(null);

    const req = { url: "http://localhost:3000/about" };
    await middleware(req as any);

    expect(redirectMock).toHaveBeenCalled();
    expect(redirectMock.mock.calls[0][0].toString()).toBe("http://localhost:3000/login");
  });

  it("continues request when token exists", async () => {
    getToken.mockResolvedValue({ sub: "1" });

    const req = { url: "http://localhost:3000/about" };
    await middleware(req as any);

    expect(nextMock).toHaveBeenCalled();
  });

  it("exports matcher config", () => {
    expect(config.matcher).toEqual(["/produk", "/about", "/profile"]);
  });

  it("withAuth redirects unauthenticated user to auth login with callback", async () => {
    getToken.mockResolvedValue(null);

    const wrapped = withAuth(jest.fn(), ["/admin"]);
    const req = {
      url: "http://localhost:3000/admin",
      nextUrl: { pathname: "/admin" },
    };

    await wrapped(req as any, {} as any);

    const redirectUrl = redirectMock.mock.calls[0][0].toString();
    expect(redirectUrl).toContain("/auth/login");
    expect(redirectUrl).toContain("callbackUrl=");
  });

  it("withAuth blocks non-admin on admin route", async () => {
    getToken.mockResolvedValue({ role: "user" });

    const wrapped = withAuth(jest.fn(), ["/admin"]);
    const req = {
      url: "http://localhost:3000/admin",
      nextUrl: { pathname: "/admin" },
    };

    await wrapped(req as any, {} as any);

    expect(redirectMock.mock.calls[0][0].toString()).toBe("http://localhost:3000/");
  });

  it("withAuth allows admin and calls next middleware", async () => {
    getToken.mockResolvedValue({ role: "admin" });

    const downstream = jest.fn(() => "ok");
    const wrapped = withAuth(downstream, ["/admin"]);
    const req = {
      url: "http://localhost:3000/admin",
      nextUrl: { pathname: "/admin" },
    };

    const result = await wrapped(req as any, {} as any);

    expect(downstream).toHaveBeenCalled();
    expect(result).toBe("ok");
  });
});
