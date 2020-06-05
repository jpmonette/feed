export function sanitize(url: String | undefined): String | undefined {
  if (typeof (url) === 'undefined') {
    return;
  }
  return url.replace(/&/g, '&amp;');
}
