import { dom } from '../../src/';

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
});
