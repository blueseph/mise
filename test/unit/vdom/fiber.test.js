import { fibers } from '../../../src/vdom/fiber';
import { mockFiber, emptyFiber } from '../../utils';

describe('fiber tests', () => {
  let fiber;

  beforeEach(() => {
    fiber = fibers();
  });

  it('should exist', () => {
    expect(fiber).toBeDefined();
  });

  describe('creating fibers', () => {
    it('should create a fiber', () => {
      const {
        parent,
        element,
        next,
        previous,
      } = mockFiber();

      const newFiber = fiber.create(
        element,
        previous,
        next,
      );

      expect(newFiber).toEqual({
        element,
        parent,
        previous,
        next,
        type: next.type,
      });
    });

    it('should handle no elements behind passed into', () => {
      const {
        parent,
        element,
      } = mockFiber();

      const newFiber = fiber.create(element);

      expect(newFiber).toEqual({
        element,
        parent,
        type: undefined,
        next: emptyFiber,
        previous: emptyFiber,
      });
    });
  });
});
