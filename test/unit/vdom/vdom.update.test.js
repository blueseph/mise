/* eslint no-useless-escape: 0 */

import { vdom } from '../../../src/vdom';
import { dom } from '../../../src';

const VDOM = vdom();

describe('update', () => {
  let parent;
  beforeEach(() => {
    document.body.innerHTML = '';
    parent = document.body;
  });

  describe('creating an element', () => {
    it('should properly add an element if a previous one didnt exist', () => {
      VDOM.update(parent, null, null, dom('h1'));

      expect(parent.innerHTML).toEqual('<h1></h1>');
    });

    it('should try to run an oncreate function if it exists', () => {
      const create = jest.fn();

      VDOM.update(parent, null, null, dom('h1', { oncreate() { create(); }}));

      expect(create.mock.calls.length).toEqual(1);
    });
  });

  describe('removing an element', () => {
    it('should remove an element if a previous one did exist', () => {
      parent.innerHTML = '<h1></h1>';

      VDOM.update(parent, parent.childNodes[0], dom('h1'), null);

      expect(parent.innerHTML).toEqual('');
    });

    it('should try to run an onremove function if it exists', () => {
      const inner = jest.fn();
      const remove = () => inner;

      VDOM.update(parent, parent.childNodes[0], dom('h1', { onremove() { return remove(); }}), null);

      expect(inner.mock.calls.length).toEqual(1);
    });
  });

  describe('replacing an element', () => {
    it('should try to replace an element if the types are different', () => {
      parent.innerHTML = '<h1></h1>';

      VDOM.update(parent, parent.childNodes[0], dom('h1'), dom('h2'));

      expect(parent.innerHTML).toEqual('<h2></h2>');
    });

    it('should trigger an onupdate function if attempting to replace', () => {
      parent.innerHTML = '<h1></h1>';

      const inner = jest.fn();
      const replace = () => inner;

      VDOM.update(parent, parent.childNodes[0], dom('h1'), dom('h2', { onupdate() { return replace(); }}, []));

      expect(inner.mock.calls.length).toEqual(1);
    });
  });

  describe('updating an element in place', () => {

    it('should try to update a basic prop in place', () => {
      const previous = dom('h1');
      const next = dom('h1', { id: 'great'} );

      parent.innerHTML = '<h1></h1>';

      VDOM.update(parent, parent.childNodes[0], previous, next);

      expect(parent.innerHTML).toEqual('<h1 id=\"great\"></h1>');
    });

    it('should try intelligently update a boolean value', () => {
      const previous = dom('h1');
      const next = dom('h1', { disabled: true, id: 'TRUE' } );

      parent.innerHTML = '<h1></h1>';

      VDOM.update(parent, parent.childNodes[0], previous, next);

      expect(parent.innerHTML).toEqual('<h1 disabled=\"true\" id=\"TRUE\"></h1>');
    });

    describe('updating styles', () => {
      it('should try to add styles', () => {
        const previous = dom('h1');
        const next = dom('h1', { style: { fontSize: '18px', }});

        parent.innerHTML = '<h1></h1>';

        VDOM.update(parent, parent.childNodes[0], previous, next);

        expect(parent.innerHTML).toEqual('<h1 style=\"font-size: 18px;\"></h1>');
      });

      it('should try to swap styles properly', () => {
        const previous = dom('h1', { style: { textDecoration: 'line-through' }});
        const next = dom('h1', { style: { fontSize: '18px', }});

        parent.innerHTML = '<h1></h1>';

        VDOM.update(parent, parent.childNodes[0], previous, next);

        expect(parent.innerHTML).toEqual('<h1 style=\"font-size: 18px;\"></h1>');
      });

      it('should try to update style values if the property is the same', () => {
        const previous = dom('h1', { style: { fontSize: '20px' }});
        const next = dom('h1', { style: { fontSize: '18px', }});

        parent.innerHTML = '<h1></h1>';

        VDOM.update(parent, parent.childNodes[0], previous, next);

        expect(parent.innerHTML).toEqual('<h1 style=\"font-size: 18px;\"></h1>');
      });

      it('should try to remove styles properly', () => {
        const previous = dom('h1', { style: { textDecoration: 'line-through' }});
        const next = dom('h1');

        parent.innerHTML = '<h1></h1>';

        VDOM.update(parent, parent.childNodes[0], previous, next);

        expect(parent.innerHTML).toEqual('<h1></h1>');
      });
    });
  });
});
