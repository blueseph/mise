import 'jest';
import * as tsExports from '../../src/index'

describe('TypeScript exports', () => {
  it('should have a dom', () => {
    expect(tsExports.dom).toBeDefined();
  })

  it('should have a component', () => {
    expect(tsExports.component).toBeDefined();
  })
})