import { normalizeOrigin } from './cors-origin.util';

describe('normalizeOrigin', () => {
  it('removes trailing slash and path/query/hash via URL origin normalization', () => {
    expect(normalizeOrigin('http://localhost:3000/path?x=1#fragment')).toBe(
      'http://localhost:3000',
    );
  });

  it('drops default http/https ports and lowercases scheme/host', () => {
    expect(normalizeOrigin('HTTP://LOCALHOST:80')).toBe('http://localhost');
    expect(normalizeOrigin('HTTPS://WEB.LOCALHOST:443')).toBe(
      'https://web.localhost',
    );
  });

  it('keeps non-default ports', () => {
    expect(normalizeOrigin('https://web.localhost:8443')).toBe(
      'https://web.localhost:8443',
    );
  });
});
