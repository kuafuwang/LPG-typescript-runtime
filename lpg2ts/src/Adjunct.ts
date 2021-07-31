import { AbstractToken } from "./AbstractToken";
import { IPrsStream } from "./IPrsStream";
import { IToken } from "./IToken";

; export class Adjunct extends AbstractToken {

    constructor(prsStream: IPrsStream = null, startOffset: number, endOffset: number, kind: number) {
        super(prsStream, startOffset, endOffset, kind);
    }
    public getFollowingAdjuncts(): IToken[] {
        return null;
    }
    public getPrecedingAdjuncts(): IToken[] {
        return null;
    }
};