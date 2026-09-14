export function maskUrls(text: string): string {
  const urlPattern = /https?:\/\/[^\s]+/g;
  return text.replace(urlPattern, '[URL]');
}
