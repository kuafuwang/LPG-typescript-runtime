export class DifferLines extends Differ {
    constructor(newStream: IPrsStream, oldStream: IPrsStream) {
        super(newStream, oldStream);
    }
    constructor() { }
    public getBuffer(prsStream: IPrsStream): Differ.ILine[] {
        var lex_stream: ILexStream = prsStream.getLexStream();
        var buffer: DifferLines.Line[] = new Array<DifferLines.Line>(lex_stream.getLineCount() + 1);
        var token: number = 1;
        buffer[0] = new DifferLines.Line(prsStream, 0, 0);
        for (var line_no: number = 1; line_no < buffer.length; line_no++) {
            var first_token: number = token;
            while (token < prsStream.getSize() && prsStream.getLine(token) == line_no) {
                token++;
            }
            buffer[line_no] = new DifferLines.Line(prsStream, first_token, token);
        }
        return buffer;
    }
    public printLines(prs_stream: IPrsStream, first_line: number, last_line: number): void {
        if (prs_stream.getLexStream() instanceof LexStream) {
            var lex_stream: LexStream = <LexStream>prs_stream.getLexStream();
            var buffer: string[] = lex_stream.getInputChars();
            for (var line_no: number = first_line; line_no <= last_line; line_no++) {
                var start: number = lex_stream.getLineOffset(line_no - 1) + 1, end: number = lex_stream.getLineOffset(line_no);
                var num: string = line_no + " ";
                for (var i: number = 0; i < (7 - num.length); i++) {
                    console.log(' ');
                }
                var line: string = num + buffer, start, end - start;
                console.log(line);
            }
        } else {
            if (prs_stream.getLexStream() instanceof Utf8LexStream) {
                var lex_stream: Utf8LexStream = <Utf8LexStream>prs_stream.getLexStream();
                var buffer: Int8Array = lex_stream.getInputBytes();
                for (var line_no: number = first_line; line_no <= last_line; line_no++) {
                    var start: number = lex_stream.getLineOffset(line_no - 1) + 1, end: number = lex_stream.getLineOffset(line_no);
                    var num: string = line_no + " ";
                    for (var i: number = 0; i < (7 - num.length); i++) {
                        console.log(' ');
                    }
                    var line: string = num + buffer, start, end - start;
                    console.log(line);
                }
            } else {
                throw new UnknownStreamType("Unknown stream type " + prs_stream.getLexStream().getClass().toString());
            }
        }
    }
    public outputInsert(element: Differ.Change): void {
        this.insertCount += (element.getNewe() - element.getNews() + 1);
        console.log("Insert after " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlde()].getStartLine() + " " + this.newStream.getFileName() + "," + this.newBuffer[element.getNews()].getStartLine() + (this.newBuffer[element.getNewe()].getEndLine() > this.newBuffer[element.getNews()].getStartLine() ? (".." + this.newBuffer[element.getNewe()].getEndLine()) : "") + ":");
        this.printLines(this.newStream, this.newBuffer[element.getNews()].getStartLine(), this.newBuffer[element.getNewe()].getEndLine());
    }
    public outputDelete(element: Differ.Change): void {
        this.deleteCount += (element.getOlde() - element.getOlds() + 1);
        console.log("Delete after " + this.newStream.getFileName() + "," + this.newBuffer[element.getNewe()].getStartLine() + " " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlds()].getStartLine() + (this.oldBuffer[element.getOlde()].getEndLine() > this.oldBuffer[element.getOlds()].getStartLine() ? (".." + this.oldBuffer[element.getOlde()].getEndLine()) : "") + ":");
        this.printLines(this.oldStream, this.oldBuffer[element.getOlds()].getStartLine(), this.oldBuffer[element.getOlde()].getEndLine());
    }
    public outputReplace(element: Differ.Change): void {
        this.replaceDeleteCount += (element.getOlde() - element.getOlds() + 1);
        this.replaceInsertCount += (element.getNewe() - element.getNews() + 1);
        console.log("Replace " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlds()].getStartLine() + (this.oldBuffer[element.getOlde()].getEndLine() > this.oldBuffer[element.getOlds()].getStartLine() ? (".." + this.oldBuffer[element.getOlde()].getEndLine()) : "") + ":");
        this.printLines(this.oldStream, this.oldBuffer[element.getOlds()].getStartLine(), this.oldBuffer[element.getOlde()].getEndLine());
        console.log("With " + this.newStream.getFileName() + "," + this.newBuffer[element.getNews()].getStartLine() + (this.newBuffer[element.getNewe()].getEndLine() > this.newBuffer[element.getNews()].getStartLine() ? (".." + this.newBuffer[element.getNewe()].getEndLine()) : "") + ":");
        this.printLines(this.newStream, this.newBuffer[element.getNews()].getStartLine(), this.newBuffer[element.getNewe()].getEndLine());
    }
    public outputMove(element: Differ.Change): void {
        this.moveCount += (element.getNewe() - element.getNews() + 1);
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlds()].getStartLine() + (this.oldBuffer[element.getOlde()].getEndLine() > this.oldBuffer[element.getOlds()].getStartLine() ? (".." + this.oldBuffer[element.getOlde()].getEndLine()) : "") + " to " + this.newStream.getFileName() + "," + this.newBuffer[element.getNews()].getStartLine() + (this.newBuffer[element.getNewe()].getEndLine() > this.newBuffer[element.getNews()].getStartLine() ? (".." + this.newBuffer[element.getNewe()].getEndLine()) : "") + ":");
        this.printLines(this.newStream, this.newBuffer[element.getNews()].getStartLine(), this.newBuffer[element.getNewe()].getEndLine());
    }
    public outputMoveDelete(element: Differ.Change): void {
        this.moveCount += (element.getNewe() - element.getNews() + 1);
        var bound: number = this.newBuffer[element.getNewe()].getEndLine() - this.newBuffer[element.getNews()].getStartLine();
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlds()].getStartLine() + (bound > 0 ? (".." + (this.oldBuffer[element.getOlds()].getStartLine() + bound)) : "") + " to " + this.newStream.getFileName() + "," + this.newBuffer[element.getNews()].getStartLine() + (this.newBuffer[element.getNewe()].getEndLine() > this.newBuffer[element.getNews()].getStartLine() ? (".." + this.newBuffer[element.getNewe()].getEndLine()) : "") + ":");
        this.printLines(this.newStream, this.newBuffer[element.getNews()].getStartLine(), this.newBuffer[element.getNewe()].getEndLine());
        var oldi: number = this.oldBuffer[element.getOlds()].getStartLine() + bound + 1;
        this.deleteCount += (element.getOlde() - element.getOlds() - element.getNewe() + element.getNews());
        console.log("... And delete " + this.oldStream.getFileName() + "," + oldi + (this.oldBuffer[element.getOlde()].getEndLine() > oldi ? (".." + this.oldBuffer[element.getOlde()].getEndLine()) : ""));
        this.printLines(this.oldStream, oldi, this.newBuffer[element.getOlde()].getEndLine());
    }
    public outputMoveInsert(element: Differ.Change): void {
        this.moveCount += (element.getOlde() - element.getOlds() + 1);
        var bound: number = this.oldBuffer[element.getOlde()].getStartLine() - this.oldBuffer[element.getOlds()].getEndLine();
        console.log("Move " + this.oldStream.getFileName() + "," + this.oldBuffer[element.getOlds()].getStartLine() + (this.oldBuffer[element.getOlde()].getEndLine() > this.oldBuffer[element.getOlds()].getStartLine() ? (".." + this.oldBuffer[element.getOlde()].getEndLine()) : "") + " to " + this.newStream.getFileName() + "," + this.newBuffer[element.getNews()].getStartLine() + (bound > 0 ? (".." + this.newBuffer[element.getNews()].getStartLine() + bound) : "") + ":");
        this.printLines(this.newStream, this.newBuffer[element.getNews()].getStartLine(), this.newBuffer[element.getNews()].getStartLine() + bound);
        var newi: number = this.newBuffer[element.getNews()].getStartLine() + bound + 1;
        this.insertCount += (element.getNewe() - element.getNews() - element.getOlde() + element.getOlds());
        console.log("... And insert " + this.newStream.getFileName() + "," + newi + (this.newBuffer[element.getNewe()].getEndLine() > newi ? (".." + this.newBuffer[element.getNewe()].getEndLine()) : "") + ":");
        this.printLines(this.newStream, newi, this.newBuffer[element.getNewe()].getEndLine());
    }
}
; export module DifferLines {
    ; export class Line implements Differ.ILine {
        private kind: Int32Array;
        private name: string[];
        private hash_code: number;
        private start_line: number;
        private start_column: number;
        private end_line: number;
        private end_column: number;
        private buffer_length: number;
        constructor(stream: IPrsStream, start_token: number, gate_token: number) {
            var size: number = (gate_token > start_token ? gate_token - start_token : 0), end_token: number = gate_token - 1;
            this.start_line = stream.getLine(start_token);
            this.start_column = stream.getColumn(start_token);
            if (size > 0) {
                this.end_line = stream.getEndLine(end_token);
                this.end_column = stream.getEndColumn(end_token);
            } else {
                this.end_line = stream.getLine(start_token);
                this.end_column = stream.getColumn(start_token);
            }
            this.kind = new Int32Array(size);
            this.name = new Array<string>(size);
            this.hash_code = size;
            for (var i: number = 0; i < size; i++) {
                this.kind[i] = stream.getKind(start_token + i);
                this.name[i] = stream.getName(start_token + i);
                this.buffer_length += (this.name[i].length + 1);
                this.hash_code += this.kind[i];
            }
            this.hash_code += this.buffer_length;
        }
        public size(): number {
            return this.kind.length;
        }
        public hashCode(): number {
            return this.hash_code;
        }
        public equals(anObject: any): boolean {
            if (this == anObject) {
                return true;
            }
            if (anObject instanceof DifferLines.Line) {
                var another_line: DifferLines.Line = <DifferLines.Line>anObject;
                if (this.kind.length == another_line.kind.length) {
                    var i: number;
                    for (i = 0; i < this.kind.length; i++) {
                        if (!(this.kind[i] == another_line.kind[i] && this.name[i] === another_line.name[i])) {
                            break;
                        }
                    }
                    return i == this.kind.length;
                }
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
            var buffer: StringBuffer = new StringBuffer(this.buffer_length);
            if (this.name.length > 0) {
                buffer.append(this.name[0]);
                for (var i: number = 1; i < this.name.length; i++) {
                    buffer.append(" ");
                    buffer.append(this.name[i]);
                }
            }
            return buffer.toString();
        }
    }
}
;