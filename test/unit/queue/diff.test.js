import { commis } from '@mise/test';

import { createDiff } from '../../../src/queue/diff';
import { create, types } from '../../../src/queue/fiber';
import { reconcile } from '../../../src/vdom/reconcile';

import {
  mockFiber,
  getLastMockCall,
} from '../../utils';

jest.mock('../../../src/vdom/reconcile');

const { render } = commis();

describe('diff', () => {
  const { add } = createDiff();

  it('should exist', () => {
    expect(add).toBeDefined();
  });

  it('should replace', async () => {
    const spy = jest.fn();
    const inner = () => spy;

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

    next.props.onupdate = inner;

    add(first);

    await render();

    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.replace);
    expect(spy).toHaveBeenCalled();
  });

  it('should update', async () => {
    const spy = jest.fn();
    const inner = () => spy;

    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.type = 'div';
    next.props.onupdate = inner;

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.update);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should create', async () => {
    const spy = jest.fn();

    const {
      parent,
      element,
      next,
    } = mockFiber();

    next.type = 'div';
    next.props.oncreate = spy;

    const first = create({
      parent,
      element,
      next,
    });

    add(first);

    await render();
    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.create);
    expect(spy).toHaveBeenCalled();
  });

  it('should remove', async () => {
    const spy = jest.fn();

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

    previous.props.onremove = spy;

    add(first);

    await render();
    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.remove);
    expect(spy).toHaveBeenCalled();
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
    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.replace);
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
    expect(getLastMockCall(reconcile)[0].length).toBe(4);
    expect(getLastMockCall(reconcile)[0][0].action).toBe(types.replace);
    expect(getLastMockCall(reconcile)[0][1].action).toBe(types.create);
    expect(getLastMockCall(reconcile)[0][2].action).toBe(types.create);
    expect(getLastMockCall(reconcile)[0][3].action).toBe(types.create);
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

    await render(1500);
    expect(getLastMockCall(reconcile)[0].length).toBe(2501);
  });
});
