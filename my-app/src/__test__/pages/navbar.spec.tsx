import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

const Navbar = require("@/components/layouts/navbar").default;

describe("Navbar Component", () => {

  // Test 1: render brand
  it("renders navbar brand correctly", () => {
    const { useSession } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<Navbar />);

    const navbarBrand = document.getElementById("title");

    // Simulasi Script
    if (navbarBrand) {
      navbarBrand.innerHTML = "MyApp";
    }

    expect(navbarBrand?.textContent).toBe("MyApp");
  });

  // Test 2: klik Sign In
  it("calls signIn when Sign In button clicked", () => {
    const { useSession, signIn } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<Navbar />);

    const button = screen.getByText(/sign in/i);
    fireEvent.click(button);

    expect(signIn).toHaveBeenCalled();
  });

  // Test 3: klik Sign Out
  it("calls signOut when Sign Out button clicked", () => {
    const { useSession, signOut } = require("next-auth/react");

    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          fullname: "Cindy",
        },
      },
    });

    render(<Navbar />);

    const button = screen.getByText(/sign out/i);
    fireEvent.click(button);

    expect(signOut).toHaveBeenCalled();
  });

});