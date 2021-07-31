import { Utf8LexStream } from "./Utf8LexStream";
import { IntSegmentedTuple } from "./IntSegmentedTuple";

export abstract class Utf8LpgLexStream extends Utf8LexStream {
    constructor() {
        super();
    }
    constructor(tab: number) {
        super(tab);
    }
    constructor(fileName: string) {
        super(fileName);
    }
    constructor(fileName: string, tab: number) {
        super(fileName, tab);
    }
    constructor(inputChars: Int8Array, fileName: string) {
        super(inputChars, fileName);
    }
    constructor(lineOffsets: IntSegmentedTuple, inputChars: Int8Array, fileName: string) {
        super(lineOffsets, inputChars, fileName);
    }
    constructor(inputChars: Int8Array, fileName: string, tab: number) {
        super(inputChars, fileName, tab);
    }
    constructor(lineOffsets: IntSegmentedTuple, inputChars: Int8Array, fileName: string, tab: number) {
        super(lineOffsets, inputChars, fileName, tab);
    }
    public abstract getKind(i: number): number;
    public abstract orderedExportedSymbols(): string[];
};