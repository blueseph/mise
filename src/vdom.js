import { getUniques } from './utils';

const vdom = () => {
  const setProp = (element, attribute, original, updated) => {
    if (attribute === 'value') {
      if (updated || updated === 0 || updated === '') {
        element[attribute] = updated;
      }
      return;
    }

    if (typeof updated === 'boolean') {
      if (updated) {
        element.setAttribute(attribute, updated);
        element[attribute] = updated;
      }
      return;
    }

    if (typeof updated === 'function') {
      try {
        element[attribute] = updated;
      } catch (e) {
        /* sometimes lifecycle methods throw. we don't particularly care */
      }

      return;
    }

    if (!updated || (typeof updated === 'object' && !Object.keys(updated).length)) {
      element.removeAttribute(attribute);
      return;
    }

    if (attribute === 'style') {
      const styles = getUniques(updated, original);

      for (const style of styles) {
        if (!updated[style]) {
          element.style[style] = '';
        } else if (!original || !original[style] || original[style] !== updated[style]) {
          element.style[style] = updated[style];
        }
      }

      return;
    }

    element.setAttribute(attribute, updated);
  };

  const setProps = (element, props) => {
    for (const [attribute, value] of Object.entries(props)) {
      setProp(element, attribute, {}, value);
    }
  };

  const createElement = (node) => {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const { type, props, children } = node;
    const element = document.createElement(type);
    setProps(element, props);

    children
      .map(createElement)
      .forEach(child => element.appendChild(child));

    return element;
  };

  const shouldReplace = (original, updated) =>
    typeof original !== typeof updated ||
    (typeof original === 'string' && original !== updated) ||
    original.type !== updated.type;

  const updateProps = (element, original, updated) => {
    const props = getUniques(original, updated);

    for (const prop of props) {
      setProp(element, prop, original[prop], updated[prop]);
    }
  };

  const reconcile = (parent, element, previous, next) => {
    if (!previous) {
      const el = createElement(next);

      if (next.props.oncreate) {
        next.props.oncreate(el);
      }

      parent.appendChild(el);
      return false;
    }

    if (!next) {
      const remove = () => element.remove();

      if (previous.props && previous.props.onremove) {
        previous.props.onremove(element)(remove);
      } else {
        remove();
      }
      return false;
    }

    if (shouldReplace(previous, next)) {
      const nextElement = createElement(next);

      if (next.props && next.props.onupdate) {
        next.props.onupdate(nextElement)(previous.props);
      }

      parent.replaceChild(
        nextElement,
        element,
      );

      return true;
    }

    if (next.props && next.props.onupdate) {
      next.props.onupdate(element)(previous.props);
    }

    updateProps(element, previous.props, next.props);
    return true;
  };

  const update = (parent, element, previous, next) => {
    const updated = reconcile(parent, element, previous, next);

    if (updated) {
      const prevChildren = previous.children || [];
      const nextChildren = next.children || [];
      const length = Math.max(prevChildren.length, nextChildren.length);
      const childNodes = [...(element && element.childNodes) || []];

      for (let i = 0; i < length; i += 1) {
        update(
          element,
          childNodes[i],
          previous.children[i],
          next.children[i],
        );
      }
    }
  };

  return {
    createElement,
    update,
  };
};

export { vdom };
