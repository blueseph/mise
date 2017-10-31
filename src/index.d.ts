export as namespace mise;
export default Mise;

declare namespace Mise {

  export class VNode {
    type: string | Function;
    props: object;
    children: Array<string | VNode>
  }

  export class Component {
    constructor(
      template: (state: any) => (actions: any) => VNode, 
      state: any, 
      actions: any,
      root?: Element
    )
  }
}