import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Custom404 from "@/pages/404";
import { describe, it, expect, jest } from "@jest/globals";

// mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("Halaman 404", () => {
  it("menampilkan teks 404 dengan benar", () => {
    render(<Custom404 />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/halaman tidak ditemukan/i)).toBeInTheDocument();
  });

  it("menampilkan gambar", () => {
    render(<Custom404 />);

    const image = screen.getByAltText("404");
    expect(image).toBeInTheDocument();
  });

  it("menampilkan tombol kembali ke home", () => {
    render(<Custom404 />);

    const link = screen.getByText(/kembali ke home/i);
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });

  it("match snapshot", () => {
    const { asFragment } = render(<Custom404 />);
    expect(asFragment()).toMatchSnapshot();
  });
});