import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("@/views/produk", () => ({
  __esModule: true,
  default: ({ products }: any) => (
    <div data-testid="produk">
      {products.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  ),
}));

const HalamanProdukServer = require("@/pages/produk/server").default;

const mockProducts = [
  { id: "1", name: "Produk A" },
  { id: "2", name: "Produk B" },
];

describe("Halaman Produk Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page title and mocked product list", () => {
    render(<HalamanProdukServer products={mockProducts as any} />);

    expect(
      screen.getByText("Halaman Produk Server")
    ).toBeInTheDocument();

    expect(screen.getByTestId("produk")).toBeInTheDocument();

    expect(screen.getByText("Produk A")).toBeInTheDocument();
    expect(screen.getByText("Produk B")).toBeInTheDocument();
  });
});