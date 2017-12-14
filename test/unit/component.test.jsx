import { component, dom } from '../../src';
import { requestAnimationFrame, requestIdleCallback, render } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

describe('component tests', () => {
  let body;
  let middleware;
  let middlewareFn;

  beforeEach(() => {
    document.body.innerHTML = '';
    middlewareFn = jest.fn(x => x);
    middleware = () => () => middlewareFn;

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
            <div>
              <div>
                hey
              </div>
            </div>
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
    });

    body = document.body;
  });

  it('should properly render', async () => {
    await render();
    expect(body.innerHTML).not.toEqual('');
  });

  it('should properly render the state', async () => {
    await render();
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world');
  });

  it('should properly handle an update action', async () => {
    await render();
    body.querySelector('#update').click();

    await render();
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!');
  });

  it('should handle a thunk', async () => {
    await render();
    body.querySelector('#async').click();

    await render(100);
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!!');
  });

  it('should support middleware', async () => {
    await render();
    body.querySelector('#update').click();

    await render();
    expect(middlewareFn).toHaveBeenCalled();
  });
});
