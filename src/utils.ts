function escapeAmp(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export function sanitize(text: string): string;
export function sanitize(text: string | undefined): string | undefined;
export function sanitize(text: string | undefined): string | undefined {
  if (text === undefined) return undefined;
  return escapeAmp(text);
}

// xml-js escapes `<` and `>` in text nodes, but only double quotes in attributes.
export function sanitizeAttribute(value: string): string;
export function sanitizeAttribute(value: string | undefined): string | undefined;
export function sanitizeAttribute(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return escapeAmp(value).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function sanitizeUrl(url: string): string;
export function sanitizeUrl(url: string | undefined): string | undefined;
export function sanitizeUrl(url: string | undefined): string | undefined {
  if (url === undefined) return undefined;
  const parsed = new URL(url);
  return escapeAmp(parsed.toString());
}
