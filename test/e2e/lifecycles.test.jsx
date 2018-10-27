import { commis } from '@mise/test';

import { dom, component } from '../../src';

const { render } = commis();

describe('lifecycle tests', () => {
  const { body } = document;

  beforeEach(() => {
    body.innerHTML = '';
  });

  it('should exercise an oncreate lifecycle event for non-parent items', async () => {
    const spy = jest.fn();
    const template = () => () => (
      <div>
        <div oncreate={spy} />
      </div>
    );

    component({ template });

    await render(150);

    expect(spy).toHaveBeenCalled();
  });

  it('should exercise an onremove lifecycle event for non-parent items', async () => {
    const spy = jest.fn();

    const template = state => actions => (
      <div>
        <div>
          {state.display ? <div onremove={spy} /> : null}
        </div>
        <button onclick={actions.hide} />
      </div>
    );
    const state = {
      display: true,
    };
    const actions = {
      hide: () => ({ display: false }),
    };

    component({
      template,
      state,
      actions,
    });

    await render(150);
    body.querySelector('button').click();

    await render(150);
    expect(spy).toHaveBeenCalled();
  });

  it('should exercise an onupdate lifecycle event for non-parent items', async () => {
    const spy = jest.fn();
    const internalSpy = () => spy;

    const template = state => actions => (
      <div>
        <div
          onupdate={internalSpy} 
          class={state.change ? 'a' : ''}
        />
        <button onclick={actions.change} />
      </div>
    );
    const actions = {
      change: () => ({
        change: true,
      }),
    };
    const state = {
      change: false,
    };

    component({ template, actions, state });

    await render(150);
    body.querySelector('button').click();

    await render(150);
    expect(spy).toHaveBeenCalled();
  });

  it('should do nested lifecycle events', async () => {
    const spy = jest.fn();

    const template = () => () => (
      <div>
        <div oncreate={spy}>
          <div oncreate={spy}>
            <div oncreate={spy} />
          </div>
        </div>
      </div>
    );

    component({ template });

    await render(150);

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
