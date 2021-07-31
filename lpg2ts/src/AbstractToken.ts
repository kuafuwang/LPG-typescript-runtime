import { IToken } from "./IToken";
import { IPrsStream } from "./IPrsStream";
import { ILexStream } from "./ILexStream";
import { LexStream } from "./LexStream";
import { UnknownStreamType } from "./UnknownStreamType";


export abstract class AbstractToken implements IToken {
    private kind: number = 0;
    private startOffset: number = 0;
    private endOffset: number = 0;
    private tokenIndex: number = 0;
    private adjunctIndex: number;
    private iPrsStream: IPrsStream;

    constructor(iPrsStream: IPrsStream, startOffset: number, endOffset: number, kind: number) {
        this.iPrsStream = iPrsStream;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.kind = kind;
    }
    abstract  getPrecedingAdjuncts(): IToken[] ;
    abstract getFollowingAdjuncts(): IToken[] ;
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
    public getIPrsStream(): IPrsStream {
        return this.iPrsStream;
    }
    public getILexStream(): ILexStream {
        return this.iPrsStream == null ? null : this.iPrsStream.getILexStream();
    }
    public getLine(): number {
        return (this.iPrsStream == null ? 0 : this.iPrsStream.getILexStream().getLineNumberOfCharAt(this.startOffset));
    }
    public getColumn(): number {
        return (this.iPrsStream == null ? 0 : this.iPrsStream.getILexStream().getColumnOfCharAt(this.startOffset));
    }
    public getEndLine(): number {
        return (this.iPrsStream == null ? 0 : this.iPrsStream.getILexStream().getLineNumberOfCharAt(this.endOffset));
    }
    public getEndColumn(): number {
        return (this.iPrsStream == null ? 0 : this.iPrsStream.getILexStream().getColumnOfCharAt(this.endOffset));
    }
    public getPrsStream(): IPrsStream {
        return this.iPrsStream;
    }
    public getLexStream(): ILexStream {
        return this.iPrsStream == null ? null : this.iPrsStream.getILexStream();
    }
    public getValue(inputChars: string[]): string {
        if (this.iPrsStream != null) {
            return this.toString();
        }
        if (this.iPrsStream.getLexStream() instanceof LexStream) {
            var lex_stream: LexStream = <LexStream>this.iPrsStream.getLexStream();
            if (inputChars != lex_stream.getInputChars()) {
                throw new Error();
            }
            return this.toString();
        }
        throw new UnknownStreamType("Unknown stream type " + this.iPrsStream.getLexStream().getClass().toString());
    }
    public toString(): string {
        return (this.iPrsStream == null ? "<toString>" : this.iPrsStream.toString(this, this));
    }
};