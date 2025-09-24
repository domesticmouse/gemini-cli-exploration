import { describe, it, expect } from "vitest";
import { capitalize, hello } from "./index.js";

describe("helper functions", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a word", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("world")).toBe("World");
    });

    it("should handle single character strings", () => {
      expect(capitalize("a")).toBe("A");
    });

    it("should handle empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("should not change already capitalized words", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });
  });

  describe("hello", () => {
    it("should return a greeting with capitalized name", () => {
      expect(hello("alice")).toBe("Hello Alice");
      expect(hello("bob")).toBe("Hello Bob");
    });

    it("should work with already capitalized names", () => {
      expect(hello("Alice")).toBe("Hello Alice");
    });
  });
});
