import { getUniques } from '../../../src/utils';

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

