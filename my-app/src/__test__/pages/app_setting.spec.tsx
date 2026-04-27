import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";
import Appsetting from "../../pages/setting/app";

describe("App Setting Page", () => {
  it("renders app setting page correctly", () => {
    const { asFragment } = render(<Appsetting />);

    expect(screen.getByText("App Setting Page")).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});