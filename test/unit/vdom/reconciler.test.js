import { reconciler } from '../../../src/vdom/reconciler';
import { fibers, types } from '../../../src/vdom/fiber';

import { mockFiber, requestIdleCallback, requestAnimationFrame } from '../../utils';

window.requestIdleCallback = requestIdleCallback;
window.requestAnimationFrame = requestAnimationFrame;

describe('reconciler', () => {
  let recon;
  let fiber;
  let paint;

  beforeEach(() => {
    paint = jest.fn();
    recon = reconciler(paint);
    fiber = fibers();
  });

  it('should exist', () => {
    expect(recon).toBeDefined();
  });

  it('should replace', (done) => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    const first = fiber.create(
      parent,
      element,
      previous,
      next,
    );

    next.props.onupdate = () => {};

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0][0].action).toBe(types.replace);
      expect(paint.mock.calls[0][0][0].lifecycle).toBeDefined();
      done();
    }, 50);
  });

  it('should update', (done) => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.type = 'div';

    const first = fiber.create(
      parent,
      element,
      previous,
      next,
    );

    next.props.onupdate = () => {};

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0][0].action).toBe(types.update);
      expect(paint.mock.calls[0][0][0].lifecycle).toBeDefined();
      done();
    }, 50);
  });

  it('should create', (done) => {
    const {
      parent,
      element,
      next,
    } = mockFiber();

    next.type = 'div';
    next.props.oncreate = () => {};

    const first = fiber.create(
      parent,
      element,
      undefined,
      next,
    );

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0][0].action).toBe(types.create);
      expect(paint.mock.calls[0][0][0].lifecycle).toBeDefined();
      done();
    }, 50);
  });

  it('should remove', (done) => {
    const {
      parent,
      element,
      previous,
    } = mockFiber();

    const first = fiber.create(
      parent,
      element,
      previous,
      undefined,
    );

    previous.props.onremove = () => {};

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0][0].action).toBe(types.remove);
      expect(paint.mock.calls[0][0][0].lifecycle).toBeDefined();
      done();
    }, 50);
  });

  it('should handle text nodes, too', (done) => {
    const {
      parent,
      element,
    } = mockFiber();

    const previous = 'yep';
    const next = 'nope';

    const first = fiber.create(
      parent,
      element,
      previous,
      next,
    );

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0][0].action).toBe(types.replace);
      done();
    }, 50);
  });

  it('should properly process children', (done) => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.children = [{ ...next }, { ...next }, { ...next }];

    const first = fiber.create(
      parent,
      element,
      previous,
      next,
    );

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0].length).toBe(4);
      expect(paint.mock.calls[0][0][0].action).toBe(types.replace);
      expect(paint.mock.calls[0][0][1].action).toBe(types.create);
      expect(paint.mock.calls[0][0][2].action).toBe(types.create);
      expect(paint.mock.calls[0][0][3].action).toBe(types.create);
      done();
    }, 100);
  });

  it('should request another idle callback if theres too much work to do', (done) => {
    const {
      parent,
      element,
      previous,
      next,
    } = mockFiber();

    next.children = new Array(2500).fill({ ...next });

    const first = fiber.create(
      parent,
      element,
      previous,
      next,
    );

    recon.add(first);

    setTimeout(() => {
      expect(paint.mock.calls[0][0].length).toBe(2501);
      done();
    }, 400);
  });
});
