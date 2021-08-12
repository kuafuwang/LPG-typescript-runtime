import { Token } from "./Token";
import { IToken } from "./Protocol";


export class ErrorToken extends Token {
    private firstToken: IToken;
    private lastToken: IToken;
    private errorToken: IToken;
    constructor(firstToken: IToken, lastToken: IToken, errorToken: IToken, startOffset: number, endOffset: number, kind: number) {
        super(startOffset, endOffset, kind, firstToken.getIPrsStream());
        this.firstToken = firstToken;
        this.lastToken = lastToken;
        this.errorToken = errorToken;
    }
    public getFirstToken(): IToken {
        return this.getFirstRealToken();
    }
    public getFirstRealToken(): IToken {
        return this.firstToken;
    }
    public getLastToken(): IToken {
        return this.getLastRealToken();
    }
    public getLastRealToken(): IToken {
        return this.lastToken;
    }
    public getErrorToken(): IToken {
        return this.errorToken;
    }
    public getPrecedingAdjuncts(): IToken[] {
        return this.firstToken.getPrecedingAdjuncts();
    }
    public getFollowingAdjuncts(): IToken[] {
        return this.lastToken.getFollowingAdjuncts();
    }
}
;