import { describe, it, expect } from "vitest";
import { sanitizeText, sanitizeHtml } from "@/lib/sanitize";

describe("Sanitization Utilities", () => {
  describe("sanitizeText", () => {
    it("should strip HTML tags completely", () => {
      const input = "<script>alert('XSS');</script>Hello <b>World</b>!";
      expect(sanitizeText(input)).toBe("alert('XSS');Hello World!");
    });

    it("should strip HTML entities", () => {
      const input = "Tom &amp; Jerry &quot;Show&quot;";
      expect(sanitizeText(input)).toBe("Tom  Jerry Show");
    });

    it("should handle empty and null strings safely", () => {
      expect(sanitizeText("")).toBe("");
      expect(sanitizeText(null as unknown as string)).toBe("");
    });
  });

  describe("sanitizeHtml", () => {
    it("should allow safe HTML tags and strip script payloads", () => {
      const input = "<p>Welcome to <strong>Ravenshaw</strong></p><script>alert('hacked')</script>";
      const result = sanitizeHtml(input);
      expect(result).toContain("<strong>Ravenshaw</strong>");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
    });

    it("should strip dangerous attributes like onload or onerror", () => {
      const input = '<img src="x" onerror="alert(1)" /><p>Safe text</p>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain("onerror");
      expect(result).toContain("<p>Safe text</p>");
    });
  });
});
