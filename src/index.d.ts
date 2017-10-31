export as namespace mise;
export default Mise;

declare namespace Mise {

  export class VNode {
    type: string | Function;
    props: object | null;
    children: Array<string | VNode>
  }

  export class Component {
    constructor(
      template: (state: object) => (actions: object) => VNode, 
      state: object, 
      actions: object,
      root?: Element
    )
  }
}