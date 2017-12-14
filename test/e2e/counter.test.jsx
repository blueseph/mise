import { dom, component } from '../../src';
import { requestAnimationFrame, requestIdleCallback, render, } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

describe('counter example', () => {
  let body;
  const template = state => actions => (
    <div>
      <span id="counter">{state.counter}</span>
      <button
        id="up"
        onclick={actions.increment}
      />
      <button
        id="down"
        onclick={actions.decrement}
      />
    </div>
  );

  beforeEach(() => {
    document.body.innerHTML = '';

    component({
      template,
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

  it('should load a counter', async () => {
    await render();
    expect(body.innerHTML).not.toBe('');
  });

  it('should have the proper initial state attached', async () => {
    await render();
    expect(body.querySelector('#counter').innerHTML).toEqual('0');
  });

  it('should respond correctly to an increment action', async () => {
    await render();
    body.querySelector('#up').click();

    await render();
    expect(body.querySelector('#counter').innerHTML).toEqual('1');
  });

  it('should respond correctly to an decrement action', async () => {
    await render();
    body.querySelector('#down').click();

    await render();
    expect(body.querySelector('#counter').innerHTML).toEqual('-1');
  });
});
