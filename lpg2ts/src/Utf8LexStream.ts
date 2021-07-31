import { ILexStream } from "./ILexStream";
import { ParseErrorCodes } from "./ParseErrorCodes";
import { IntSegmentedTuple } from "./IntSegmentedTuple";
import { IPrsStream } from "./IPrsStream";
import { IMessageHandler } from "./IMessageHandler";

export class Utf8LexStream implements ILexStream, ParseErrorCodes {
    private static DEFAULT_TAB: number = 1;
    private static charSize: Int8Array = new Int8Array(256);
    private startIndex: number = -1;
    private index: number = -1;
    private lastIndex: number = -1;
    private inputBytes: Int8Array;
    private isUTF8: boolean;
    private fileName: string;
    private lineOffsets: IntSegmentedTuple;
    private tab: number = Utf8LexStream.DEFAULT_TAB;
    private iPrsStream: IPrsStream;
    private errMsg: IMessageHandler = null;
         //TODO Resolve static initializer
        static iniii(){
        for (var i: number = 0; i < 0x80; i++) {
            Utf8LexStream.charSize[i] = 1;
        }
        for (var i: number = 0x80; i < 0xCE; i++) {
            Utf8LexStream.charSize[i] = 0;
        }
        for (var i: number = 0xCE; i < 0xE0; i++) {
            Utf8LexStream.charSize[i] = 2;
        }
        for (var i: number = 0xE0; i < 0xF0; i++) {
            Utf8LexStream.charSize[i] = 3;
        }
        for (var i: number = 0xF0; i < 0xF8; i++) {
            Utf8LexStream.charSize[i] = 4;
        }
        for (var i: number = 0xF8; i < 0xFC; i++) {
            Utf8LexStream.charSize[i] = 5;
        }
        for (var i: number = 0xFC; i < 0xFE; i++) {
            Utf8LexStream.charSize[i] = 6;
        }
        for (var i: number = 0xFE; i < 0xFF; i++) {
            Utf8LexStream.charSize[i] = 0;
        }
    }
      public getCharSize(c: number): number {
    return this.isUTF8 ? Utf8LexStream.charSize[c & 0x000000FF] : 1;
    }
      public static getUnicodeValue(bytes: Int8Array, i: number): number {
    var code: number;
    try {
        code = bytes[i] & 0xFF;
        var size: number = Utf8LexStream.charSize[code];
        switch (size) {
            case 1:
                break;
            case 0:
                code = 0;
                break;
            default:
                code &= (0xFF >> (size + 1));
                for (var k: number = 1; k < size; k++) {
                    var c: number = bytes[i + k];
                    if ((c & 0x000000C0) != 0x80) {
                        code = 0;
                        break;
                    }
                    code = (code << 6) + (c & 0x0000003F);
                }
                break;
        }
    } catch ($ex$) {
        if ($ex$ instanceof Error) {
            var e: Error = <Error>$ex$;
            throw new Error(i);
        } else {
            throw $ex$;
        }
    }
    return code;
}
      public getString(offset: number, count: number): string {
    if (count < 0) {
        throw new Error(count);
    }
    var value: string[] = [];
    var size: number = 0;
    for (var i: number = 0, j: number = offset; i < count; i += this.getCharSize(this.inputBytes[j]), j += this.getCharSize(this.inputBytes[j])) {
        value[size++] = <string>this.getUnicodeValue(j);
    }
    return value, 0, size;
}
constructor() {
    this.lineOffsets = new IntSegmentedTuple(12);
    this.setLineOffset(-1);
}
constructor(tab: number) {
    this.this();
    this.tab = tab;
}
constructor(fileName: string) {
    this.this(fileName, Utf8LexStream.DEFAULT_TAB);
}
constructor(fileName: string, tab: number) {
    this.this(tab);
    try {
        var f: File = new File(fileName);
        var inputStream: FileInputStream = new FileInputStream(f);
        var buffer: Int8Array = new Int8Array(<number>f.length());
        inputStream.read(buffer, 0, buffer.length);
        this.initialize(buffer, fileName);
    } catch ($ex$) {
        if ($ex$ instanceof Error) {
            var e: Error = <Error>$ex$;
            var io: Error = new Error();
            console.error(e.message);
            console.error(e);
            throw (io);
        } else {
            throw $ex$;
        }
    }
}
constructor(inputBytes: Int8Array, fileName: string) {
    this.this();
    this.initialize(inputBytes, fileName);
}
constructor(lineOffsets: IntSegmentedTuple, inputBytes: Int8Array, fileName: string) {
    this.initialize(lineOffsets, inputBytes, fileName);
}
constructor(inputBytes: Int8Array, fileName: string, tab: number) {
    this.this(tab);
    this.initialize(inputBytes, fileName);
}
constructor(lineOffsets: IntSegmentedTuple, inputBytes: Int8Array, fileName: string, tab: number) {
    this.tab = tab;
    this.initialize(lineOffsets, inputBytes, fileName);
}
      public isUtf8(): boolean {
    return this.isUTF8;
}
      public isExtendedAscii(): boolean {
    return !this.isUTF8;
}
      public initialize(inputBytes: Int8Array, fileName: string): void {
    this.setInputBytes(inputBytes);
    this.setFileName(fileName);
    this.computeLineOffsets();
}
      public initialize(lineOffsets: IntSegmentedTuple, inputBytes: Int8Array, fileName: string): void {
    this.lineOffsets = lineOffsets;
    this.setInputBytes(inputBytes);
    this.setFileName(fileName);
}
      public computeLineOffsets(): void {
    this.lineOffsets.reset();
    this.setLineOffset(-1);
    for(var i: number = this.startIndex + 1; i< this.inputBytes.length; i++) {
    if (this.inputBytes[i] == 0x0A) {
        this.setLineOffset(i);
    }
}
      }
      public setInputBytes(buffer: Int8Array): void {
    this.inputBytes = buffer;
    this.isUTF8 = (buffer.length >= 3 && (buffer[0] & 0x000000FF) == 0x00EF && (buffer[1] & 0x000000FF) == 0x00BB && (buffer[2] & 0x000000FF) == 0x00BF);
    this.startIndex = (this.isUTF8 ? 2 : -1);
    this.index = this.startIndex;
    this.lastIndex = this.getPrevious(buffer.length);
}
      public getInputBytes(): Int8Array {
    return this.inputBytes;
}
      public setFileName(fileName: string): void {
    this.fileName = fileName;
}
      public getFileName(): string {
    return this.fileName;
}
      public setLineOffsets(lineOffsets: IntSegmentedTuple): void {
    this.lineOffsets = lineOffsets;
}
      public getLineOffsets(): IntSegmentedTuple {
    return this.lineOffsets;
}
      public setTab(tab: number): void {
    this.tab = tab;
}
      public getTab(): number {
    return this.tab;
}
      public setStreamIndex(index: number): void {
    this.index = index;
}
      public getStreamIndex(): number {
    return this.index;
}
      public getStartIndex(): number {
    return this.startIndex;
}
      public getLastIndex(): number {
    return this.lastIndex;
}
      public getStreamLength(): number {
    return this.inputBytes.length;
}
      public setLineOffset(i: number): void {
    this.lineOffsets.add(i);
}
      public getLineOffset(i: number): number {
    return this.lineOffsets.get(i);
}
      public setPrsStream(iPrsStream: IPrsStream): void {
    this.iPrsStream = iPrsStream;
}
      public getIPrsStream(): IPrsStream {
    return this.iPrsStream;
}
      public getPrsStream(): IPrsStream {
    return this.iPrsStream;
}
      public orderedExportedSymbols(): string[] {
    return null;
}
      public getCharValue(i: number): string {
    return <string>this.getUnicodeValue(i);
}
      public getIntValue(i: number): number {
    return this.getUnicodeValue(i);
}
      public getUnicodeValue(i: number): number {
    return (this.isUTF8 ? Utf8LexStream.getUnicodeValue(this.inputBytes, i) : this.inputBytes[i] & 0xFF);
}
      public getLineCount(): number {
    return this.lineOffsets.size();
}
      public getLineNumberOfCharAt(i: number): number {
    var index: number = this.lineOffsets.binarySearch(i);
    return index < 0 ? -index : index == 0 ? 1 : index;
}
      public getColumnOfCharAt(i: number): number {
    var lineNo: number = this.getLineNumberOfCharAt(i), start: number = this.getLineOffset(lineNo - 1), tab: number = this.getTab();
    if (start + 1 >= this.inputBytes.length) {
        return 1;
    }
    for (var k: number = start + 1; k < i; k = this.getNext(k)) {
        var c: number = this.inputBytes[k];
        if (c == '\t') {
            var offset: number = (k - start) - 1;
            start -= ((tab - 1) - offset % tab);
        }
        start += (this.getCharSize(c) - 1);
    }
    return i - start;
}
      public getToken(): number {
    return this.index = this.getNext(this.index);
}
      public getToken(end_token: number): number {
    return this.index = (this.index < end_token ? this.getNext(this.index) : this.lastIndex);
}
      public getKind(i: number): number {
    return 0;
}
      public getNext(i: number): number {
    return (i <= this.startIndex ? this.startIndex + 1 : i < this.inputBytes.length ? i + this.getCharSize(this.inputBytes[i]) : this.lastIndex);
}
      public getPrevious(i: number): number {
    i = (i > this.startIndex ? i - 1 : this.startIndex);
    if (this.isUTF8) {
        while (i > this.startIndex) {
            if ((this.inputBytes[i] & 0x000000C0) != 0x80) {
                break;
            }
            i--;
        }
    }
    return i;
}
      public getName(i: number): string {
    var c: number = this.getUnicodeValue(i);
    if (c <= 0xFFFF) {
        return "" + <string>c;
    } else {
        return "#x" + java.lang.Integer.toHexString(i);
    }
}
      public getName(i: number, k: number): string {
    var name: string = "";
    for (var j: number = i; j <= k; j++) {
        var c: number = this.getUnicodeValue(j);
        if (c <= 0xFFFF) {
            name += <string>c;
        } else {
            name += ("#x" + java.lang.Integer.toHexString(j));
        }
    }
    return name;
}
      public peek(): number {
    return this.getNext(this.index);
}
      public reset(i: number): void {
    this.index = this.getPrevious(i);
}
      public reset(): void {
    this.index = this.startIndex;
}
      public badToken(): number {
    return 0;
}
      public getLine(i: number): number {
    return this.getLineNumberOfCharAt(i);
}
      public getColumn(i: number): number {
    return this.getColumnOfCharAt(i);
}
      public getEndLine(i: number): number {
    return this.getLine(i);
}
      public getEndColumn(i: number): number {
    return this.getColumnOfCharAt(i);
}
      public afterEol(i: number): boolean {
    return (i < 1 ? true : this.getLineNumberOfCharAt(this.getPrevious(i)) < this.getLineNumberOfCharAt(i));
}
      public getFirstErrorToken(i: number): number {
    return this.getFirstRealToken(i);
}
      public getFirstRealToken(i: number): number {
    return i;
}
      public getLastErrorToken(i: number): number {
    return this.getLastRealToken(i);
}
      public getLastRealToken(i: number): number {
    return i;
}
      public setMessageHandler(errMsg: IMessageHandler): void {
    this.errMsg = errMsg;
}
      public getMessageHandler(): IMessageHandler {
    return this.errMsg;
}
      public makeToken(startLoc: number, endLoc: number, kind: number): void {
    if(this.iPrsStream != null) {
    this.iPrsStream.makeToken(startLoc, endLoc, kind);
} else {
    this.reportLexicalError(startLoc, endLoc);
}
      }
      public reportLexicalError(left_loc: number, right_loc: number): void {
    var errorCode: number = (right_loc >= this.inputBytes.length ? ParseErrorCodes.EOF_CODE : left_loc == right_loc ? ParseErrorCodes.LEX_ERROR_CODE : ParseErrorCodes.INVALID_TOKEN_CODE), end_loc: number = (left_loc == right_loc ? right_loc : right_loc - 1);
    var tokenText: string = (errorCode == ParseErrorCodes.EOF_CODE ? "End-of-file " : errorCode == ParseErrorCodes.INVALID_TOKEN_CODE ? "\"" + this.inputBytes, left_loc, right_loc - left_loc + "\" " : "\"" + (<string>this.getUnicodeValue(left_loc)) + "\" ");
    this.reportLexicalError(errorCode, left_loc, end_loc, 0, 0, [tokenText]);
}
      public getLocation(left_loc: number, right_loc: number): Int32Array {
    var length: number = (right_loc < this.inputBytes.length ? right_loc : this.inputBytes.length - 1) - left_loc + 1;
    return new Int32Array([left_loc, length, this.getLineNumberOfCharAt(left_loc), this.getColumnOfCharAt(left_loc), this.getLineNumberOfCharAt(right_loc), this.getColumnOfCharAt(right_loc)]);
}
      public reportLexicalError(errorCode: number, left_loc: number, right_loc: number, error_left_loc: number, error_right_loc: number, errorInfo: string[]): void {
    if(this.errMsg == null) {
    var locationInfo: string = this.getFileName() + ':' + this.getLineNumberOfCharAt(left_loc) + ':' + this.getColumnOfCharAt(left_loc) + ':' + this.getLineNumberOfCharAt(right_loc) + ':' + this.getColumnOfCharAt(right_loc) + ':' + error_left_loc + ':' + error_right_loc + ':' + errorCode + ": ";
    console.log("****Error: " + locationInfo);
    if (errorInfo != null) {
        for (var i: number = 0; i < errorInfo.length; i++) {
            console.log(errorInfo[i] + " ");
        }
    }
    console.log(ParseErrorCodes.errorMsgText[errorCode]);
} else {
    this.errMsg.handleMessage(errorCode, this.getLocation(left_loc, right_loc), this.getLocation(error_left_loc, error_right_loc), this.getFileName(), errorInfo);
}
      }
      public reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string): void {
    this.reportError(errorCode, leftToken, 0, rightToken, errorInfo == null ? null : [errorInfo]);
}
      public reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string[]): void {
    this.reportError(errorCode, leftToken, 0, rightToken, errorInfo);
}
      public reportError(errorCode: number, leftToken: number, errorToken: number, rightToken: number, errorInfo: string): void {
    this.reportError(errorCode, leftToken, errorToken, rightToken, errorInfo == null ? null : [errorInfo]);
}
      public reportError(errorCode: number, leftToken: number, errorToken: number, rightToken: number, errorInfo: string[]): void {
    this.reportLexicalError(errorCode, leftToken, rightToken, errorToken, errorToken, errorInfo == null ? [] : errorInfo);
}
      public toString(startOffset: number, endOffset: number): string {
    var length: number = endOffset - startOffset + 1;
    return (endOffset >= this.inputBytes.length ? "$EOF" : length <= 0 ? "" : this.getString(startOffset, length));
}
    }
;