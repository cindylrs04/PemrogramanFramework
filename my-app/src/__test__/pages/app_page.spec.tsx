import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";

import App from "@/pages/_app";

jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: any) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock("@/components/layouts/Appshell", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="appshell">{children}</div>,
}));

describe("Custom App Page", () => {
  it("wraps component with SessionProvider and AppShell", () => {
    const MockPage = (props: any) => <div>Mock Page {props.name}</div>;

    render(
      <App
        Component={MockPage as any}
        pageProps={{ session: { user: { name: "Tester" } }, name: "Tester" } as any}
      />
    );

    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByTestId("appshell")).toBeInTheDocument();
    expect(screen.getByText("Mock Page Tester")).toBeInTheDocument();
  });
});
