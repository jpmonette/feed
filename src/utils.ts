export function sanitize(url: string | undefined): string | undefined {
  if (typeof url === "undefined") {
    return;
  }
  return url.replace(/&/g, "&amp;");
}

export function toArray<T>(itemOrArray: T | T[]): T[] {
  return itemOrArray instanceof Array ? itemOrArray : [itemOrArray];
}
