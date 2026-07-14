function escapeAmp(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export function sanitize(text: string): string;
export function sanitize(text: string | undefined): string | undefined;
export function sanitize(text: string | undefined): string | undefined {
  if (text === undefined) return undefined;
  return escapeAmp(text);
}

export function sanitizeUrl(url: string | URL, xml?: boolean): string;
export function sanitizeUrl(url: string | URL | undefined, xml?: boolean): string | undefined;
export function sanitizeUrl(url: string | URL | undefined, xml = true): string | undefined {
  if (url === undefined) return undefined;
  const parsed = typeof url === "string" ? new URL(url) : url;
  return xml ? escapeAmp(parsed.toString()) : parsed.toString();
}
