import { dom } from '../../../src/index';

import { getFiberizedChildren } from '../../../src/queue/children';
import { create } from '../../../src/queue/fiber';
import { mockFiber } from '../../utils';

describe('get fiberized children', () => {
  it('should return an empty list if the fiber doesnt have a previous element', () => {
    const fiber = create({});

    const children = getFiberizedChildren(fiber);

    expect(children).toEqual([]);
  });

  it('should return the correct number of children when passed down a fiber', () => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.children = [<div />, <article />];

    const fiber = create({
      parent,
      element,
      previous,
      next,
    });

    const children = getFiberizedChildren(fiber);

    expect(children.length).toEqual(2);
  });
});
