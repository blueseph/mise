const requestAnimationFrame = setTimeout;
const requestIdleCallback = function ric(cb) {
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

const mockFiber = () => {
  const parent = document.createElement('div');
  const element = document.createElement('div');
  parent.appendChild(element);

  const previous = {
    type: 'div',
    props: {
      class: 'a',
      onclick() {
        console.log('a');
      },
    },
    children: [],
  };

  const next = {
    type: 'ul',
    props: {
      class: 'b',
      onclick() {
        console.log('b');
      },
    },
    children: [],
  };

  return {
    parent,
    element,
    previous,
    next,
  };
};

const emptyFiber = {
  children: [],
  empty: true,
};

const getLastMockCall = mocked => mocked.mock.calls[mocked.mock.calls.length - 1];

export {
  requestIdleCallback,
  requestAnimationFrame,
  mockFiber,
  emptyFiber,
  getLastMockCall,
};
