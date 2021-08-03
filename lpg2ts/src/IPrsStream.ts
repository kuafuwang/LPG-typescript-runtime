
import { TokenStream } from "./TokenStream";
import { IMessageHandler } from "./IMessageHandler";
import { IToken} from "./IToken";
import { ILexStream } from "./ILexStream";
import { java as Java } from "./jre";

export interface IPrsStream extends TokenStream {
    getMessageHandler(): IMessageHandler;
    setMessageHandler(errMsg: IMessageHandler): void;
    getILexStream(): ILexStream;
    getLexStream(): ILexStream;
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
    getTokens(): Java.util.ArrayList<IToken>;
    getAdjuncts(): Java.util.ArrayList<IToken>;
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
    getTokenAtCharacter(offset: number): IToken;
    getTokenAt(i: number): IToken;
    dumpTokens(): void;
    dumpToken(i: number): void;
    makeErrorToken(first: number, last: number, error: number, kind: number): number;
     m3C89586D99F2567D21410F29B1B2606574892Aa7 : number;
}
;
export  function instanceOfIPrsStream(object: any): object is IPrsStream {
    return 'm3C89586D99F2567D21410F29B1B2606574892Aa7' in object;
}