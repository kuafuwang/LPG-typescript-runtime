export module DifferTokens {
    ; export class Token implements Differ.ILine {
        private kind: number;
        private start_line: number;
        private start_column: number;
        private end_line: number;
        private end_column: number;
        private name: string;
        private hash_code: number;
        constructor(stream: IPrsStream, token: number) {
            this.kind = stream.getKind(token);
            this.name = stream.getName(token);
            this.start_line = stream.getLine(token);
            this.start_column = stream.getColumn(token);
            this.end_line = stream.getEndLine(token);
            this.end_column = stream.getEndColumn(token);
            this.hash_code = this.name.hashCode();
        }
        public size(): number {
            return this.name.length;
        }
        public hashCode(): number {
            return this.hash_code;
        }
        public equals(anObject: any): boolean {
            if (this == anObject) {
                return true;
            }
            if (anObject instanceof DifferTokens.Token) {
                var another_token: DifferTokens.Token = <DifferTokens.Token>anObject;
                return (this.kind == another_token.kind && this.name === another_token.name);
            }
            return false;
        }
        public getStartLine(): number {
            return this.start_line;
        }
        public getStartColumn(): number {
            return this.start_column;
        }
        public getEndLine(): number {
            return this.end_line;
        }
        public getEndColumn(): number {
            return this.end_column;
        }
        public toString(): string {
            return this.name;
        }
    }
}
;

export class DifferTokens extends Differ {
    constructor() { }
    constructor(newStream: IPrsStream, oldStream: IPrsStream) {
        super(newStream, oldStream);
    }
    public getBuffer(stream: IPrsStream): Differ.ILine[] {
        var buffer: DifferTokens.Token[] = new Array<DifferTokens.Token>(stream.getStreamLength());
        for (var i: number = 1; i < stream.getStreamLength(); i++) {
            buffer[i] = new DifferTokens.Token(stream, i);
        }
        return buffer;
    }
    public printLines(prs_stream: IPrsStream, first_token: number, last_token: number): void {
        var start_line: number = prs_stream.getLine(first_token), end_line: number = prs_stream.getLine(last_token);
        var lex_stream: ILexStream = prs_stream.getLexStream();
        var char_buffer: string[] = null;
        var byte_buffer: Int8Array = null;
        if (lex_stream instanceof LexStream) {
            char_buffer = (<LexStream>lex_stream).getInputChars();
        } else {
            if (lex_stream instanceof Utf8LexStream) {
                byte_buffer = (<Utf8LexStream>lex_stream).getInputBytes();
            } else {
                throw new UnknownStreamType("Unknown stream type " + lex_stream.getClass().toString());
            }
        }
        var start: number = lex_stream.getLineOffset(start_line - 1) + 1, end: number = lex_stream.getLineOffset(start_line);
        if (start_line == end_line) {
            var num: string = "" + start_line;
            for (var i: number = 0; i < (6 - num.length); i++) {
                console.log(' ');
            }
            var line: string = (char_buffer != null ? char_buffer, start, end - start : byte_buffer, start, end - start);
            console.log(start_line + " " + line);
            console.log("       ");
            for (var i: number = 0; i < prs_stream.getColumn(first_token) - 1; i++) {
                console.log(' ');
            }
            var length: number = prs_stream.getEndColumn(last_token) - prs_stream.getColumn(first_token);
            if (length < 2) {
                console.log('^');
            } else {
                console.log('<');
                for (var i: number = 1; i < length; i++) {
                    console.log('-');
                }
                console.log('>');
            }
        } else {
            console.log("       ");
            for (var i: number = 0; i < prs_stream.getColumn(first_token) - 1; i++) {
                console.log(' ');
            }
            var last_column: number = lex_stream.getColumn(lex_stream.getPrevious(end));
            console.log('<');
            for (var i: number = prs_stream.getColumn(first_token) + 1; i < last_column; i++) {
                console.log('-');
            }
            console.log("\n");
            for (var line_no: number = start_line; line_no <= end_line; line_no++) {
                start = lex_stream.getLineOffset(line_no - 1) + 1;
                end = lex_stream.getLineOffset(line_no);
                var num: string = "" + line_no;
                for (var i: number = 0; i < (6 - num.length); i++) {
                    console.log(' ');
                }
                var line: string = (char_buffer != null ? char_buffer, start, end - start : byte_buffer, start, end - start);
                console.log(line_no + " " + line);
            }
            console.log("       ");
            for (var i: number = 0; i < prs_stream.getEndColumn(last_token) - 1; i++) {
                console.log('-');
            }
            console.log('>');
        }
    }
    public outputInsert(element: Differ.Change): void {
        this.insertCount += (element.getNewe() - element.getNews() + 1);
        console.log("Insert after " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()) + " " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNews()) + ":" + this.newStream.getColumn(element.getNews()) + ".." + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + ":");
        this.printLines(this.newStream, element.getNews(), element.getNewe());
    }
    public outputDelete(element: Differ.Change): void {
        this.deleteCount += (element.getOlde() - element.getOlds() + 1);
        console.log("Delete after " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + " " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlds()) + ":" + this.oldStream.getColumn(element.getOlds()) + ".." + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()) + ":");
        this.printLines(this.oldStream, element.getOlds(), element.getOlde());
    }
    public outputReplace(element: Differ.Change): void {
        this.replaceDeleteCount += (element.getOlde() - element.getOlds() + 1);
        this.replaceInsertCount += (element.getNewe() - element.getNews() + 1);
        console.log("Replace " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlds()) + ":" + this.oldStream.getColumn(element.getOlds()) + ".." + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()) + ":");
        this.printLines(this.oldStream, element.getOlds(), element.getOlde());
        console.log("With " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNews()) + ":" + this.newStream.getColumn(element.getNews()) + ".." + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + ":");
        this.printLines(this.newStream, element.getNews(), element.getNewe());
    }
    public outputMove(element: Differ.Change): void {
        this.moveCount += (element.getNewe() - element.getNews() + 1);
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlds()) + ":" + this.oldStream.getColumn(element.getOlds()) + ".." + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()) + " to " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNews()) + ":" + this.newStream.getColumn(element.getNews()) + ".." + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + ":");
        this.printLines(this.newStream, element.getNews(), element.getNewe());
    }
    public outputMoveDelete(element: Differ.Change): void {
        var bound: number = element.getNewe() - element.getNews();
        this.moveCount += (bound + 1);
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlds()) + ":" + this.oldStream.getColumn(element.getOlds()) + ".." + this.oldStream.getLine(element.getOlds() + bound) + ":" + this.oldStream.getEndColumn(element.getOlds() + bound) + " to " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNews()) + ":" + this.newStream.getColumn(element.getNews()) + ".." + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + ":");
        this.printLines(this.newStream, element.getNews(), element.getNewe());
        var oldi: number = element.getOlds() + bound + 1;
        this.deleteCount += (element.getOlde() - oldi + 1);
        console.log("... And delete " + this.oldStream.getFileName() + "," + this.oldStream.getLine(oldi) + ":" + this.oldStream.getColumn(oldi) + ".." + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()));
        this.printLines(this.oldStream, oldi, element.getOlde());
    }
    public outputMoveInsert(element: Differ.Change): void {
        var bound: number = element.getOlde() - element.getOlds();
        this.moveCount += (element.getOlde() - element.getOlds() + 1);
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldStream.getLine(element.getOlds()) + ":" + this.oldStream.getColumn(element.getOlds()) + ".." + this.oldStream.getLine(element.getOlde()) + ":" + this.oldStream.getEndColumn(element.getOlde()) + " to " + this.newStream.getFileName() + "," + this.newStream.getLine(element.getNews()) + ":" + this.newStream.getColumn(element.getNews()) + ".." + this.newStream.getLine(element.getNews() + bound) + ":" + this.newStream.getEndColumn(element.getNews() + bound) + ":");
        this.printLines(this.newStream, element.getNews(), element.getNews() + bound);
        var newi: number = element.getNews() + bound + 1;
        this.insertCount += (element.getNewe() - newi + 1);
        console.log("... And insert " + this.newStream.getFileName() + "," + this.newStream.getLine(newi) + ":" + this.newStream.getColumn(newi) + ".." + this.newStream.getLine(element.getNewe()) + ":" + this.newStream.getEndColumn(element.getNewe()) + ":");
        this.printLines(this.newStream, newi, element.getNewe());
    }
}
;
;