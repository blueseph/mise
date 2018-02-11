import { makeCopy } from '../../../src/utils';

describe('make copy', () => {
  it('should properly clone an array', () => {
    const initial = [1, 2, 3];
    const copy = makeCopy(initial);

    expect(copy).toEqual(initial);
    expect(copy).not.toBe(initial);
  });

  it('should properly clone an object', () => {
    const initial = { a: 1, b: 2 };
    const copy = makeCopy(initial);

    expect(copy).toEqual(initial);
    expect(copy).not.toBe(initial);
  });
});
