import { IMessageHandler } from "./IMessageHandler";
import { TokenStream } from "./TokenStream";
import { Lpg as Lpg } from "./Utils";

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
    getPrecedingAdjuncts(): IToken[] | undefined;
    getFollowingAdjuncts(): IToken[] | undefined;
    getILexStream(): ILexStream| undefined;
    getLexStream(): ILexStream | undefined;
    getIPrsStream(): IPrsStream | undefined;
    getPrsStream(): IPrsStream | undefined;
    getLine(): number;
    getColumn(): number;
    getEndLine(): number;
    getEndColumn(): number;
    getValue(inputChars: string): string;
    toString(): string;
}
;
export interface ILexStream extends TokenStream {
    getIPrsStream(): IPrsStream | undefined;
    getPrsStream(): IPrsStream | undefined;
    setPrsStream(stream: IPrsStream): void;
    getLineCount(): number;
    orderedExportedSymbols(): string[];
    getLineOffset(i: number): number;
    getLineNumberOfCharAt(i: number): number;
    getColumnOfCharAt(i: number): number;
    getCharValue(i: number): string;
    getIntValue(i: number): number;
    makeToken(startLoc: number, endLoc: number, kind: number): void;
    setMessageHandler(errMsg: IMessageHandler): void;
    getMessageHandler(): IMessageHandler | undefined;
    getLocation(left_loc: number, right_loc: number): Int32Array;

    reportLexicalError(left_loc: number, right_loc: number, errorCode?: number, error_left_loc?: number, error_right_loc?: number, errorInfo?: string[]): void;
    toString(startOffset: number, endOffset: number): string;
    m77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac: number;
}
;
;
export function instanceOfILexStream(object: any): object is ILexStream {
    return 'm77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac' in object;
}


export interface IPrsStream extends TokenStream {
    getMessageHandler(): IMessageHandler | undefined;
    setMessageHandler(errMsg?: IMessageHandler): void;
    getILexStream(): ILexStream | undefined;
    getLexStream(): ILexStream | undefined;
    setLexStream(lexStream: ILexStream): void;
    getFirstErrorToken(i: number): number;
    getLastErrorToken(i: number): number;
    makeToken(startLoc: number, endLoc: number, kind: number): void;
    makeAdjunct(startLoc: number, endLoc: number, kind: number): void;
    removeLastToken(): void;
    getLineCount(): number;
    getSize(): number;
    remapTerminalSymbols(ordered_parser_symbols: string[], eof_symbol: number): void;
    orderedTerminalSymbols(): string[];
    mapKind(kind: number): number;
    resetTokenStream(): void;
    getStreamIndex(): number;
    setStreamIndex(index: number): void;
    setStreamLength(): void;
    setStreamLength(len: number): void;
    addToken(token: IToken): void;
    addAdjunct(adjunct: IToken): void;
    orderedExportedSymbols(): string[];
    getTokens(): Lpg.Util.ArrayList<IToken>;
    getAdjuncts(): Lpg.Util.ArrayList<IToken>;
    getFollowingAdjuncts(i: number): IToken[];
    getPrecedingAdjuncts(i: number): IToken[];
    getIToken(i: number): IToken;
    getTokenText(i: number): string;
    getStartOffset(i: number): number;
    getEndOffset(i: number): number;
    getLineOffset(i: number): number;
    getLineNumberOfCharAt(i: number): number;
    getColumnOfCharAt(i: number): number;
    getTokenLength(i: number): number;
    getLineNumberOfTokenAt(i: number): number;
    getEndLineNumberOfTokenAt(i: number): number;
    getColumnOfTokenAt(i: number): number;
    getEndColumnOfTokenAt(i: number): number;
    getInputChars(): string;
    getInputBytes(): Int8Array;
    toStringFromIndex(first_token: number, last_token: number): string;
    toString(t1: IToken, t2: IToken): string;
    getTokenIndexAtCharacter(offset: number): number;
    getTokenAtCharacter(offset: number): IToken | undefined;
    getTokenAt(i: number): IToken;
    dumpTokens(): void;
    dumpToken(i: number): void;
    makeErrorToken(first: number, last: number, error: number, kind: number): number;
    m3C89586D99F2567D21410F29B1B2606574892Aa7: number;
}
;
export function instanceOfIPrsStream(object: any): object is IPrsStream {
    return 'm3C89586D99F2567D21410F29B1B2606574892Aa7' in object;
}