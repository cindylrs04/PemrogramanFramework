import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";

import Document from "@/pages/_document";

jest.mock("next/document", () => ({
  Html: ({ children, lang }: any) => (
    <div data-testid="html" data-lang={lang}>
      {children}
    </div>
  ),
  Head: () => <div data-testid="head" />,
  Main: () => <div data-testid="main" />,
  NextScript: () => <div data-testid="next-script" />,
}));

describe("Custom Document Page", () => {
  it("renders html layout and document parts", () => {
    render(<Document />);

    expect(screen.getByTestId("html")).toHaveAttribute("data-lang", "id");
    expect(screen.getByTestId("head")).toBeInTheDocument();
  });
});
