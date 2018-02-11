import { recurseLifecycles } from '../../../src/queue/lifecycles';

describe('recurse lifecycles', () => {
  it('should trigger a lifecycle in a shallow fiber', () => {
    const oncreate = jest.fn();

    const element = document.createElement('div');
    const tree = { props: { oncreate } };
    const lifecycle = 'oncreate';

    recurseLifecycles(element, tree, lifecycle);
    expect(oncreate).toHaveBeenCalled();
  });

  it('should trigger a lifecycle in a deep fiber', () => {
    const oncreate = jest.fn();

    const element = document.createElement('div');
    const child = document.createElement('div');
    element.appendChild(child);

    const tree = {
      props: { oncreate },
      children: [
        { props: { oncreate } },
      ],
    };

    const lifecycle = 'oncreate';

    recurseLifecycles(element, tree, lifecycle);
    expect(oncreate).toHaveBeenCalledTimes(2);
  });
});
