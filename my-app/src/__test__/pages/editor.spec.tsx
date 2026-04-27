import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// mock router HARUS di atas
const pushMock = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const EditorPage = require("../../pages/editor").default;

describe("Editor Page", () => {
  beforeEach(() => {
    pushMock.mockClear();
    jest.clearAllMocks();
  });

  it("shows loading when status is loading", () => {
    const { useSession } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({
      status: "loading",
      data: null,
    });

    render(<EditorPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects if user is not editor", async () => {
    const { useSession } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          fullname: "Cindy",
          role: "user",
        },
      },
    });

    render(<EditorPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("renders editor dashboard if role is editor", () => {
    const { useSession } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          fullname: "Cindy",
          role: "editor",
        },
      },
    });

    const { asFragment } = render(<EditorPage />);

    expect(screen.getByText("Dashboard Editor")).toBeInTheDocument();
    expect(
      screen.getByText(/Selamat datang, Cindy/i)
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});