import { dom } from '../../../src';
import { createElement } from '../../../src/vdom';

describe('create element', () => {
  it('should create a simple text node', () => {
    const element = createElement('hey');

    expect(element.nodeValue).toBe('hey');
  });

  it('should create an empty div if no data is passed', () => {
    const node = <h1 />;
    const element = createElement(node);

    expect(element.outerHTML).toBe('<h1></h1>');
  });

  it('should make elements for the children, too', () => {
    const node = (
      <ul>
        <li>first</li>
        <li>second</li>
        <li>third</li>
      </ul>
    );

    const element = createElement(node);

    expect(element.outerHTML).toBe('<ul><li>first</li><li>second</li><li>third</li></ul>');
  });

  it('should properly add props', () => {
    const node = <div id="neato-element" />;

    const element = createElement(node);

    expect(element.outerHTML).toBe('<div id="neato-element"></div>');
  });

  it('should return an svg node if it needs to', () => {
    const node = <svg id="hello" />;
    node.nodeName = 'svg';

    const element = createElement(node);

    expect(element.outerHTML).toBe('<svg id="hello"></svg>');
  });
});