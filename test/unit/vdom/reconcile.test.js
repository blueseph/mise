import { commis } from '@mise/test';

import { dom } from '../../../src';
import { createElement, compareAttributes } from '../../../src/vdom';
import { reconcile } from '../../../src/vdom/reconcile';
import { create, types } from '../../../src/queue/fiber';

import { mockFiber } from '../../utils';

commis();

describe('reconcile', () => {
  describe('create', () => {
    it('should create an element if the fiber action is create', () => {
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
      fiber.next.element = createElement(fiber.next.tree);

      reconcile([fiber]);

      const added = parent.querySelector('ul');
      expect(added).toBeDefined();
      expect(added.outerHTML).toBe('<ul class="b"></ul>');
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

      reconcile([fiber]);

      const removed = parent.querySelector('div');
      expect(removed).toBeNull();
    });

    it('should run the lifecycle function on remove', () => {
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

      reconcile([fiber]);
    });
  });

  describe('replace', () => {
    it('should replace an element if the fiber action is replace', () => {
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
      fiber.next.element = createElement(fiber.next.tree);

      reconcile([fiber]);

      expect(parent.innerHTML).toBe('<ul class="b"></ul>');
    });
  });

  describe('update in place', () => {
    it('should update an element in place if the action is update', () => {
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
        children: [],
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
      fiber.differences = compareAttributes(fiber.previous.tree.props, fiber.next.tree.props);

      reconcile([fiber]);

      expect(parent.innerHTML).toBe('<div class="updated" style="text-decoration: strike-through;"></div>');
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
        children: [],
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
      fiber.differences = compareAttributes(fiber.previous.tree.props, fiber.next.tree.props);

      reconcile([fiber]);

      expect(parent.innerHTML).toBe('<div disabled="true"></div>');
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
        children: [],
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
      fiber.differences = compareAttributes(fiber.previous.tree.props, fiber.next.tree.props);

      reconcile([fiber]);

      expect(parent.innerHTML).toBe('<div></div>');
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
        children: [],
      };

      const previous = {
        type: 'input',
        props: {},
      };

      const fiber = create({
        parent,
        element,
        previous,
        next,
      });

      fiber.action = types.update;
      fiber.differences = compareAttributes(fiber.previous.tree.props, fiber.next.tree.props);

      reconcile([fiber]);

      expect(parent.innerHTML).toBe('<input>');
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

    reconcile(finished);
    expect(parent.innerHTML).toBe('<div></div>');
  });
});
