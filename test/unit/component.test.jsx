import { commis } from '@mise/test';

import { component, dom } from '../../src';

const { render } = commis();

describe('component tests', () => {
  const body = document.body;

  beforeEach(async () => {
    document.body.innerHTML = '';
  });

  it('should properly render', async () => {
    component({
      template: state => actions => <div>hey!</div>,
    });

    await render();

    expect(body.innerHTML).not.toEqual('');
  });

  it('should call the init function', async () => {
    const init = jest.fn();
    const initFn = () => init;

    component({
      init: initFn,
    });

    await render();

    expect(init).toHaveBeenCalled();
  });

  it('should properly render the state', async () => {
    component({
      template: state => actions =>
        <div>
          <span id="text">{state.text}</span>
        </div>
      ,
      state: {
        text: 'hello, world',
      },
    });

    await render();

    expect(body.querySelector('#text').innerHTML).toEqual('hello, world');
  });

  it('should properly handle an update action', async () => {
    component({
      template: state => actions =>
        <div>
          <span id="text">{state.text}</span>
          <button id="update" onclick={actions.update} />
        </div>
      ,
      state: {
        text: 'hello, world',
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
      }
    });

    await render(100);
    body.querySelector('#update').click();

    await render(100);
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!');
  });

  it('should handle a thunk', async () => {
    component({
      template: state => actions =>
        <div>
          <span id="text">{state.text}</span>
          <button id="async" onclick={actions.asyncUpdate} />
        </div>
      ,
      state: {
        text: 'hello, world',
      },
      actions: {
        asyncUpdate: state => (update) => {
          setTimeout(() => {
            update({ text: `${state.text}!!` });
          }, 50);
        },
      },
    });

    await render();
    body.querySelector('#async').click();

    await render(100);
    expect(body.querySelector('#text').innerHTML).toEqual('hello, world!!');
  });

  it('should support middleware', async () => {
    const middlewareFn = jest.fn(x => x);
    const middleware = () => () => middlewareFn;

    component({
      template: state => actions =>
        <div>
          <span id="text">{state.text}</span>
          <button id="update" onclick={actions.update} />
        </div>
      ,
      state: {
        text: 'hello, world',
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
      },
      middleware: [middleware],
    });

    await render();
    body.querySelector('#update').click();

    await render();
    expect(middlewareFn).toHaveBeenCalled();
  });

  it('should properly handle null children', async () => {
    component({
      template: state => actions =>
        <div id="null">
          { [null, <article />, null] }
        </div>
    })

    await render();

    const nulled = body.querySelector('#null');

    expect(nulled.children.length).toEqual(1);
    expect(nulled.innerHTML).toEqual('<article></article>');
  });

  it('should correctly replace null children if they exist', async () => {

    component({
      template: state => actions =>
        <div>
          <div id="null">
            {state.nulls}
          </div>
          <button id="renderNulls" onclick={actions.renderNulls} />
        </div>
      ,
      state: {
        nulls: [null, <article />, null],
      },
      actions: {
        renderNulls: state => ({ nulls: [ <main />, <article />, null] }),        
      }
    });

    await render();

    const nulled = body.querySelector('#null');
    const renderNulls = body.querySelector('#renderNulls');

    expect(nulled.children.length).toEqual(1);
    expect(nulled.innerHTML).toEqual('<article></article>');

    renderNulls.click();
    await render();

    expect(nulled.innerHTML).toEqual('<main></main><article></article>');
  });

  it('should properly handle many actions being pressed at once', async () => {
    component({
      template: state => actions =>
        <div>
          <div id="items">
            {state.items.map(item => <span>{item}</span>)}
          </div>
          <button id="addItems" onclick={actions.addItems} />
        </div>
      ,
      state: {
        items: []
      },
      actions: {
        addItems: state => ({ items: [ ...state.items, 'an item', ]}),
      }
    });

    await render();

    const items = body.querySelector('#items');
    const addItems = body.querySelector('#addItems');

    expect(items.children.length).toEqual(0);

    addItems.click();
    addItems.click();
    addItems.click();
    await render();

    expect(items.children.length).toEqual(3);
  });

  it('should properly handle a text node -> node with children transition', async () => {
    component({
      template: state => actions => 
        <div>
          <div id="textNodeToRegularNode">{state.textNodeToRegularNode}</div>
          <button id="textNodeToRegularNodeAction" onclick={actions.textNodeToRegularNode} />
        </div>
      ,
      state: {
        textNodeToRegularNode: 0
      },
      actions: {
        textNodeToRegularNode: state => ({ textNodeToRegularNode: (<div><main> hello, world! </main></div>) }), 
      },
    });

    await render();

    const node = body.querySelector('#textNodeToRegularNode');
    const nodeButton = body.querySelector('#textNodeToRegularNodeAction');

    expect(node.innerHTML).toEqual("0");

    nodeButton.click();
    await render();

    expect(node.innerHTML).toEqual('<div><main> hello, world! </main></div>');
  });
});
