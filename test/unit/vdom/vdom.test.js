/* eslint no-useless-escape: 0 */

import { createElement, paint } from '../../../src/vdom/vdom';
import { dom } from '../../../src';
import { create, types } from '../../../src/vdom/fiber';

import { mockFiber, requestIdleCallback, requestAnimationFrame } from '../../utils';

window.requestIdleCallback = requestIdleCallback;
window.requestAnimationFrame = requestAnimationFrame;

describe('vdom', () => {
  describe('create element', () => {
    it('should create a simple text node', () => {
      const element = createElement('hey');

      expect(element.nodeValue).toEqual('hey');
    });

    it('should create an empty div if no data is passed', () => {
      const element = createElement(dom('h1'));

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
        ],
      );

      const element = createElement(node);

      expect(element.outerHTML).toEqual('<ul><li>first</li><li>second</li><li>third</li></ul>');
    });

    it('should properly add props', () => {
      const element = createElement(dom('div', { id: 'neato-element' }));
      expect(element.outerHTML).toEqual('<div id=\"neato-element\"></div>');
    });
  });

  describe('paint', () => {
    describe('create', () => {
      it('should create an element if the fiber action is create', () => {
        const lifecycle = jest.fn();

        const {
          parent,
          element,
          next,
          previous,
        } = mockFiber();

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.create;
        fiber.lifecycle = lifecycle;
        fiber.next.element = createElement(fiber.next.tree);

        paint([fiber]);

        const added = parent.querySelector('ul');
        expect(added).toBeDefined();
        expect(added.outerHTML).toBe('<ul class=\"b\"></ul>');
        expect(lifecycle.mock.calls.length).toEqual(1);
      });
    });

    describe('remove', () => {
      it('should remove an element if the fiber action is remove', () => {
        const {
          parent,
          element,
          next,
          previous,
        } = mockFiber();

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.remove;

        paint([fiber]);

        const removed = parent.querySelector('div');
        expect(removed).toBeNull();
      });

      it('should run the lifecycle function on remove', () => {
        const inner = jest.fn();
        const lifecycle = () => inner;

        const {
          parent,
          element,
          next,
          previous,
        } = mockFiber();

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.remove;
        fiber.lifecycle = lifecycle;

        paint([fiber]);

        expect(inner.mock.calls.length).toEqual(1);
      });
    });

    describe('replace', () => {
      it('should replace an element if the fiber action is replace', () => {
        const inner = jest.fn();
        const lifecycle = () => inner;

        const {
          parent,
          element,
          next,
          previous,
        } = mockFiber();

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.replace;
        fiber.lifecycle = lifecycle;
        fiber.next.element = createElement(fiber.next.tree);

        paint([fiber]);

        expect(parent.innerHTML).toEqual('<ul class="b"></ul>');
        expect(inner.mock.calls.length).toEqual(1);
      });
    });

    describe('update in place', () => {
      it('should update an element in place if the action is replace', () => {
        const inner = jest.fn();
        const lifecycle = () => inner;

        const {
          parent,
          element,
        } = mockFiber();

        const next = {
          type: 'div',
          props: {
            class: 'updated',
            style: { textDecoration: 'strike-through' },
          },
        };

        const previous = {
          type: 'div',
          props: {
            class: 'not-updated',
          },
        };

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.update;
        fiber.lifecycle = lifecycle;

        paint([fiber]);

        expect(parent.innerHTML).toEqual('<div class="updated" style="text-decoration: strike-through;"></div>');
        expect(inner.mock.calls.length).toEqual(1);
      });

      it('should try intelligently update a boolean value', () => {
        const {
          parent,
          element,
        } = mockFiber();

        const next = {
          type: 'div',
          props: {
            disabled: true,
          },
        };

        const previous = {
          type: 'div',
          props: {},
        };

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.update;

        paint([fiber]);

        expect(parent.innerHTML).toEqual('<div disabled="true"></div>');
      });

      it('should try intelligently update a falsy boolean value', () => {
        const {
          parent,
          element,
        } = mockFiber();

        const next = {
          type: 'div',
          props: {
            disabled: false,
          },
        };

        const previous = {
          type: 'div',
          props: {},
        };

        const fiber = create({
          parent,
          element,
          previous,
          next,
        });

        fiber.action = types.update;

        paint([fiber]);

        expect(parent.innerHTML).toEqual('<div></div>');
      });

      it('should try to intelligently update a "value" value', () => {
        const parent = document.createElement('div');
        const element = document.createElement('input');
        parent.appendChild(element);

        const next = {
          type: 'input',
          props: {
            value: 'hello',
          },
        };

        const previous = {
          type: 'input',
          props: {},
        };

        const fiber = create(
          parent,
          element,
          previous,
          next,
        );

        fiber.action = types.update;

        paint([fiber]);

        expect(parent.innerHTML).toEqual('<input>');
      });
    });

    it('should do anything if theres no action type', () => {
      const {
        parent,
        element,
      } = mockFiber();

      const next = {
        type: 'div',
        props: {
          class: 'updated',
          style: { textDecoration: 'strike-through' },
        },
      };

      const previous = {
        type: 'div',
        props: {
          class: 'not-updated',
        },
      };

      const fiber = create(
        element,
        previous,
        next,
      );

      const finished = [fiber];

      paint(finished);
      expect(parent.innerHTML).toEqual('<div></div>');
    });
  });
});
