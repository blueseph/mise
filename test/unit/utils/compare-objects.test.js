import { compareObjects } from '../../../src/utils';

describe('compare objects', () => {
  it('should report additions if first object is empty', () => {
    const first = {};
    const second = { a: 1 };

    const differences = compareObjects(first, second);

    expect(differences).toEqual({ add: { a: 1 }, remove: {}, update: {} });
  });

  it('should report additions if second object is empty', () => {
    const first = { a: 1 };
    const second = {};

    const differences = compareObjects(first, second);

    expect(differences).toEqual({ add: {}, remove: { a: 1 }, update: {} });
  });

  it('should report additions if first object is empty', () => {
    const first = { a: 1 };
    const second = { a: 2 };

    const differences = compareObjects(first, second);

    expect(differences).toEqual({ add: {}, remove: {}, update: { a: 2 } });
  });

  it('should handle empty objects', () => {
    expect(compareObjects()).toEqual({ add: {}, remove: {}, update: {} });
  });

  it('should be able to compare complex objects', () => {
    const first = { id: 'test', styles: { fontSize: '18px' } };
    const second = { id: 'uniques', disabled: true };

    const differences = compareObjects(first, second);

    expect(differences).toEqual({ add: { disabled: true }, remove: { styles: { fontSize: '18px' } }, update: { id: 'uniques' } });
  });
});
