import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// =========================
// MOCK FIREBASE
// =========================
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

// =========================
// MOCK BCRYPT
// =========================
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

// =========================
// CAST MOCK (SAFE)
// =========================
const { getDocs, getDoc, addDoc, updateDoc } = require("firebase/firestore");
const bcrypt = require("bcrypt");
const mockedGetDocs = getDocs as any;
const mockedGetDoc = getDoc as any;
const mockedAddDoc = addDoc as any;
const mockedUpdateDoc = updateDoc as any;
const mockedHash = bcrypt.hash as any;
const {
  retrieveProducts,
  retrieveDataByID,
  signIn,
  signUp,
  signInWithGoogle,
} = require("@/utlis/db/servicefirebase");

// =========================
// TEST SUITE
// =========================
describe("Firebase Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // retrieveProducts
  // =========================
  it("should retrieve products", async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({ name: "Product 1" }),
        },
      ],
    } as any);

    const result = await retrieveProducts("products");

    expect(result).toEqual([
      { id: "1", name: "Product 1" },
    ]);
  });

  // =========================
  // retrieveDataByID
  // =========================
  it("should retrieve data by ID", async () => {
    mockedGetDoc.mockResolvedValue({
      data: () => ({ name: "Product Detail" }),
    } as any);

    const result = await retrieveDataByID("products", "1");

    expect(result).toEqual({
      name: "Product Detail",
    });
  });

  // =========================
  // signIn
  // =========================
  it("should return user if found", async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({ email: "test@mail.com" }),
        },
      ],
    } as any);

    const result = await signIn("test@mail.com");

    expect(result).toEqual({
      id: "1",
      email: "test@mail.com",
    });
  });

  it("should return null if user not found", async () => {
    mockedGetDocs.mockResolvedValue({
      docs: [],
    } as any);

    const result = await signIn("notfound@mail.com");

    expect(result).toBeNull();
  });

  // =========================
  // signUp
  // =========================
  it("should fail if user already exists", async () => {
    const callback = jest.fn();

    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({ email: "test@mail.com" }),
        },
      ],
    } as any);

    await signUp(
      {
        email: "test@mail.com",
        fullname: "Test",
        password: "123",
      },
      callback
    );

    expect(callback).toHaveBeenCalledWith({
      status: "error",
      message: "User already exists",
    });
  });

  it("should register new user", async () => {
    const callback = jest.fn();

    mockedGetDocs.mockResolvedValue({
      docs: [],
    } as any);

    mockedHash.mockResolvedValue("hashed-password");

    mockedAddDoc.mockResolvedValue({});

    await signUp(
      {
        email: "new@mail.com",
        fullname: "New User",
        password: "123",
      },
      callback
    );

    expect(mockedHash).toHaveBeenCalled();
    expect(mockedAddDoc).toHaveBeenCalled();
  });

  // =========================
  // Google Login
  // =========================
  it("should update existing google user", async () => {
    const callback = jest.fn();

    mockedGetDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({ email: "google@mail.com" }),
        },
      ],
    } as any);

    mockedUpdateDoc.mockResolvedValue({});

    await signInWithGoogle(
      {
        email: "google@mail.com",
        fullname: "Google User",
        image: "img.png",
        type: "google",
      },
      callback
    );

    expect(mockedUpdateDoc).toHaveBeenCalled();
  });

  it("should create new google user", async () => {
    const callback = jest.fn();

    mockedGetDocs.mockResolvedValue({
      docs: [],
    } as any);

    mockedAddDoc.mockResolvedValue({});

    await signInWithGoogle(
      {
        email: "newgoogle@mail.com",
        fullname: "New Google",
        image: "img.png",
        type: "google",
      },
      callback
    );

    expect(mockedAddDoc).toHaveBeenCalled();
  });

  it("should handle error in google login", async () => {
    const callback = jest.fn();

    mockedGetDocs.mockRejectedValue(new Error("Error"));

    await signInWithGoogle(
      {
        email: "error@mail.com",
      },
      callback
    );

    expect(callback).toHaveBeenCalledWith({
      status: false,
      message: "Failed to process OAuth login",
    });
  });
});