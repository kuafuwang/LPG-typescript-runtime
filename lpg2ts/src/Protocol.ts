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
    getIPrsStream(): IPrsStream | undefined;
   
    getLine(): number;
    getColumn(): number;
    getEndLine(): number;
    getEndColumn(): number;

    toString(): string;
}
export namespace IToken {
  export   const   EOF : number = 0xffff;
}
;
export interface ILexStream extends TokenStream {

    getIPrsStream(): IPrsStream | undefined;
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

export  class EscapeStrictPropertyInitializationLexStream implements ILexStream {
    getIPrsStream(): IPrsStream | undefined {
        throw new Error("Method not implemented.");
    }
    getPrsStream(): IPrsStream | undefined {
        throw new Error("Method not implemented.");
    }
    setPrsStream(stream: IPrsStream): void {
        throw new Error("Method not implemented.");
    }
    getLineCount(): number {
        throw new Error("Method not implemented.");
    }
    orderedExportedSymbols(): string[] {
        throw new Error("Method not implemented.");
    }
    getLineOffset(i: number): number {
        throw new Error("Method not implemented.");
    }
    getLineNumberOfCharAt(i: number): number {
        throw new Error("Method not implemented.");
    }
    getColumnOfCharAt(i: number): number {
        throw new Error("Method not implemented.");
    }
    getCharValue(i: number): string {
        throw new Error("Method not implemented.");
    }
    getIntValue(i: number): number {
        throw new Error("Method not implemented.");
    }
    makeToken(startLoc: number, endLoc: number, kind: number): void {
        throw new Error("Method not implemented.");
    }
    setMessageHandler(errMsg: IMessageHandler): void {
        throw new Error("Method not implemented.");
    }
    getMessageHandler(): IMessageHandler | undefined {
        throw new Error("Method not implemented.");
    }
    getLocation(left_loc: number, right_loc: number): Int32Array {
        throw new Error("Method not implemented.");
    }
    reportLexicalError(left_loc: number, right_loc: number, errorCode?: number, error_left_loc?: number, error_right_loc?: number, errorInfo?: string[]): void {
        throw new Error("Method not implemented.");
    }
    toString(startOffset: number, endOffset: number): string {
        throw new Error("Method not implemented.");
    }
    m77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac: number =0;
    getToken(): number;
    getToken(end_token: number): number;
    getToken(end_token?: any): number {
        throw new Error("Method not implemented.");
    }
    getKind(i: number): number {
        throw new Error("Method not implemented.");
    }
    getNext(i: number): number {
        throw new Error("Method not implemented.");
    }
    getPrevious(i: number): number {
        throw new Error("Method not implemented.");
    }
    getName(i: number): string {
        throw new Error("Method not implemented.");
    }
    peek(): number {
        throw new Error("Method not implemented.");
    }
    reset(i: number): void;
    reset(): void;
    reset(i?: any): void {
        throw new Error("Method not implemented.");
    }
    badToken(): number {
        throw new Error("Method not implemented.");
    }
    getLine(i: number): number {
        throw new Error("Method not implemented.");
    }
    getColumn(i: number): number {
        throw new Error("Method not implemented.");
    }
    getEndLine(i: number): number {
        throw new Error("Method not implemented.");
    }
    getEndColumn(i: number): number {
        throw new Error("Method not implemented.");
    }
    afterEol(i: number): boolean {
        throw new Error("Method not implemented.");
    }
    getFileName(): string {
        throw new Error("Method not implemented.");
    }
    getStreamLength(): number {
        throw new Error("Method not implemented.");
    }
    getFirstRealToken(i: number): number {
        throw new Error("Method not implemented.");
    }
    getLastRealToken(i: number): number {
        throw new Error("Method not implemented.");
    }
    reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string | string[], errorToken?: number): void {
        throw new Error("Method not implemented.");
    }
}

export function instanceOfILexStream(object: any): object is ILexStream {
    return 'm77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac' in object;
}


export interface IPrsStream extends TokenStream {

    getMessageHandler(): IMessageHandler | undefined;

    setMessageHandler(errMsg?: IMessageHandler): void;

    getILexStream(): ILexStream ;
    setLexStream(lexStream: ILexStream): void;

    ///**
    // * @deprecated replaced by {@link #getFirstRealToken()}
    // *
    // */
    //getFirstErrorToken(i: number): number;

    ///**
    // * @deprecated replaced by {@link #getLastRealToken()}
    // *
    // */
    //getLastErrorToken(i: number): number;


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