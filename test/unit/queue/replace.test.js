import { shouldReplace } from '../../../src/queue/replace';

describe('should replace', () => {
  it('should properly tell if two different types need to be replaced', () => {
    const previous = {};
    const next = '';

    expect(shouldReplace(previous, next)).toEqual(true);
  });

  it('should tell if two strings need to be replaced', () => {
    const previous = 'hey';
    const next = 'hello';

    expect(shouldReplace(previous, next)).toEqual(true);
    expect(shouldReplace(previous, previous)).toEqual(false);
  });

  it('should tell if two different types need to be replaced', () => {
    const previous = { type: 'div', };
    const next = { type: 'main', };

    expect(shouldReplace(previous, next)).toEqual(true);
  });
});
