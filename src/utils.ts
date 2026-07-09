function escapeAmp(value: string): string {
  return value.replace(/&/g, "&amp;");
}

export function sanitize(text: string): string;
export function sanitize(text: string | undefined): string | undefined;
export function sanitize(text: string | undefined): string | undefined {
  if (text === undefined) return undefined;
  return escapeAmp(text);
}

export function sanitizeUrl(url: string): string;
export function sanitizeUrl(url: string | undefined): string | undefined;
export function sanitizeUrl(url: string | undefined): string | undefined {
  if (url === undefined) return undefined;
  const parsed = new URL(url);
  return escapeAmp(parsed.toString());
}

export function toArray<T>(itemOrArray: T | T[]): T[] {
  return Array.isArray(itemOrArray) ? itemOrArray : [itemOrArray];
}
