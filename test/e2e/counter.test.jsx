import { commis } from '@mise/test';
import { dom, component } from '../../src';

const { render } = commis();

describe('counter example', () => {
  const { body } = document;

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
    body.innerHTML = '';

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

    await render(250);
  });

  it('should load a counter', async () => {
    expect(body.innerHTML).not.toBe('');
  });

  it('should have the proper initial state attached', async () => {
    expect(body.querySelector('#counter').innerHTML).toEqual('0');
  });

  it('should respond correctly to an increment action', async () => {
    body.querySelector('#up').click();

    await render(150);
    expect(body.querySelector('#counter').innerHTML).toEqual('1');
  });

  it('should respond correctly to an decrement action', async () => {
    body.querySelector('#down').click();

    await render(150);
    expect(body.querySelector('#counter').innerHTML).toEqual('-1');
  });
});
