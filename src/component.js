import { reconciler } from './vdom/reconciler';
import { create } from './vdom/fiber';
import { compose } from './utils';

const component = ({
  template,
  state,
  actions,
  root = document.body,
  middleware = [],
  init,
}) => {
  const { add } = reconciler();

  let appState;
  let appTemplate;
  let appActions;

  const generateTemplate = unsafeState => (unsafeActions) => {
    const readOnlyState = { ...unsafeState };
    const readOnlyActions = { ...unsafeActions };

    return template(readOnlyState)(readOnlyActions);
  };

  const render = () => {
    const previousTemplate = appTemplate;
    appTemplate = generateTemplate(appState)(appActions);

    const fiber = create({
      parent: root,
      element: root.childNodes[0],
      previous: previousTemplate,
      next: appTemplate,
    });

    add(fiber);
  };

  const update = (partialState) => {
    appState = {
      ...appState,
      ...partialState,
    };

    render();
  };

  const bindUpdateToActions = (unboundActions) => {
    const tempActions = {};

    for (const [key, fn] of Object.entries(unboundActions)) {
      tempActions[key] = (data) => {
        const boundFn = fn.bind(null, appState, appActions);

        const middlewares = middleware.map(m => m(appState)(key));
        const composedFn = compose(...middlewares)(boundFn);

        const result = composedFn(data);

        if (typeof result === 'function') {
          result(update);
        } else {
          update(result);
        }
      };
    }

    return tempActions;
  };

  const initialize = (initialActions) => {
    appState = state;
    appActions = bindUpdateToActions(initialActions);

    if (init) init(appState)(appActions);

    appTemplate = generateTemplate(appState)(appActions);

    const fiber = create({
      parent: root,
      next: appTemplate,
    });

    add(fiber);
  };

  initialize(actions);
};

export { component };
