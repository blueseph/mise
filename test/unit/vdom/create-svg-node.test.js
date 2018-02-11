import { createSVGNode } from '../../../src/vdom';

describe('create svg node', () => {
  it('should create an svg node', () => {
    const svg = createSVGNode({ nodeName: 'svg' });

    expect(svg.nodeName).toEqual('svg');
  });
});
