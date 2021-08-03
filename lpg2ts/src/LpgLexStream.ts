import { LexStream } from "./LexStream";
import { IntSegmentedTuple } from "./IntSegmentedTuple";

export abstract class LpgLexStream extends LexStream {
  
    constructor(fileName: string, inputChars?: string, tab: number = LexStream.DEFAULT_TAB, lineOffsets?: IntSegmentedTuple) {
        super(fileName, inputChars, tab, lineOffsets);
    }
    public abstract getKind(i: number): number;
    public abstract orderedExportedSymbols(): string[];
}