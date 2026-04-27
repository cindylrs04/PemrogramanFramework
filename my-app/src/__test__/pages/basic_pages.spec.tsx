import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "@jest/globals";

import Home from "@/pages/index.tsx";
import UserSettingPage from "@/pages/user";
import UserPasswordPage from "@/pages/user/password";
import EditProfilePage from "@/pages/profile/edit";

describe("Basic Pages", () => {
  it("renders home page", () => {
    render(<Home />);

    expect(
      screen.getByText("Praktikum Next.js Pages Router")
    ).toBeInTheDocument();
    expect(screen.getByText("Mahasiswa D4 Pengembangan Web")).toBeInTheDocument();
  });

  it("renders user setting page", () => {
    render(<UserSettingPage />);
    expect(screen.getByText("User Setting Page")).toBeInTheDocument();
  });

  it("renders user password page", () => {
    render(<UserPasswordPage />);
    expect(screen.getByText("Password User Page")).toBeInTheDocument();
  });

  it("renders edit profile page", () => {
    render(<EditProfilePage />);
    expect(screen.getByText("Halaman Edit Profile")).toBeInTheDocument();
  });
});
