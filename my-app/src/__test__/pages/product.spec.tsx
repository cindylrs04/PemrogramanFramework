import { render, screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import TampilanProduk from "@/pages/produk"; // Sesuaikan path komponen tampilanmu
import "@testing-library/jest-dom/jest-globals";

// Mocking Next Image karena Jest tidak menjalankan environment browser asli
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe("Komponen TampilanProduk", () => {
  const products = [
    {
      id: "1",
      name: "Sepatu Keren",
      price: 500000,
      image: "/sepatu.jpg",
      category: "Fashion",
    },
  ];

  it("harus merender list produk yang dikirimkan via props", () => {
    render(<TampilanProduk products={products} />);

    // Cek nama produk
    expect(screen.getByText("Sepatu Keren")).toBeInTheDocument();
    
    // Cek harga (pastikan format di komponenmu sesuai, misal menggunakan toLocaleString)
    // Jika di komponen pakai format Rp, gunakan regex
    expect(screen.getByText(/500.000/i)).toBeInTheDocument();
  });

  it("harus merender skeleton jika props products kosong atau undefined", () => {
    const { container } = render(<TampilanProduk products={[]} />);
    
    const skeleton = container.getElementsByClassName("produk__content__skeleton");
    expect(skeleton.length).toBeGreaterThan(0);
  });
});