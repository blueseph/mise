import { isEmpty } from '../../../src/utils';

describe('is empty ', () => {
  it('should properly determine if an object is empty when it is', () => {
    const empty = {
      a: {},
      b: {},
      c: {},
    };

    expect(isEmpty(empty)).toEqual(true);
  });

  it('should properly determine if an object is empty when it is not', () => {
    const empty = {
      a: {},
      b: { key: 'value' },
      c: {},
    };

    expect(isEmpty(empty)).toEqual(false);
  });
});
