import { describe, expect, it, jest } from "@jest/globals";
import { fetcher } from "@/utlis/swr/fetcher";

// Kita simulasikan (mock) fungsi fetch bawaan browser
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("Fetcher Util", () => {
  it("harus mengembalikan data json saat fetch berhasil", async () => {
    const mockData = { message: "success" };
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const result = await fetcher("https://api.example.com");
    
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com");
  });
});