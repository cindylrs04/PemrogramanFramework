import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import HalamanProfile from "@/pages/profile";
import * as nextAuth from "next-auth/react";

describe("Halaman Profile", () => {
  beforeEach(() => {
    jest.spyOn(nextAuth, "useSession").mockReset();
  });

  it("shows loading when status is loading", () => {
    jest.spyOn(nextAuth, "useSession").mockReturnValue({
      status: "loading",
      data: null,
    } as any);

    render(<HalamanProfile />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user profile correctly", () => {
    jest.spyOn(nextAuth, "useSession").mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          fullname: "Cindy",
          email: "cindy@mail.com",
        },
      },
    } as any);

    const { asFragment } = render(<HalamanProfile />);

    expect(screen.getByText("Cindy")).toBeInTheDocument();
    expect(screen.getByText("cindy@mail.com")).toBeInTheDocument();
    expect(screen.getByText("Active User")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders default values when user data is empty", () => {
    jest.spyOn(nextAuth, "useSession").mockReturnValue({
      status: "authenticated",
      data: {
        user: {},
      },
    } as any);

    render(<HalamanProfile />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});