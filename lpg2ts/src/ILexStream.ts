
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
  
    reportLexicalError(left_loc: number, right_loc: number, errorCode?: number, error_left_loc?: number, error_right_loc?: number, errorInfo?:  string[]): void;
    toString(startOffset: number, endOffset: number): string;
    m77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac: number;
}
;
;
export function instanceOfILexStream(object: any): object is ILexStream {
    return 'm77Ac341Feebeb7C0A7Ff8F9C6540531500693Bac' in object;
}