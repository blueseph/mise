import { create } from '../../../src/vdom/fiber';
import { mockFiber, emptyFiber } from '../../utils';

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

      expect(fiber).toEqual({
        parent,
        previous: {
          tree: previous,
          element,
        },
        next: {
          tree: next,
          element: null,
        },
      });
    });

    it('should handle no elements behind passed into', () => {
      const {
        parent,
        element,
      } = mockFiber();

      const fiber = create({ parent, element });

      expect(fiber).toEqual({
        parent,
        previous: {
          element,
          tree: emptyFiber,
        },
        next: {
          element: null,
          tree: emptyFiber,
        },
      });
    });
  });
});
