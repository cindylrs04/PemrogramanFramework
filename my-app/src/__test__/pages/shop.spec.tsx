import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HalamanToko from "@/pages/shop/[[...slug]]";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import * as nextRouter from "next/router";

describe("Halaman Toko", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("menampilkan judul halaman", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: ["kategori", "produk"] },
    } as any);

    render(<HalamanToko />);

    expect(screen.getByText(/halaman toko/i)).toBeInTheDocument();
  });

  it("menampilkan slug dengan format benar", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: ["sepatu", "nike"] },
    } as any);

    render(<HalamanToko />);

    expect(screen.getByText(/sepatu-nike/i)).toBeInTheDocument();
  });

  it("match snapshot", () => {
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      query: { slug: ["snapshot", "test"] },
    } as any);

    const { asFragment } = render(<HalamanToko />);
    expect(asFragment()).toMatchSnapshot();
  });
});