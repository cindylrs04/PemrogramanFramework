import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlugDetailPage from "@/pages/blog/[slug]";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import * as nextRouter from "next/router";

describe("Halaman Blog Slug", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("menampilkan slug dengan benar", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: "test-slug" },
    } as any);

    render(<SlugDetailPage />);

    expect(screen.getByText(/halaman slug/i)).toBeInTheDocument();
    expect(screen.getByText(/test-slug/i)).toBeInTheDocument();
  });

  it("slug sesuai dengan yang diberikan", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: "cindy-blog" },
    } as any);

    render(<SlugDetailPage />);

    expect(screen.getByText(/cindy-blog/i)).toBeInTheDocument();
  });

  it("match snapshot", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: "snapshot-test" },
    } as any);

    const { asFragment } = render(<SlugDetailPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});