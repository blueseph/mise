import { reconciler } from './vdom/reconciler';
import { create } from './vdom/fiber';
import { compose, makeCopy } from './utils';

const component = ({
  template = () => () => {},
  state = {},
  actions = {},
  root = document.body,
  middleware = [],
  init = () => () => {},
}) => {
  const { add } = reconciler();

  let appTemplate;
  let appState;
  let appActions;

  const generateTemplate = unsafeState => (unsafeActions) => {
    const readOnlyState = makeCopy(unsafeState);
    const readOnlyActions = makeCopy(unsafeActions);

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
        const readOnlyState = makeCopy(appState);
        const readOnlyActions = makeCopy(appActions);

        const boundFn = fn.bind(null, readOnlyState, readOnlyActions);

        const middlewares = middleware.map(m => m(readOnlyState)(key));
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

    const readOnlyState = makeCopy(appState);
    const readOnlyActions = makeCopy(appActions);

    init(readOnlyState)(readOnlyActions);

    if (!appTemplate) {
      appTemplate = generateTemplate(appState)(appActions);
      
      const fiber = create({
        parent: root,
        next: appTemplate,
      });
  
      add(fiber);
    }
  };

  initialize(actions);
};

export { component };
