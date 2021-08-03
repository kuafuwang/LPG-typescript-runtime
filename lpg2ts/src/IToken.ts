
import { ILexStream } from "./ILexStream";
import { IPrsStream } from "./IPrsStream";

export interface IToken {

    getKind(): number;
    setKind(kind: number): void;
    getStartOffset(): number;
    setStartOffset(startOffset: number): void;
    getEndOffset(): number;
    setEndOffset(endOffset: number): void;
    getTokenIndex(): number;
    setTokenIndex(i: number): void;
    getAdjunctIndex(): number;
    setAdjunctIndex(i: number): void;
    getPrecedingAdjuncts(): IToken[];
    getFollowingAdjuncts(): IToken[];
    getILexStream(): ILexStream;
    getLexStream(): ILexStream;
    getIPrsStream(): IPrsStream;
    getPrsStream(): IPrsStream;
    getLine(): number;
    getColumn(): number;
    getEndLine(): number;
    getEndColumn(): number;
    getValue(inputChars: string): string;
    toString(): string;
}
;