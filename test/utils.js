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

const getLastMockCall = mocked => mocked.mock.calls[mocked.mock.calls.length - 1];

export {
  mockFiber,
  getLastMockCall,
};
