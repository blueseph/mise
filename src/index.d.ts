export as namespace mise;
export default Mise;

declare namespace Mise {

  export class MiseDomReturnVal {
    type: string | Function;
    props: object;
    children: Array<string | MiseDomReturnVal>
  }

  export class MiseComponent {
    constructor(
      template: (state: any) => (actions: any) => MiseDomReturnVal, 
      state: any, 
      actions: any,
      root?: Element
    )
  }
}


//just in case??
export { dom } from './dom';
export { component } from './component';





