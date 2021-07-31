import { IPrsStream } from "./IPrsStream";
import { ParseErrorCodes } from "./ParseErrorCodes";
import { ILexStream } from "./ILexStream";
import { LexStream } from "./LexStream";
import { Token } from "./Token";
import { ErrorToken } from "./ErrorToken";
import { IToken } from "./IToken";
import { Adjunct } from "./Adjunct";
import { Utf8LexStream } from "./Utf8LexStream";
import { IMessageHandler } from "./IMessageHandler";

export class PrsStream implements IPrsStream, ParseErrorCodes {
    private iLexStream: ILexStream;
    private kindMap: Int32Array = null;
    private tokens: java.util.ArrayList = new java.util.ArrayList();
    private adjuncts: java.util.ArrayList = new java.util.ArrayList();
    private index: number = 0;
    private len: number = 0;
    constructor() { }
    constructor(iLexStream: ILexStream) {
        this.iLexStream = iLexStream;
        if (iLexStream != null) {
            iLexStream.setPrsStream(this);
        }
        this.resetTokenStream();
    }
    public orderedExportedSymbols(): string[] {
        return null;
    }
    public remapTerminalSymbols(ordered_parser_symbols: string[], eof_symbol: number): void {
        if (this.iLexStream == null) {
            throw new Error("PrsStream.remapTerminalSymbols(..):  lexStream is null");
        }
        var ordered_lexer_symbols: string[] = this.iLexStream.orderedExportedSymbols();
        if (ordered_lexer_symbols == null) {
            throw new Error();
        }
        if (ordered_parser_symbols == null) {
            throw new Error();
        }
        var unimplemented_symbols: java.util.ArrayList = new java.util.ArrayList();
        if (ordered_lexer_symbols != ordered_parser_symbols) {
            this.kindMap = new Int32Array(ordered_lexer_symbols.length);
            var terminal_map: java.util.HashMap = new java.util.HashMap();
            for (var i: number = 0; i < ordered_lexer_symbols.length; i++) {
                terminal_map.put(ordered_lexer_symbols[i], new number(i));
            }
            for (var i: number = 0; i < ordered_parser_symbols.length; i++) {
                var k: number = <number>terminal_map.get(ordered_parser_symbols[i]);
                if (k != null) {
                    this.kindMap[k.intValue()] = i;
                } else {
                    if (i == eof_symbol) {
                        throw new Error();
                    }
                    unimplemented_symbols.add(new number(i));
                }
            }
        }
        if (unimplemented_symbols.size() > 0) {
            throw new Error(unimplemented_symbols);
        }
    }
    public mapKind(kind: number): number {
        return (this.kindMap == null ? kind : this.kindMap[kind]);
    }
    public resetTokenStream(): void {
        this.tokens = new java.util.ArrayList();
        this.index = 0;
        this.adjuncts = new java.util.ArrayList();
    }
    public setLexStream(lexStream: ILexStream): void {
        this.iLexStream = lexStream;
        this.resetTokenStream();
    }
    public resetLexStream(lexStream: LexStream): void {
        this.iLexStream = lexStream;
        if (lexStream != null) {
            lexStream.setPrsStream(this);
        }
    }
    public makeToken(startLoc: number, endLoc: number, kind: number): void {
        var token: Token = new Token(this, startLoc, endLoc, this.mapKind(kind));
        token.setTokenIndex(this.tokens.size());
        this.tokens.add(token);
        token.setAdjunctIndex(this.adjuncts.size());
    }
    public removeLastToken(): void {
        var last_index: number = this.tokens.size() - 1;
        var token: Token = <Token>this.tokens.get(last_index);
        var adjuncts_size: number = this.adjuncts.size();
        while (adjuncts_size > token.getAdjunctIndex()) {
            this.adjuncts.remove(--adjuncts_size);
        }
        this.tokens.remove(last_index);
    }
    public makeErrorToken(firsttok: number, lasttok: number, errortok: number, kind: number): number {
        var index: number = this.tokens.size();
        var token: Token = new ErrorToken(this.getIToken(firsttok), this.getIToken(lasttok), this.getIToken(errortok), this.getStartOffset(firsttok), this.getEndOffset(lasttok), kind);
        token.setTokenIndex(this.tokens.size());
        this.tokens.add(token);
        token.setAdjunctIndex(this.adjuncts.size());
        return index;
    }
    public addToken(token: IToken): void {
        token.setTokenIndex(this.tokens.size());
        this.tokens.add(token);
        token.setAdjunctIndex(this.adjuncts.size());
    }
    public makeAdjunct(startLoc: number, endLoc: number, kind: number): void {
        var token_index: number = this.tokens.size() - 1;
        var adjunct: Adjunct = new Adjunct(this, startLoc, endLoc, this.mapKind(kind));
        adjunct.setAdjunctIndex(this.adjuncts.size());
        adjunct.setTokenIndex(token_index);
        this.adjuncts.add(adjunct);
    }
    public addAdjunct(adjunct: IToken): void {
        var token_index: number = this.tokens.size() - 1;
        adjunct.setTokenIndex(token_index);
        adjunct.setAdjunctIndex(this.adjuncts.size());
        this.adjuncts.add(adjunct);
    }
    public getTokenText(i: number): string {
        var t: IToken = <IToken>this.tokens.get(i);
        return t.toString();
    }
    public getStartOffset(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return t.getStartOffset();
    }
    public getEndOffset(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return t.getEndOffset();
    }
    public getTokenLength(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return t.getEndOffset() - t.getStartOffset() + 1;
    }
    public getLineNumberOfTokenAt(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream.getLineNumberOfCharAt(t.getStartOffset());
    }
    public getEndLineNumberOfTokenAt(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream.getLineNumberOfCharAt(t.getEndOffset());
    }
    public getColumnOfTokenAt(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream.getColumnOfCharAt(t.getStartOffset());
    }
    public getEndColumnOfTokenAt(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream.getColumnOfCharAt(t.getEndOffset());
    }
    public orderedTerminalSymbols(): string[] {
        return null;
    }
    public getLineOffset(i: number): number {
        return this.iLexStream.getLineOffset(i);
    }
    public getLineCount(): number {
        return this.iLexStream.getLineCount();
    }
    public getLineNumberOfCharAt(i: number): number {
        return this.iLexStream.getLineNumberOfCharAt(i);
    }
    public getColumnOfCharAt(i: number): number {
        return this.getColumnOfCharAt(i);
    }
    public getFirstErrorToken(i: number): number {
        return this.getFirstRealToken(i);
    }
    public getFirstRealToken(i: number): number {
        while (i >= this.len) {
            i = (<ErrorToken>this.tokens.get(i)).getFirstRealToken().getTokenIndex();
        }
        return i;
    }
    public getLastErrorToken(i: number): number {
        return this.getLastRealToken(i);
    }
    public getLastRealToken(i: number): number {
        while (i >= this.len) {
            i = (<ErrorToken>this.tokens.get(i)).getLastRealToken().getTokenIndex();
        }
        return i;
    }
    public getInputChars(): string[] {
        return (this.iLexStream instanceof LexStream ? (<LexStream>this.iLexStream).getInputChars() : null);
    }
    public getInputBytes(): Int8Array {
        return (this.iLexStream instanceof Utf8LexStream ? (<Utf8LexStream>this.iLexStream).getInputBytes() : null);
    }
    public toString(first_token: number, last_token: number): string {
        return this.toString(<IToken>this.tokens.get(first_token), <IToken>this.tokens.get(last_token));
    }
    public toString(t1: IToken, t2: IToken): string {
        return this.iLexStream.toString(t1.getStartOffset(), t2.getEndOffset());
    }
    public getSize(): number {
        return this.tokens.size();
    }
    public setSize(): void {
        this.len = this.tokens.size();
    }
    public getTokenIndexAtCharacter(offset: number): number {
        var low: number = 0, high: number = this.tokens.size();
        while (high > low) {
            var mid: number = (high + low) / 2;
            var mid_element: IToken = <IToken>this.tokens.get(mid);
            if (offset >= mid_element.getStartOffset() && offset <= mid_element.getEndOffset()) {
                return mid;
            } else {
                if (offset < mid_element.getStartOffset()) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
        }
        return -(low - 1);
    }
    public getTokenAtCharacter(offset: number): IToken {
        var tokenIndex: number = this.getTokenIndexAtCharacter(offset);
        return (tokenIndex < 0) ? null : this.getTokenAt(tokenIndex);
    }
    public getTokenAt(i: number): IToken {
        return <IToken>this.tokens.get(i);
    }
    public getIToken(i: number): IToken {
        return <IToken>this.tokens.get(i);
    }
    public getTokens(): java.util.ArrayList {
        return this.tokens;
    }
    public getStreamIndex(): number {
        return this.index;
    }
    public getStreamLength(): number {
        return this.len;
    }
    public setStreamIndex(index: number): void {
        this.index = index;
    }
    public setStreamLength(): void {
        this.len = this.tokens.size();
    }
    public setStreamLength(len: number): void {
        this.len = len;
    }
    public getILexStream(): ILexStream {
        return this.iLexStream;
    }
    public getLexStream(): ILexStream {
        return this.iLexStream;
    }
    public dumpTokens(): void {
        if (this.getSize() <= 2) {
            return;
        }
        console.log(" Kind \tOffset \tLen \tLine \tCol \tText\n");
        for (var i: number = 1; i < this.getSize() - 1; i++) {
            this.dumpToken(i);
        }
    }
    public dumpToken(i: number): void {
        console.log(" (" + this.getKind(i) + ")");
        console.log(" \t" + this.getStartOffset(i));
        console.log(" \t" + this.getTokenLength(i));
        console.log(" \t" + this.getLineNumberOfTokenAt(i));
        console.log(" \t" + this.getColumnOfTokenAt(i));
        console.log(" \t" + this.getTokenText(i));
        Util.out.println();
    }
    private getAdjuncts(i: number): IToken[] {
        var start_index: number = (<IToken>this.tokens.get(i)).getAdjunctIndex(), end_index: number = (i + 1 == this.tokens.size() ? this.adjuncts.size() : (<IToken>this.tokens.get(this.getNext(i))).getAdjunctIndex()), size: number = end_index - start_index;
        var slice: IToken[] = new Array<IToken>(size);
        for (var j: number = start_index, k: number = 0; j < end_index; j++, k++) {
            slice[k] = <IToken>this.adjuncts.get(j);
        }
        return slice;
    }
    public getFollowingAdjuncts(i: number): IToken[] {
        return this.getAdjuncts(i);
    }
    public getPrecedingAdjuncts(i: number): IToken[] {
        return this.getAdjuncts(this.getPrevious(i));
    }
    public getAdjuncts(): java.util.ArrayList {
        return this.adjuncts;
    }
    public getToken(): number {
        this.index = this.getNext(this.index);
        return this.index;
    }
    public getToken(end_token: number): number {
        return this.index = (this.index < end_token ? this.getNext(this.index) : this.len - 1);
    }
    public getKind(i: number): number {
        var t: IToken = <IToken>this.tokens.get(i);
        return t.getKind();
    }
    public getNext(i: number): number {
        return (++i < this.len ? i : this.len - 1);
    }
    public getPrevious(i: number): number {
        return (i <= 0 ? 0 : i - 1);
    }
    public getName(i: number): string {
        return this.getTokenText(i);
    }
    public peek(): number {
        return this.getNext(this.index);
    }
    public reset(i: number): void {
        this.index = this.getPrevious(i);
    }
    public reset(): void {
        this.index = 0;
    }
    public badToken(): number {
        return 0;
    }
    public getLine(i: number): number {
        return this.getLineNumberOfTokenAt(i);
    }
    public getColumn(i: number): number {
        return this.getColumnOfTokenAt(i);
    }
    public getEndLine(i: number): number {
        return this.getEndLineNumberOfTokenAt(i);
    }
    public getEndColumn(i: number): number {
        return this.getEndColumnOfTokenAt(i);
    }
    public afterEol(i: number): boolean {
        return (i < 1 ? true : this.getEndLineNumberOfTokenAt(i - 1) < this.getLineNumberOfTokenAt(i));
    }
    public getFileName(): string {
        return this.iLexStream.getFileName();
    }
    public setMessageHandler(errMsg: IMessageHandler): void {
        this.iLexStream.setMessageHandler(errMsg);
    }
    public getMessageHandler(): IMessageHandler {
        return this.iLexStream.getMessageHandler();
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
        this.iLexStream.reportLexicalError(errorCode, this.getStartOffset(leftToken), this.getEndOffset(rightToken), this.getStartOffset(errorToken), this.getEndOffset(errorToken), errorInfo == null ? [] : errorInfo);
    }
}
;
