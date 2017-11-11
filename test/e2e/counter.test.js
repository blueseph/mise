import { dom, component } from '../../src';
import { requestAnimationFrame, requestIdleCallback } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

describe('counter example', () => {
  let body;
  let count;
  let up;
  let down;

  beforeEach(() => {
    document.body.innerHTML = '';

    component({
      template: state => actions =>
        dom('div', null, [

          dom(
            'span', {
              id: 'counter',
            },
            state.counter,
          ),

          dom('button', {
            id: 'up',
            onclick() {
              actions.increment();
            },
          }),

          dom('button', {
            id: 'down',
            onclick() {
              actions.decrement();
            },
          }),
        ]),
      state: {
        counter: 0,
      },
      actions: {
        increment: state => ({ counter: state.counter + 1 }),
        decrement: state => ({ counter: state.counter - 1 }),
      },
    });

    body = document.body;
    count = body.querySelector('#counter');
    up = body.querySelector('#up');
    down = body.querySelector('#down');
  });

  it('should load a counter', () => {
    expect(body).not.toBe('');
  });

  it('should have the proper initial state attached', () => {
    expect(count.innerHTML).toEqual('0');
  });

  it('should respond correctly to an increment action', (done) => {
    up.click();

    requestAnimationFrame(() => {
      expect(count.innerHTML).toEqual('1');
      done();
    });
  });

  it('should respond correctly to an decrement action', (done) => {
    down.click();

    requestAnimationFrame(() => {
      expect(count.innerHTML).toEqual('-1');
      done();
    });
  });
});
