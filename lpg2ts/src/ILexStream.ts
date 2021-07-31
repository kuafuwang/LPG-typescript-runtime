
import { IMessageHandler } from "./IMessageHandler";
import { IPrsStream } from "./IPrsStream";
import { TokenStream } from "./TokenStream";

export interface ILexStream extends TokenStream {
    getIPrsStream(): IPrsStream;
    getPrsStream(): IPrsStream;
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
    getMessageHandler(): IMessageHandler;
    getLocation(left_loc: number, right_loc: number): Int32Array;
    reportLexicalError(left: number, right: number): void;
    reportLexicalError(errorCode: number, left_loc: number, right_loc: number, error_left_loc: number, error_right_loc: number, errorInfo: string[]): void;
    toString(startOffset: number, endOffset: number): string;
}
;