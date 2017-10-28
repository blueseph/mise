/* eslint no-useless-escape: 0 */

import { vdom } from '../../../src/vdom';
import { dom } from '../../../src';

const VDOM = vdom();

describe('create element', () => {
  it('should create a simple text node', () => {
    const element = VDOM.createElement('hey');

    expect(element.nodeValue).toEqual('hey');
  });

  it('should create an empty div if no data is passed', () => {
    const element = VDOM.createElement(dom('h1'));

    expect(element.outerHTML).toEqual('<h1></h1>');
  });

  it('should make elements for the children, too', () => {
    const node = dom(
      'ul',
      null,
      [
        dom('li', null, 'first'),
        dom('li', null, 'second'),
        dom('li', null, 'third'),
      ]
    );

    const element = VDOM.createElement(node);

    expect(element.outerHTML).toEqual('<ul><li>first</li><li>second</li><li>third</li></ul>');
  });

  it('should properly add props', () => {
    const element = VDOM.createElement(dom('div', { id: 'neato-element', }));

    expect(element.outerHTML).toEqual('<div id=\"neato-element\"></div>');
  });
});
