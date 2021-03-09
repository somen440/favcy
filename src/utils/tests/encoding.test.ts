import { fromBase64, toBase64 } from "../encoding";

describe('たしざん', (): void => {
  test('一桁', (): void => {
    expect(1 + 1).toBe(2);
  });
})

describe('base64', (): void => {
  const token = 'token'
  test('encoding', (): void => {
    expect(toBase64(token)).toBe('dG9rZW4=');
  })
  test('decoding', (): void => {
    expect(fromBase64('dG9rZW4=')).toBe(token);
  })
})

export {}
