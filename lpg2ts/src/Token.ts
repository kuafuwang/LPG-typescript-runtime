import { AbstractToken } from "./AbstractToken";
import { IPrsStream } from "./IPrsStream";
import { IToken } from "./IToken";

export class Token extends AbstractToken {
  
    constructor(startOffset: number, endOffset: number, kind: number, iPrsStream: IPrsStream=null) {
        super(iPrsStream, startOffset, endOffset, kind);
    }
    public getFollowingAdjuncts(): IToken[] {
        return this.getIPrsStream().getFollowingAdjuncts(this.getTokenIndex());
    }
    public getPrecedingAdjuncts(): IToken[] {
        return this.getIPrsStream().getPrecedingAdjuncts(this.getTokenIndex());
    }
}
;