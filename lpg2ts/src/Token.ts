import { AbstractToken } from "./AbstractToken";
import { IPrsStream, IToken } from "./Protocol";


export class Token extends AbstractToken {
  
    constructor(startOffset: number, endOffset: number, kind: number, iPrsStream?: IPrsStream) {
        super(startOffset, endOffset, kind, iPrsStream);
    }
    public getFollowingAdjuncts(): IToken[] {
        
        let result =  this.getIPrsStream()?.getFollowingAdjuncts(this.getTokenIndex());
        return result ? result : [];
    }
    public getPrecedingAdjuncts(): IToken[] {
        let result =  this.getIPrsStream()?.getPrecedingAdjuncts(this.getTokenIndex());
        return result ? result : [];
    }
}
;