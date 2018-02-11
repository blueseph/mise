import { shouldUpdate } from '../../../src/queue/update';

describe('should replace', () => {
  it('should properly tell if two different types need to be updated', () => {
    const previous = {};
    const next = '';

    expect(shouldUpdate(previous, next)).toEqual(false);
  });

  it('should tell if two objects need to be updated', () => {
    const previous = { type: 'div' };
    const next = { type: 'main' };

    expect(shouldUpdate(previous, next)).toEqual(true);
  });
});
