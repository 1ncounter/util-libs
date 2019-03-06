import { lcg } from './lcg';

test('lcg return must be a number', () => {
  expect(typeof lcg(10)).toBe('number');
});
