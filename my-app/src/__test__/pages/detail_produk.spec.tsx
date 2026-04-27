import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest } from "@jest/globals";

import DetailProduk from "@/views/DetailProduct";

// =========================
// MOCK next/image (WAJIB)
// =========================
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// =========================
// TEST DATA
// =========================
const productMock = {
  id: "1",
  name: "Sepatu Nike",
  category: "Sepatu",
  price: 1500000,
  image: "https://example.com/image.jpg",
  description: "Sepatu olahraga premium",
};

const productNoImage = {
  id: "2",
  name: "Kaos Polos",
  category: "Pakaian",
  price: 50000,
  image: "",
  description: "",
};

// =========================
// TEST SUITE
// =========================
describe("DetailProduk Component", () => {
  // =========================
  // RENDER
  // =========================
  it("should render product detail correctly", () => {
    render(<DetailProduk products={productMock} />);

    expect(screen.getByText("Detail Produk")).toBeInTheDocument();
    expect(screen.getByText("Sepatu Nike")).toBeInTheDocument();
    expect(screen.getByText("Sepatu")).toBeInTheDocument();
    expect(screen.getByText("Rp 1.500.000")).toBeInTheDocument();
    expect(
      screen.getByText("Sepatu olahraga premium")
    ).toBeInTheDocument();
  });

  // =========================
  // IMAGE RENDER
  // =========================
  it("should render product image", () => {
    render(<DetailProduk products={productMock} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining(encodeURIComponent(productMock.image)));
  });

  // =========================
  // NO IMAGE CASE
  // =========================
  it("should show fallback when image is empty", () => {
    render(<DetailProduk products={productNoImage} />);

    expect(
      screen.getByText("Gambar tidak tersedia")
    ).toBeInTheDocument();
  });

  // =========================
  // DEFAULT DESCRIPTION
  // =========================
  it("should show default description when empty", () => {
    render(<DetailProduk products={productNoImage} />);

    expect(
      screen.getByText(
        /Produk Kaos Polos merupakan bagian dari kategori Pakaian/i
      )
    ).toBeInTheDocument();
  });
});