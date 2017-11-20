import { component, dom } from '../../src';

window.requestAnimationFrame = setTimeout;
window.requestIdleCallback = function ric(cb) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

describe('component tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    component({
      template: state => actions =>
        dom('div', null, [
          dom('span', { id: 'text' }, state.text),
          dom('button', { id: 'update', onclick() { actions.update(); } }),
          dom('button', { id: 'async', onclick() { actions.asyncUpdate(); } }),
          dom('div', null, [
            dom('div', null, [
              dom('div', null, [
                dom('div', null, ['hey']),
              ]),
            ]),
          ]),
        ]),
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
    });
  });

  it('should properly render', (done) => {
    setTimeout(() => {
      expect(document.body.innerHTML).not.toEqual('');

      done();
    }, 50);
  });

  it('should properly render the state', (done) => {
    setTimeout(() => {
      expect(document.querySelector('#text').innerHTML).toEqual('hello, world');

      done();
    }, 50);
  });

  it('should properly handle an update action', (done) => {
    setTimeout(() => {
      document.querySelector('#update').click();

      setTimeout(() => {
        expect(document.querySelector('#text').innerHTML).toEqual('hello, world!');
        done();
      }, 25);
    }, 25);
  });

  it('should handle a thunk', (done) => {
    setTimeout(() => {
      document.querySelector('#async').click();

      setTimeout(() => {
        expect(document.querySelector('#text').innerHTML).toEqual('hello, world!!');
        done();
      }, 100);
    }, 25);
  });
});
