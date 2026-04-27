import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as nextRouter from "next/router";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ✅ FIX NEXT-AUTH
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  SessionProvider: ({ children }: any) => children,
}));

// ✅ MOCK SCRIPT
jest.mock("next/script", () => ({
  __esModule: true,
  default: () => <></>,
}));

// ✅ MOCK FONT
jest.mock("next/font/google", () => ({
  Poppins: () => ({
    className: "poppins-font",
  }),
}));

// ❗ PENTING: SESUAIKAN PATH INI
jest.mock("@/components/layouts/navbar/index", () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar</div>,
}));

const AppShell = require("@/components/layouts/Appshell").default;

describe("AppShell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("menampilkan children", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      pathname: "/",
    } as any);

    render(
      <AppShell>
        <div>Test Children</div>
      </AppShell>
    );

    expect(screen.getByText(/test children/i)).toBeInTheDocument();
  });

  it("menampilkan navbar jika bukan halaman disable", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      pathname: "/",
    } as any);

    render(
      <AppShell>
        <div>Test</div>
      </AppShell>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("tidak menampilkan navbar pada halaman tertentu", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      pathname: "/auth/login",
    } as any);

    render(
      <AppShell>
        <div>Test</div>
      </AppShell>
    );

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("match snapshot", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      pathname: "/",
    } as any);

    const { asFragment } = render(
      <AppShell>
        <div>Snapshot</div>
      </AppShell>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});