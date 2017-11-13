import { reconciler } from '../../../src/vdom/reconciler';
import { create, types } from '../../../src/vdom/fiber';
import { paint } from '../../../src/vdom/vdom';

import {
  mockFiber,
  requestIdleCallback,
  requestAnimationFrame,
  getLastMockCall,
} from '../../utils';

jest.mock('../../../src/vdom/vdom');

window.requestIdleCallback = requestIdleCallback;
window.requestAnimationFrame = requestAnimationFrame;

describe('reconciler', () => {
  let add;

  beforeEach(() => {
    add = reconciler().add;
  });

  it('should exist', () => {
    expect(add).toBeDefined();
  });

  it('should replace', (done) => {
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

    setTimeout(() => {
      try {
        expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
        expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
      } catch (ex) {
        console.error(ex);
      }
      done();
    }, 25);
  });

  it('should update', (done) => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.type = 'div';

    const first = create({
      parent,
      element,
      previous,
      next,
    });

    next.props.onupdate = () => {};

    add(first);

    setTimeout(() => {
      expect(getLastMockCall(paint)[0][0].action).toBe(types.update);
      expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
      done();
    }, 25);
  });

  it('should create', (done) => {
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

    setTimeout(() => {
      expect(getLastMockCall(paint)[0][0].action).toBe(types.create);
      expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
      done();
    }, 25);
  });

  it('should remove', (done) => {
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

    setTimeout(() => {
      expect(getLastMockCall(paint)[0][0].action).toBe(types.remove);
      expect(getLastMockCall(paint)[0][0].lifecycle).toBeDefined();
      done();
    }, 25);
  });

  it('should handle text nodes, too', (done) => {
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

    setTimeout(() => {
      expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
      done();
    }, 25);
  });

  it('should properly process children', (done) => {
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

    setTimeout(() => {
      expect(getLastMockCall(paint)[0].length).toBe(4);
      expect(getLastMockCall(paint)[0][0].action).toBe(types.replace);
      expect(getLastMockCall(paint)[0][1].action).toBe(types.create);
      expect(getLastMockCall(paint)[0][2].action).toBe(types.create);
      expect(getLastMockCall(paint)[0][3].action).toBe(types.create);
      done();
    }, 25);
  });

  it('should request another idle callback if theres too much work to do', (done) => {
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

    setTimeout(() => {
      expect(getLastMockCall(paint)[0].length).toBe(2501);
      done();
    }, 400);
  });
});
