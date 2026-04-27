import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("@/utlis/db/servicefirebase", () => ({
  signUp: jest.fn(),
  retrieveProducts: jest.fn(),
  retrieveDataByID: jest.fn(),
}));

const { signUp, retrieveProducts, retrieveDataByID } = require("@/utlis/db/servicefirebase");
const helloHandler = require("@/pages/api/hello").default;
const registerHandler = require("@/pages/api/register").default;
const revalidateHandler = require("@/pages/api/revalidate").default;
const produkHandler = require("@/pages/api/[[...produk]]").default;

function createRes() {
  const res: any = {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader: jest.fn((k: string, v: string) => {
      res.headers[k] = v;
    }),
    status: jest.fn((code: number) => {
      res.statusCode = code;
      return res;
    }),
    send: jest.fn((payload: any) => {
      res.body = payload;
      return res;
    }),
    json: jest.fn((payload: any) => {
      res.body = payload;
      return res;
    }),
    revalidate: jest.fn(async () => undefined),
  };

  return res;
}

describe("API Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hello handler returns static JSON", () => {
    const req = {} as any;
    const res = createRes();

    helloHandler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });

  it("register handler returns 200 on signUp success", async () => {
    signUp.mockImplementation(async (_body: any, cb: Function) => {
      cb({ status: "success", message: "ok" });
    });

    const req = { method: "POST", body: { email: "a@mail.com" } } as any;
    const res = createRes();

    await registerHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("ok");
  });

  it("register handler returns 400 on signUp failure", async () => {
    signUp.mockImplementation(async (_body: any, cb: Function) => {
      cb({ status: "error", message: "failed" });
    });

    const req = { method: "POST", body: { email: "a@mail.com" } } as any;
    const res = createRes();

    await registerHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.name).toBe("failed");
  });

  it("register handler rejects non-POST methods", async () => {
    const req = { method: "GET" } as any;
    const res = createRes();

    await registerHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body.name).toContain("Method not allowed");
  });

  it("revalidate handler revalidates produk route", async () => {
    const req = { query: { data: "produk" } } as any;
    const res = createRes();

    await revalidateHandler(req, res);

    expect(res.revalidate).toHaveBeenCalledWith("/produk/static");
    expect(res.statusCode).toBe(200);
    expect(res.body.revalidated).toBe(true);
  });

  it("revalidate handler handles revalidate errors", async () => {
    const req = { query: { data: "produk" } } as any;
    const res = createRes();
    res.revalidate.mockRejectedValueOnce(new Error("boom"));

    await revalidateHandler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.revalidated).toBe(false);
  });

  it("revalidate handler handles invalid query", async () => {
    const req = { query: { data: "other" } } as any;
    const res = createRes();

    await revalidateHandler(req, res);

    expect(res.body.revalidated).toBe(false);
    expect(res.body.message).toContain("Invalid query");
  });

  it("produk handler returns single product when id exists", async () => {
    retrieveDataByID.mockResolvedValue({ id: "1", name: "One" });

    const req = { query: { produk: ["produk", "1"] } } as any;
    const res = createRes();

    await produkHandler(req, res);

    expect(retrieveDataByID).toHaveBeenCalledWith("products", "1");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual({ id: "1", name: "One" });
  });

  it("produk handler returns products list without id", async () => {
    retrieveProducts.mockResolvedValue([{ id: "1" }, { id: "2" }]);

    const req = { query: { produk: ["produk"] } } as any;
    const res = createRes();

    await produkHandler(req, res);

    expect(retrieveProducts).toHaveBeenCalledWith("products");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });
});
