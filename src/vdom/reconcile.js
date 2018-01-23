import { setProps } from './createElement';
import { types } from '../queue/fiber';

const reconcile = (fibers) => {
  for (const fiber of fibers) {
    const {
      action,
      next,
      previous,
      parent,
    } = fiber;

    switch (action) {
      case (types.create): {
        parent.appendChild(next.element);

        break;
      }

      case (types.remove): {
        previous.element.remove();

        break;
      }

      case (types.replace): {
        parent.replaceChild(
          next.element,
          previous.element,
        );

        break;
      }

      case (types.update): {
        setProps(previous.element, previous.tree.props, next.tree.props);

        break;
      }

      default: {
        return;
      }
    }
  }
};

export { reconcile };
