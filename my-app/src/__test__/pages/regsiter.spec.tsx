import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, jest, beforeAll, beforeEach } from "@jest/globals";

// =========================
// MOCK ROUTER
// =========================
const push = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ push })),
}));

const TampilanRegister = require("@/pages/auth/register").default;

// =========================
// MOCK FETCH
// =========================
const mockFetch = jest.fn<(...args: any[]) => Promise<any>>();

beforeAll(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
});

// =========================
// TEST SUITE
// =========================
describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // RENDER
  // =========================
  it("should render register page", () => {
    render(<TampilanRegister />);
    expect(screen.getByText("Halaman Register")).toBeInTheDocument();
  });

  // =========================
  // EMAIL EMPTY
  // =========================
  it("should show email required error", async () => {
    render(<TampilanRegister />);
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    });
  });

  // =========================
  // PASSWORD ERROR
  // =========================
  it("should show password error", async () => {
    render(<TampilanRegister />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Fullname"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Password minimal 6 karakter")
      ).toBeInTheDocument();
    });
  });

  // =========================
  // SUCCESS REGISTER
  // =========================
  it("success register", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ message: "success" }),
    });

    render(<TampilanRegister />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Fullname"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith("/auth/login");
    });
  });

  // =========================
  // ERROR 400
  // =========================
  it("api error register", async () => {
    mockFetch.mockResolvedValue({
      status: 400,
      json: async () => ({ message: "Gagal register" }),
    });

    render(<TampilanRegister />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Fullname"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Gagal register")).toBeInTheDocument();
    });
  });

  // =========================
  // NETWORK ERROR
  // =========================
  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    render(<TampilanRegister />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Fullname"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Gagal terhubung ke server")
      ).toBeInTheDocument();
    });
  });
});