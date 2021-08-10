import { AbstractToken } from "./AbstractToken";
import { IPrsStream, IToken } from "./Protocol";


export class Token extends AbstractToken {
  
    constructor(startOffset: number, endOffset: number, kind: number, iPrsStream?: IPrsStream) {
        super(startOffset, endOffset, kind, iPrsStream);
    }
    public getFollowingAdjuncts(): IToken[] | undefined{
        
        return this.getIPrsStream()?.getFollowingAdjuncts(this.getTokenIndex());
    }
    public getPrecedingAdjuncts(): IToken[] | undefined{
        return this.getIPrsStream()?.getPrecedingAdjuncts(this.getTokenIndex());
    }
}
;