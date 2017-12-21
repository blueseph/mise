import { commis } from '@mise/test';

import { component, dom } from '../../src';

const { render } = commis();

describe('component tests', () => {
  let body;
  let middleware;
  let middlewareFn;
  let init;
  let initFn;

  beforeEach(async () => {
    document.body.innerHTML = '';
    middlewareFn = jest.fn(x => x);
    middleware = () => () => middlewareFn;
    init = jest.fn();
    initFn = () => init;

    const template = state => actions => (
      <div>
        <span id="text">{state.text}</span>
        <button
          id="update"
          onclick={actions.update}
        />
        <button
          id="async"
          onclick={actions.asyncUpdate}
        />
        <div>
          <div>
            {null}
            {null}
            <div />
          </div>
        </div>
      </div>
    );

    component({
      template,
      state: {
        text: 'hello, world',
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
        asyncUpdate: state => (update) => {
          setTimeout(() => {
            update({ text: `${state.text}!!` });
          }, 50);
        },
      },
      middleware: [middleware],
      init: initFn,
    });

    body = document.body;

    await render();
  });

  it('should properly render', async () => {
    expect(body.innerHTML).not.toEqual('');
  });

  it('should call the init function', () => {
    expect(init).toHaveBeenCalled();
  });

  it('should properly render the state', async () => {
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world');
  });

  it('should properly handle an update action', async () => {
    body.querySelector('#update').click();

    await render();
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!');
  });

  it('should handle a thunk', async () => {
    body.querySelector('#async').click();

    await render(100);
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!!');
  });

  it('should support middleware', async () => {
    body.querySelector('#update').click();

    await render();
    expect(middlewareFn).toHaveBeenCalled();
  });
});
