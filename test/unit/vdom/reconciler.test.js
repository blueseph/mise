import { reconciler } from '../../../src/vdom/reconciler';
import { fibers } from '../../../src/vdom/fiber';

import { mockFiber, requestIdleCallback } from '../../utils';

window.requestIdleCallback = requestIdleCallback;

jest.mock('../../../src/vdom/vdom');

describe('reconciler', () => {
  let recon;
  let fiber;

  beforeEach(() => {
    recon = reconciler();
    fiber = fibers();
  });

  it('should exist', () => {
    expect(recon).toBeDefined();
  });

  it('should reconcile', (done) => {
    const {
      element,
      next,
      previous,
    } = mockFiber();

    const first = fiber.create(
      element,
      previous,
      next,
    );

    recon.add(first);

    setTimeout(() => {
      done();
    }, 1000);
  });
});
