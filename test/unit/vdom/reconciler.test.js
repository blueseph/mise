import { commis } from '@mise/test';

import { reconciler } from '../../../src/vdom/reconciler';
import { create, types } from '../../../src/vdom/fiber';
import { paint } from '../../../src/vdom/vdom';

import {
  mockFiber,
  getLastMockCall,
} from '../../utils';

jest.mock('../../../src/vdom/vdom');

const { render } = commis();

describe('reconciler', () => {
  const { add } = reconciler();

  it('should exist', () => {
    expect(add).toBeDefined();
  });

  it('should replace', async () => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    next.props.onupdate = () => {};

    add(first);

    await render();
    expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
    expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
  });

  it('should update', async () => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.type = 'div';
    next.props.onupdate = () => {};

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(paint)[0][0].action).toBe(types.update);
    expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
  });

  it('should create', async () => {
    const {
      parent,
      element,
      next,
    } = mockFiber();

    next.type = 'div';
    next.props.oncreate = () => {};

    const first = create({
      parent,
      element,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(paint)[0][0].action).toBe(types.create);
    expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
  });

  it('should remove', async () => {
    const {
      parent,
      element,
      previous,
    } = mockFiber();

    const first = create({
      parent,
      element,
      previous,
    });

    previous.props.onremove = () => {};

    add(first);

    await render();
    expect(getLastMockCall(paint)[0][0].action).toBe(types.remove);
    expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
  });

  it('should handle text nodes, too', async () => {
    const {
      parent,
      element,
    } = mockFiber();

    const previous = 'yep';
    const next = 'nope';

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
  });

  it('should properly process children', async () => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.children = [{ ...next }, { ...next }, { ...next }];

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(paint)[0].length).toBe(4);
    expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
    expect(getLastMockCall(paint)[0][1].action).toBe(types.create);
    expect(getLastMockCall(paint)[0][2].action).toBe(types.create);
    expect(getLastMockCall(paint)[0][3].action).toBe(types.create);
  });

  it('should request another idle callback if theres too much work to do', async () => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.children = new Array(2500).fill({ ...next });

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    add(first);

    await render(500);
    expect(getLastMockCall(paint)[0].length).toBe(2501);
  });
});
