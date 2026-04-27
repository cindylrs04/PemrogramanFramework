import { render, screen, fireEvent } from "@testing-library/react";
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

const TampilanLogin = require("../../pages/auth/login").default;

describe("Halaman Login", () => {
  beforeEach(() => {
    const { useRouter } = require("next/router");

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      query: {},
    });
  });

  it("renders login page correctly", () => {
    const { asFragment } = render(<TampilanLogin />);

    expect(
      screen.getByRole("heading", { name: "Halaman Login" })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders email and password input", () => {
    render(<TampilanLogin />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
  });

  it("renders login button", () => {
    render(<TampilanLogin />);

    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
  });

  it("calls signIn with google when button clicked", () => {
    const { signIn } = require("next-auth/react");

    render(<TampilanLogin />);

    fireEvent.click(screen.getByText(/sign in with google/i));

    expect(signIn).toHaveBeenCalledWith("google", expect.any(Object));
  });

});