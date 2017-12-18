import { dom, component } from 'mise';

import { logger } from './logger';
import { exception } from './exception';

component({
  template: state => actions => (
    <main>
      <button onclick={actions.increment}>I have been clicked {state.clicks} times!</button>
    </main>
  ),
  state: {
    clicks: 0,
  },
  actions: {
    increment: state => ({ clicks: state.clicks + 1 }),
  },
  middleware: [logger, exception],
});
