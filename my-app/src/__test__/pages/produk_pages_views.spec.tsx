import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const HalamanProduk = require("@/pages/produk/[produk]").default;
const { getStaticPaths, getStaticProps } = require("@/pages/produk/[produk]");
const HalamanProdukStatic = require("@/pages/produk/static").default;
const { getStaticProps: getStaticPropsStatic } = require("@/pages/produk/static");
const TampilanProduk = require("@/views/produk").default;
const Hero = require("@/views/produk/hero").default;
const Main = require("@/views/produk/main").default;

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

describe("Produk Pages and Views", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dynamic produk page with detail content", () => {
    render(
      <HalamanProduk
        product={{
          id: "1",
          name: "Produk X",
          category: "Kategori",
          price: 1000,
          image: "https://example.com/a.jpg",
        }}
      />
    );

    expect(screen.getByText("Detail Produk")).toBeInTheDocument();
    expect(screen.getByText("Produk X")).toBeInTheDocument();
  });

  it("getStaticPaths returns mapped produk ids", async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ data: [{ id: "1" }, { id: "2" }] }),
    });

    const result = await getStaticPaths();

    expect(result.paths).toEqual([
      { params: { produk: "1" } },
      { params: { produk: "2" } },
    ]);
    expect(result.fallback).toBe(false);
  });

  it("getStaticProps for dynamic produk returns product prop", async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ data: { id: "1", name: "Produk Satu" } }),
    });

    const result = await getStaticProps({ params: { produk: "1" } });

    expect(result.props.product.id).toBe("1");
  });

  it("renders static produk page and product list", () => {
    render(
      <HalamanProdukStatic
        products={[
          {
            id: "1",
            name: "Produk A",
            category: "A",
            price: 100,
            image: "https://example.com/a.jpg",
          },
        ]}
      />
    );

    expect(screen.getByText("Halaman Produk Static")).toBeInTheDocument();
    expect(screen.getByText("Product Page")).toBeInTheDocument();
    expect(screen.getByText("Produk A")).toBeInTheDocument();
  });

  it("getStaticProps for static produk returns products and revalidate", async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ data: [{ id: "1", name: "A" }] }),
    });

    const result = await getStaticPropsStatic();

    expect(result.props.products).toHaveLength(1);
    expect(result.revalidate).toBe(10);
  });

  it("renders produk skeleton when products are empty", () => {
    const { container } = render(<TampilanProduk products={[]} />);

    expect(screen.getByText("Product Page")).toBeInTheDocument();
    expect(container.querySelector('[class*="skeleton"]')).toBeTruthy();
  });

  it("renders hero and main sections", () => {
    render(
      <>
        <Hero />
        <Main />
      </>
    );

    expect(screen.getByText("Hero Section")).toBeInTheDocument();
    expect(screen.getByText("Main Section")).toBeInTheDocument();
  });
});
