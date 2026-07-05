import { sanitize, sanitizeUrl } from "../utils";

describe("sanitize", () => {
  it("should escape ampersands", () => {
    expect(sanitize("a&b&c")).toBe("a&amp;b&amp;c");
  });

  it("should return undefined for undefined input", () => {
    expect(sanitize(undefined)).toBeUndefined();
  });
});

describe("sanitizeUrl", () => {
  it("should escape ampersands and normalize URLs", () => {
    expect(sanitizeUrl("https://test.com/?a=1&b=2")).toBe("https://test.com/?a=1&amp;b=2");
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
  });

  it("should throw for invalid URLs", () => {
    expect(() => sanitizeUrl("not-a-url")).toThrow();
  });

  it("should return undefined for undefined input", () => {
    expect(sanitizeUrl(undefined)).toBeUndefined();
  });
});
