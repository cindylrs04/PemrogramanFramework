import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const pushMock = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children }: any) => children;
});

const TampilanLoginIndex = require("@/pages/auth/login/index").default;

describe("Auth Login Index Page", () => {
  beforeEach(() => {
    const { useRouter } = require("next/router");

    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      query: {},
    });
  });

  it("renders title and form controls", () => {
    render(<TampilanLoginIndex />);

    expect(screen.getByTestId("title")).toHaveTextContent("Halaman Login");
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with github/i })).toBeInTheDocument();
  });

  it("shows generic error when credentials sign in throws", async () => {
    const { signIn } = require("next-auth/react");

    signIn.mockRejectedValue(new Error("network fail"));

    render(<TampilanLoginIndex />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "wrong" },
    });

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(screen.getByText("wrong email or password")).toBeInTheDocument();
    });
  });

  it("calls social sign in for google and github", async () => {
    const { signIn } = require("next-auth/react");
    const { useRouter } = require("next/router");

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      query: { callbackUrl: "/profile" },
    });

    signIn.mockResolvedValue({});

    render(<TampilanLoginIndex />);

    fireEvent.click(screen.getByRole("button", { name: /sign in with google/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign in with github/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/profile",
        redirect: false,
      });
      expect(signIn).toHaveBeenCalledWith("github", {
        callbackUrl: "/profile",
        redirect: false,
      });
    });
  });
});
