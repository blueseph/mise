import { component, dom } from '../../src';

window.requestAnimationFrame = setTimeout;

describe('component tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    component({
      template: state => actions =>
        dom('div', null, [
          dom('span', { id: 'text' }, state.text),
          dom('button', { id: 'update', onclick() { actions.update(); } }),
          dom('button', { id: 'async', onclick() { actions.asyncUpdate(); } }),
        ]),
      state: {
        text: 'hello, world',
      },
      actions: {
        update: state => ({ text: `${state.text}!` }),
        asyncUpdate: state => (update) => {
          setTimeout(() => {
            update({ text: `${state.text}!!` });
          }, 500);
        },
      },
    });
  });

  it('should properly render', () => {
    expect(document.body.innerHTML).not.toEqual('');
  });

  it('should properly render the state', () => {
    expect(document.querySelector('#text').innerHTML).toEqual('hello, world');
  });

  it('should properly handle an update action', (done) => {
    document.querySelector('#update').click();

    requestAnimationFrame(() => {
      expect(document.querySelector('#text').innerHTML).toEqual('hello, world!');
      done();
    }, 500);
  });

  it('should handle a thunk', (done) => {
    document.querySelector('#async').click();

    requestAnimationFrame(() => {
      expect(document.querySelector('#text').innerHTML).toEqual('hello, world!!');
      done();
    }, 1000);
  });
});
