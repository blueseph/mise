import { setProps } from './dom';
import { types } from '../queue/fiber';

export const reconcile = (fibers) => {
  for (const fiber of fibers) {
    const {
      action,
      next,
      previous,
      parent,
      differences,
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
        setProps(previous.element, differences);

        break;
      }

      default: {
        return;
      }
    }
  }
};
