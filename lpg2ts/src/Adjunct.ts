import { AbstractToken } from "./AbstractToken";
import { IPrsStream, IToken } from "./Protocol";

export class Adjunct extends AbstractToken {

    constructor(startOffset: number, endOffset: number, kind: number, prsStream?: IPrsStream ) {
        super(startOffset, endOffset, kind, prsStream);
    }
    public getFollowingAdjuncts(): IToken[] {
        return [];
    }
    public getPrecedingAdjuncts(): IToken[] {
        return [];
    }
};