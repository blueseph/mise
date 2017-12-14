import { dom, component } from '../../src';
import { commis } from '@mise/test';

const { render } = commis();

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

  beforeEach(async () => {
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

    await render();
  });

  it('should load a counter', async () => {
    expect(body.innerHTML).not.toBe('');
  });

  it('should have the proper initial state attached', async () => {
    expect(body.querySelector('#counter').innerHTML).toEqual('0');
  });

  it('should respond correctly to an increment action', async () => {
    body.querySelector('#up').click();

    await render();
    expect(body.querySelector('#counter').innerHTML).toEqual('1');
  });

  it('should respond correctly to an decrement action', async () => {
    body.querySelector('#down').click();

    await render();
    expect(body.querySelector('#counter').innerHTML).toEqual('-1');
  });
});
