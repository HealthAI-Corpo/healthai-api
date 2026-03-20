export function normalizeOrigin(origin: string): string {
  const parsed = new URL(origin);
  const protocol = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();
  const isDefaultPort =
    (protocol === 'http:' && parsed.port === '80') ||
    (protocol === 'https:' && parsed.port === '443');
  const port = parsed.port && !isDefaultPort ? `:${parsed.port}` : '';
  return `${protocol}//${hostname}${port}`;
}
