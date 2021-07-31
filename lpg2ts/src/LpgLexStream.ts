import { LexStream } from "./LexStream";
import { IntSegmentedTuple } from "./IntSegmentedTuple";

export abstract class LpgLexStream extends LexStream {
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
    constructor(inputChars: string[], fileName: string) {
        super(inputChars, fileName);
    }
    constructor(lineOffsets: IntSegmentedTuple, inputChars: string[], fileName: string) {
        super(lineOffsets, inputChars, fileName);
    }
    constructor(inputChars: string[], fileName: string, tab: number) {
        super(inputChars, fileName, tab);
    }
    constructor(lineOffsets: IntSegmentedTuple, inputChars: string[], fileName: string, tab: number) {
        super(lineOffsets, inputChars, fileName, tab);
    }
    public abstract getKind(i: number): number;
    public abstract orderedExportedSymbols(): string[];
};