import { dom } from '../../../src/index';

import { getFiberizedChildren } from '../../../src/queue/children';
import { create } from '../../../src/queue/fiber';
import { mockFiber } from '../../utils';

describe('get fiberized children', () => {
  it('should return an empty list if the fiber doesnt have a previous element', () => {
    const fiber = create({});

    const children = getFiberizedChildren(fiber);

    expect(children.length).toEqual(0);
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

  it('should return an empty list if the parent is a text node', () => {
    const {
      element,
      previous,
      next,
    } = mockFiber();

    const parent = document.createTextNode('text node parent');

    const fiber = create({
      parent,
      element,
      previous,
      next,
    });

    const children = getFiberizedChildren(fiber);

    expect(children.length).toEqual(0);
  });
});
