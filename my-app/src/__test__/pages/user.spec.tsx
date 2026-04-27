import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserSettingPage from "@/pages/setting/app";
import { describe, it, expect } from "@jest/globals";

describe("User Setting Page", () => {
  it("menampilkan teks halaman dengan benar", () => {
    render(<UserSettingPage />);

    expect(screen.getByText(/app setting page/i)).toBeInTheDocument();
  });

  it("match snapshot", () => {
    const { asFragment } = render(<UserSettingPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("memastikan teks sesuai", () => {
    const element = render(<UserSettingPage />);
    expect(element.container).toHaveTextContent("App Setting Page");
  });
});