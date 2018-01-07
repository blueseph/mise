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
        <div id="null">
          {state.nulls}
        </div>
        <button
          id="renderNulls"
          onclick={actions.renderNulls}
          />
      </div>
    );

    component({
      template,
      state: {
        text: 'hello, world',
        nulls: [ null, null, <article />],
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
        asyncUpdate: state => (update) => {
          setTimeout(() => {
            update({ text: `${state.text}!!` });
          }, 50);
        },
        renderNulls: state => ({ nulls: [ <main />, null, <article />] }),
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

  it('should properly handle null children', async () => {
    const nulled = body.querySelector('#null');

    expect(nulled.children.length).toEqual(1);
    expect(nulled.innerHTML).toEqual('<article></article>');
  });

  it('should correctly replace null children if they exist', async () => {
    const nulled = body.querySelector('#null');
    const renderNulls = body.querySelector('#renderNulls');

    expect(nulled.children.length).toEqual(1);
    expect(nulled.innerHTML).toEqual('<article></article>');

    renderNulls.click();
    await render();

    expect(nulled.innerHTML).toEqual('<main></main><article></article>');
  })
});
