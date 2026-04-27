import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import HalamanAdmin from "@/pages/admin"; // sesuaikan path kalau beda

describe("Halaman Admin", () => {
  it("renders admin page correctly", () => {
    const { asFragment } = render(<HalamanAdmin />);

    // Ambil elemen berdasarkan test id
    const title = screen.getByTestId("title");

    // Assertion
    expect(title.textContent).toBe("Halaman Admin");

    // Snapshot test
    expect(asFragment()).toMatchSnapshot();
  });
});