import DOMPurify from "dompurify";

// For server-side Node environment fallback where window/DOMPurify might need JSDOM or regex fallback for plain text
export function sanitizeText(input: string): string {
  if (!input) return "";
  // Strip HTML tags cleanly for plain text fields like username, full_name
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/&[a-z0-9]+;/gi, "")
    .trim();
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }
  // Server-side basic tag stripping for non-rich text if DOMPurify window is unavailable
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();
}
