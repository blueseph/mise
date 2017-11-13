import { dom, component } from '../../src';
import { requestAnimationFrame, requestIdleCallback } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

describe('counter example', () => {
  let body;

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
  });

  it('should load a counter', (done) => {
    setTimeout(() => {
      console.log(body.outerHTML);
      expect(body.innerHTML).not.toBe('');
      done();
    }, 200);
  });
  //
  // it('should have the proper initial state attached', (done) => {
  //   setTimeout(() => {
  //     console.log(body.querySelector('#counter').innerHTML);
  //     expect(body.querySelector('#counter').innerHTML).toEqual('0');
  //     done();
  //   }, 100);
  // });
  //
  // it('should respond correctly to an increment action', (done) => {
  //   setTimeout(() => {
  //     body.querySelector('#up').click();
  //
  //     setTimeout(() => {
  //       console.log(body.querySelector('#counter').innerHTML);
  //       expect(body.querySelector('#counter').innerHTML).toEqual('1');
  //       done();
  //     }, 100);
  //   }, 100);
  // });
  //
  // it('should respond correctly to an decrement action', (done) => {
  //   down.click();
  //
  //   requestAnimationFrame(() => {
  //     expect(count.innerHTML).toEqual('-1');
  //     done();
  //   });
  // });
});
