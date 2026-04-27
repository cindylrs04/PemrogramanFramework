import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import Category from "../../pages/shop/[[...slug]]";
import * as nextRouter from "next/router";

describe("Category Page", () => {
  beforeEach(() => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: {
        slug: ["elektronik", "laptop"],
      },
    } as any);
  });

  it("renders page title", () => {
    render(<Category />);
    expect(screen.getByText("Halaman Toko")).toBeInTheDocument();
  });

  it("renders slug as combined text", () => {
    render(<Category />);
    expect(screen.getByText(/elektronik-laptop/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Category />);
    expect(asFragment()).toMatchSnapshot();
  });
});