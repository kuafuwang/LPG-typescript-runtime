
import { LexStream } from "./LexStream";
import { UnknownStreamType } from "./UnknownStreamType";
import { IToken, IPrsStream, ILexStream } from "./Protocol";


export abstract class AbstractToken implements IToken {
    private kind: number = 0;
    private startOffset: number = 0;
    private endOffset: number = 0;
    private tokenIndex: number = 0;
    private adjunctIndex: number=0;
    private iPrsStream?: IPrsStream;

    constructor(startOffset: number, endOffset: number, kind: number, iPrsStream?: IPrsStream) {
        this.iPrsStream = iPrsStream;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.kind = kind;
    }
    abstract getPrecedingAdjuncts(): IToken[] | undefined;
    abstract getFollowingAdjuncts(): IToken[] | undefined;
    public getKind(): number {
        return this.kind;
    }
    public setKind(kind: number): void {
        this.kind = kind;
    }
    public getStartOffset(): number {
        return this.startOffset;
    }
    public setStartOffset(startOffset: number): void {
        this.startOffset = startOffset;
    }
    public getEndOffset(): number {
        return this.endOffset;
    }
    public setEndOffset(endOffset: number): void {
        this.endOffset = endOffset;
    }
    public getTokenIndex(): number {
        return this.tokenIndex;
    }
    public setTokenIndex(tokenIndex: number): void {
        this.tokenIndex = tokenIndex;
    }
    public setAdjunctIndex(adjunctIndex: number): void {
        this.adjunctIndex = adjunctIndex;
    }
    public getAdjunctIndex(): number {
        return this.adjunctIndex;
    }
    public getIPrsStream(): IPrsStream | undefined{
        return this.iPrsStream;
    }
    public getILexStream(): ILexStream | undefined {
        return this.iPrsStream?.getILexStream();
    }
    public getLine(): number {
        let ret = this.iPrsStream?.getILexStream().getLineNumberOfCharAt(this.startOffset);
        if (ret) return ret;
        return 0;
    }
    public getColumn(): number {
        let ret = this.iPrsStream?.getILexStream().getColumnOfCharAt(this.startOffset);
        if (ret) return ret;
        return 0;
    }
    public getEndLine(): number {
       
        let ret = this.iPrsStream?.getILexStream().getLineNumberOfCharAt(this.endOffset);
        if (ret) return ret;
        return 0;
    }
    public getEndColumn(): number {
        let ret = this.iPrsStream?.getILexStream().getColumnOfCharAt(this.endOffset);
        if (ret) return ret;
        return 0;
    }

    public toString(): string {
        return (this.iPrsStream == undefined ? "<toString>" : this.iPrsStream.toString(this, this));
    }
};