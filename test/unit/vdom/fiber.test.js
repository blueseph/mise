import { create } from '../../../src/vdom/fiber';
import { mockFiber } from '../../utils';

describe('fiber tests', () => {
  it('should exist', () => {
    expect(create).toBeDefined();
  });

  describe('creating fibers', () => {
    it('should create a fiber', () => {
      const {
        parent,
        element,
        next,
        previous,
      } = mockFiber();

      const fiber = create({
        parent,
        element,
        previous,
        next,
      });

      const nextElement = document.createElement('ul');
      nextElement.setAttribute('class', 'b');

      expect(fiber).toEqual({
        parent,
        previous: {
          tree: previous,
          element,
        },
        next: {
          tree: next,
          element: nextElement,
        },
      });
    });

    it('should handle no elements being passed in', () => {
      const {
        parent,
        element,
      } = mockFiber();

      const fiber = create({ parent, element });

      expect(fiber).toEqual({
        parent,
        previous: {
          element,
          tree: null,
        },
        next: {
          element: null,
          tree: null,
        },
      });
    });
  });
});
