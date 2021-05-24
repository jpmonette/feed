export function sanitize(url: string | undefined): string | undefined {
  return url?.replace(/&/g, "&amp;");
}
