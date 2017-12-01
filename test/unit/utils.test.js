import { getUniques, compose } from '../../src/utils';

describe('get uniques', () => {
  it('should properly find the uniques', () => {
    const first = { a: '', b: '', c: '' };
    const second = { a: '', b: '', d: '' };

    const uniques = getUniques(first, second);
    expect(uniques.size).toBe(4);
    expect([...uniques.values()]).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should handle undef/null as well', () => {
    const real = { a: '', b: '' };
    const fake = null;

    const first = getUniques(real, fake);
    const second = getUniques(fake, real);

    const set = new Set(['a', 'b']);
    expect(first).toEqual(set);
    expect(second).toEqual(set);

    expect(first).toEqual(second);
  });
});

describe('compose', () => {
  it('should correctly compose functions in order', () => {
    const adder = x => x + 5;
    const doubler = x => x * 2;

    expect(compose(adder, doubler)(2)).toBe(9);
    expect(compose(doubler, adder)(2)).toBe(14);
  });

  it('should be fine with multiple arguments', () => {
    const adder = (x, y) => x + y;
    const doubler = x => x * 2;

    expect(compose(doubler, adder)(3, 2)).toBe(10);
  });

  it('should properly handle no functions', () => {
    expect(compose()(1, 2)).toBe(1);
    expect(compose()(3)).toBe(3);
    expect(compose()()).toBe(undefined);
  });

  it('should handle only one function', () => {
    const fn = () => {};

    expect(compose(fn)).toBe(fn);
  });
});
