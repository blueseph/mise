import { dom } from '../../src/';
import { context } from '../../src/context';

describe('DOM jsx tests', () => {
  it('should be defined', () => {
    expect(dom).toBeDefined();
  });

  it('should properly handle a tag with no children or props', () => {
    const element = dom('main');

    expect(element).toEqual({
      type: 'main',
      props: {},
      children: [],
    });
  });

  it('should properly handle a tag with a null prop', () => {
    const element = dom('main', null);

    expect(element).toEqual({
      type: 'main',
      props: {},
      children: [],
    });
  });

  it('should properly handle a tag with children but no props', () => {
    const children = [<article />, <aside />, <section />];

    const element = (
      <main>
        {children}
      </main>
    );

    expect(element).toEqual({
      type: 'main',
      props: {},
      children,
    });
  });

  it('should properly handle a tag with props but no children', () => {
    const props = {
      id: 'news',
      class: 'main-section',
    };

    const element = <main {...props} />;

    expect(element).toEqual({
      type: 'main',
      props,
      children: [],
    });
  });

  it('should handle a child being a number', () => {
    const element = (
      <li>
        0
      </li>
    );

    expect(element).toEqual({
      type: 'li',
      props: {},
      children: ['0'],
    });
  });

  it('should handle a function as a type', () => {
    const StatelessComponent = (props, children) => (
      <div {...props}>
        {children}
      </div>
    );

    let element = <StatelessComponent />;

    expect(element).toEqual({
      type: 'div',
      props: {},
      children: [],
    });

    const props = { id: 'thing', class: 'thing-haver' };
    element = <StatelessComponent {...props} />;

    expect(element).toEqual({
      type: 'div',
      props,
      children: [],
    });

    const secondProps = { id: 'second-thing', class: 'thing-haver' };
    element = (
      <StatelessComponent {...props}>
        <StatelessComponent {...secondProps} />
      </StatelessComponent>
    );

    expect(element).toEqual({
      type: 'div',
      props,
      children: [
        {
          type: 'div',
          props: secondProps,
          children: [],
        },
      ],
    });
  });

  it('should squash null children', () => {
    const children = [null, null, <article />, null];

    const element = (
      <main>
        {children}
      </main>
    );

    expect(element.children.length).toBe(1);
  });

  it('should throw errors if invalid types are provided', () => {
    const ReturnsUndefined = () => {};

    expect(() => <ReturnsUndefined />).toThrow();
    expect(() => dom()).toThrow();
  });

  it('should handle context props', () => {
    const actionsFn = () => {};
    context.actions = {
      fn: actionsFn,
    };
    context.state = {
      name: 'dan',
      nested: {
        name: 'bruce',
      },
    };
    const StatelessComponent = ({ name }) => name;
    const ActionComponent = ({ fn }) => {
      expect(fn).toBe(context.actions.fn);
      return null;
    };

    expect(<StatelessComponent $MiseState />).toBe(context.state.name);
    expect(<StatelessComponent $MiseState={state => state.nested} />).toBe(context.state.nested.name);

    <ActionComponent $MiseActions />;
  });
});

