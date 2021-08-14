import { LexStream } from "./LexStream";
import { Token } from "./Token";
import { ErrorToken } from "./ErrorToken";
import { Adjunct } from "./Adjunct";
//import { Utf8LexStream } from "./Utf8LexStream";
import { IMessageHandler } from "./IMessageHandler";
import { NullTerminalSymbolsException } from "./NullTerminalSymbolsException";
import { UndefinedEofSymbolException } from "./UndefinedEofSymbolException";
import { UnimplementedTerminalsException } from "./UnimplementedTerminalsException";
import { Lpg as Lpg } from "./Utils";
import { IPrsStream, ILexStream, IToken, EscapeStrictPropertyInitializationLexStream } from "./Protocol";
//
// PrsStream holds an arraylist of tokens "lexed" from the input stream.
//
export class PrsStream implements IPrsStream {
    m3C89586D99F2567D21410F29B1B2606574892Aa7: number=0;
    private iLexStream: ILexStream = new EscapeStrictPropertyInitializationLexStream();
    private kindMap: Int32Array= new Int32Array(0) ;
    private tokens: Lpg.Util.ArrayList<IToken> = new Lpg.Util.ArrayList<IToken>();
    private adjuncts: Lpg.Util.ArrayList<IToken> = new Lpg.Util.ArrayList<IToken>();
    private index: number = 0;
    private len: number = 0;
 
    constructor(iLexStream?: ILexStream | null) {
       
        if (iLexStream) {
            this.iLexStream = iLexStream;
            iLexStream.setPrsStream(this);
            this.resetTokenStream();
        }
        
    }
    public orderedExportedSymbols(): string[] {
        return [];
    }
    public remapTerminalSymbols(ordered_parser_symbols: string[], eof_symbol: number): void {
        // lexStream might be null, maybe only erroneously, but it has happened
        if (!this.iLexStream || this.iLexStream instanceof EscapeStrictPropertyInitializationLexStream ) {
            throw new ReferenceError("PrsStream.remapTerminalSymbols(..):  lexStream is undefined");
        }

        let ordered_lexer_symbols: string[] = this.iLexStream.orderedExportedSymbols();
        if (ordered_lexer_symbols == undefined) {
            throw new NullTerminalSymbolsException();
        }
        if (ordered_parser_symbols == undefined) {
            throw new NullTerminalSymbolsException();
        }
        let unimplemented_symbols: Lpg.Util.ArrayList<number> = new Lpg.Util.ArrayList<number>();
        if (ordered_lexer_symbols != ordered_parser_symbols) {
            this.kindMap = new Int32Array(ordered_lexer_symbols.length);
            let terminal_map =new  Map<string, number>();
            for (let i: number = 0; i < ordered_lexer_symbols.length; i++) {
                terminal_map.set(ordered_lexer_symbols[i], (i));
            }
            for (let i: number = 0; i < ordered_parser_symbols.length; i++) {
                let k: number = <number>terminal_map.get(ordered_parser_symbols[i]);
                if (k != undefined) {
                    this.kindMap[k] = i;
                } else {
                    if (i == eof_symbol) {
                        throw new UndefinedEofSymbolException();
                    }
                    unimplemented_symbols.add(i);
                }
            }
        }
        if (unimplemented_symbols.size() > 0) {
            throw new UnimplementedTerminalsException(unimplemented_symbols);
        }
    }
    public mapKind(kind: number): number {
        return (this.kindMap.length == 0 ? kind : this.kindMap[kind]);
    }
    public resetTokenStream(): void {
        this.tokens = new Lpg.Util.ArrayList<IToken>();
        this.index = 0;
        this.adjuncts = new Lpg.Util.ArrayList<IToken>();
    }
    public setLexStream(lexStream: ILexStream): void {
        this.iLexStream = lexStream;
        this.resetTokenStream();
    }
    public resetLexStream(lexStream: ILexStream): void {

        if (lexStream) {
            lexStream.setPrsStream(this);
            this.iLexStream = lexStream;
        }
    }


    public makeToken(startLoc: number, endLoc: number, kind: number): void {
        let token: Token = new Token( startLoc, endLoc, this.mapKind(kind),this);
        token.setTokenIndex(this.tokens.size());
        this.tokens.add(token);
        token.setAdjunctIndex(this.adjuncts.size());
    }
    public removeLastToken(): void {
        let last_index: number = this.tokens.size() - 1;
        let token: Token = <Token>this.tokens.get(last_index);
        let adjuncts_size: number = this.adjuncts.size();
        while (adjuncts_size > token.getAdjunctIndex()) {
            this.adjuncts.remove(--adjuncts_size);
        }
        this.tokens.remove(last_index);
    }
    public makeErrorToken(firsttok: number, lasttok: number, errortok: number, kind: number): number {
        let index: number = this.tokens.size(); // the next index

        //
        // Note that when creating an error token, we do not remap its kind.
        // Since this is not a lexical operation, it is the responsibility of
        // the calling program (a parser driver) to pass to us the proper kind
        // that it wants for an error token.
        //
        let token: Token = new ErrorToken(  this.getIToken(firsttok),
                                            this.getIToken(lasttok),
                                            this.getIToken(errortok),
                                            this.getStartOffset(firsttok),
                                            this.getEndOffset(lasttok),
                                            kind);

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
        let token_index: number = this.tokens.size() - 1;// index of last token processed
        let adjunct: Adjunct = new Adjunct(startLoc, endLoc, this.mapKind(kind), this);
        adjunct.setAdjunctIndex(this.adjuncts.size());
        adjunct.setTokenIndex(token_index);
        this.adjuncts.add(adjunct);
    }
    public addAdjunct(adjunct: IToken): void {
        let token_index: number = this.tokens.size() - 1;// index of last token processed
        adjunct.setTokenIndex(token_index);
        adjunct.setAdjunctIndex(this.adjuncts.size());
        this.adjuncts.add(adjunct);
    }
    public getTokenText(i: number): string {
        let t: IToken = <IToken>this.tokens.get(i);
        return t.toString();
    }
    public getStartOffset(i: number): number {
        let t: IToken = <IToken>this.tokens.get(i);
        return t.getStartOffset();
    }
    public getEndOffset(i: number): number {
        let t: IToken = <IToken>this.tokens.get(i);
        return t.getEndOffset();
    }
    public getTokenLength(i: number): number {
        let t: IToken = <IToken>this.tokens.get(i);
        return t.getEndOffset() - t.getStartOffset() + 1;
    }
    public getLineNumberOfTokenAt(i: number): number {
        if (!this.iLexStream) return 0;
        let t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream?.getLineNumberOfCharAt(t.getStartOffset());
    }
    public getEndLineNumberOfTokenAt(i: number): number {
        if (!this.iLexStream) return 0;
        let t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream?.getLineNumberOfCharAt(t.getEndOffset());
    }
    public getColumnOfTokenAt(i: number): number {
        if (!this.iLexStream) return 0;
        let t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream?.getColumnOfCharAt(t.getStartOffset());
    }
    public getEndColumnOfTokenAt(i: number): number {
        if (!this.iLexStream) return 0;
        let t: IToken = <IToken>this.tokens.get(i);
        return this.iLexStream?.getColumnOfCharAt(t.getEndOffset());
    }
    public orderedTerminalSymbols(): string[] {
        return [];
    }
    public getLineOffset(i: number): number {
        if (!this.iLexStream) return 0;
        return this.iLexStream?.getLineOffset(i);
    }
    public getLineCount(): number {
        if (!this.iLexStream) return 0;
        return this.iLexStream?.getLineCount();
    }
    public getLineNumberOfCharAt(i: number): number {
        if (!this.iLexStream) return 0;
        return this.iLexStream?.getLineNumberOfCharAt(i);
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
    public getInputChars(): string {
        return (this.iLexStream instanceof LexStream ? (<LexStream>this.iLexStream).getInputChars() : "");
    }

    public getInputBytes(): Int8Array {
      //  return (this.iLexStream instanceof Utf8LexStream ? (<Utf8LexStream>this.iLexStream).getInputBytes() : undefined);
        return new Int8Array(0);
    }
    public toStringFromIndex(first_token: number, last_token: number): string {
        return this.toString(<IToken>this.tokens.get(first_token), <IToken>this.tokens.get(last_token));
    }
    public toString(t1: IToken, t2: IToken): string {
        if (!this.iLexStream) return "";
        return this.iLexStream?.toString(t1.getStartOffset(), t2.getEndOffset());
    }
    public getSize(): number {
        return this.tokens.size();
    }
    public setSize(): void {
        this.len = this.tokens.size();
    }
    public getTokenIndexAtCharacter(offset: number): number {
        let low: number = 0, high: number = this.tokens.size();
        while (high > low) {
            let mid: number = Math.floor((high + low) / 2);
            let mid_element: IToken = <IToken>this.tokens.get(mid);
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
    public getTokenAtCharacter(offset: number): IToken | undefined {
        let tokenIndex: number = this.getTokenIndexAtCharacter(offset);
        return (tokenIndex < 0) ? undefined : this.getTokenAt(tokenIndex);
    }
    public getTokenAt(i: number): IToken {
        return <IToken>this.tokens.get(i);
    }
    public getIToken(i: number): IToken {
        return <IToken>this.tokens.get(i);
    }
    public getTokens(): Lpg.Util.ArrayList<IToken> {
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
    public setStreamLength2(): void {
        this.len = this.tokens.size();
    }
    public setStreamLength(len: number = -1): void {
        if (-1 == len) {
            this.setStreamLength2();
            return;
        }
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
        Lpg.Lang.System.Out.println(" Kind \tOffset \tLen \tLine \tCol \tText\n");
        for (let i: number = 1; i < this.getSize() - 1; i++) {
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
        console.log("\n");
    }
    private getAdjunctsFromIndex(i: number): IToken[] {
        let start_index: number = (<IToken>this.tokens.get(i)).getAdjunctIndex(),
            end_index: number = (i + 1 == this.tokens.size()
                                        ? this.adjuncts.size()
                                        : (<IToken>this.tokens.get(this.getNext(i))).getAdjunctIndex()),
            size: number = end_index - start_index;
        let slice: IToken[] = new Array<IToken>(size);
        for (let j: number = start_index, k: number = 0; j < end_index; j++, k++) {
            slice[k] = <IToken>this.adjuncts.get(j);
        }
        return slice;
    }
    public getFollowingAdjuncts(i: number): IToken[] {
        return this.getAdjunctsFromIndex(i);
    }
    public getPrecedingAdjuncts(i: number): IToken[] {
        return this.getAdjunctsFromIndex(this.getPrevious(i));
    }
    public getAdjuncts(): Lpg.Util.ArrayList<IToken> {
        return this.adjuncts;
    }
    public getToken2(): number {
        this.index = this.getNext(this.index);
        return this.index;
    }
    public getToken(end_token?: number ): number {
        if (!end_token) {
            return this.getToken2();
        }
        return this.index = (this.index < end_token ? this.getNext(this.index) : this.len - 1);
    }
    public getKind(i: number): number {
        let t: IToken = <IToken>this.tokens.get(i);
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
    public   reset1() : void
    {
        this.index = 0;
    }
    public   reset2(i : number) : void
    {
        this.index = this.getPrevious(i);
    }
    public reset(i?: number): void {
        if (!i) 
        {
            this.reset1();
        }
        else{
            this.reset2(i);
        }
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
        if (!this.iLexStream) return"";
        return this.iLexStream?.getFileName();
    }

    //
    // Here is where we report errors.  The default method is simply to print the error message to the console.
    // However, the user may supply an error message handler to process error messages.  To support that
    // a message handler interface is provided that has a single method handleMessage().  The user has his
    // error message handler class implement the IMessageHandler interface and provides an object of this type
    // to the runtime using the setMessageHandler(errorMsg) method. If the message handler object is set,
    // the reportError methods will invoke its handleMessage() method.
    //
    // IMessageHandler errMsg = null; // the error message handler object is declared in LexStream
    //
    public setMessageHandler(errMsg: IMessageHandler): void {
        this.iLexStream?.setMessageHandler(errMsg);
    }
    public getMessageHandler(): IMessageHandler | undefined {
        return this.iLexStream?.getMessageHandler();
    }
 
    public reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string | string[], errorToken: number = 0): void {
        let tempInfo: string[];
        if (typeof errorInfo == "string") {
            tempInfo = [errorInfo];
        }
        else if (Array.isArray(errorInfo)) {
            tempInfo = errorInfo;
        }
        else {
            tempInfo = [];
        }
        this.iLexStream?.reportLexicalError(this.getStartOffset(leftToken), this.getEndOffset(rightToken),errorCode, this.getStartOffset(errorToken), this.getEndOffset(errorToken), tempInfo);
    }
}

