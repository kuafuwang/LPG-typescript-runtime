export interface ParseTable {
    baseCheck(index: number): number;
    rhs(index: number): number;
    baseAction(index: number): number;
    lhs(index: number): number;
    termCheck(index: number): number;
    termAction(index: number): number;
    asb(index: number): number;
    asr(index: number): number;
    nasb(index: number): number;
    nasr(index: number): number;
    terminalIndex(index: number): number;
    nonterminalIndex(index: number): number;
    scopePrefix(index: number): number;
    scopeSuffix(index: number): number;
    scopeLhs(index: number): number;
    scopeLa(index: number): number;
    scopeStateSet(index: number): number;
    scopeRhs(index: number): number;
    scopeState(index: number): number;
    inSymb(index: number): number;
    name(index: number): string;
    originalState(state: number): number;
    asi(state: number): number;
    nasi(state: number): number;
    inSymbol(state: number): number;
    ntAction(state: number, sym: number): number;
    tAction(act: number, sym: number): number;
    lookAhead(act: number, sym: number): number;
    getErrorSymbol(): number;
    getScopeUbound(): number;
    getScopeSize(): number;
    getMaxNameLength(): number;
    getNumStates(): number;
    getNtOffset(): number;
    getLaStateOffset(): number;
    getMaxLa(): number;
    getNumRules(): number;
    getNumNonterminals(): number;
    getNumSymbols(): number;

    getStartState(): number;
    getStartSymbol(): number;
    getEoftSymbol(): number;
    getEoltSymbol(): number;
    getAcceptAction(): number;
    getErrorAction(): number;
    isNullable(symbol: number): boolean;
    isValidForParser(): boolean;
    getBacktrack(): boolean;
}

export  class EscapeStrictPropertyInitializationParseTable implements ParseTable {
    baseCheck(index: number): number {
        throw new Error("Method not implemented.");
    }
    rhs(index: number): number {
        throw new Error("Method not implemented.");
    }
    baseAction(index: number): number {
        throw new Error("Method not implemented.");
    }
    lhs(index: number): number {
        throw new Error("Method not implemented.");
    }
    termCheck(index: number): number {
        throw new Error("Method not implemented.");
    }
    termAction(index: number): number {
        throw new Error("Method not implemented.");
    }
    asb(index: number): number {
        throw new Error("Method not implemented.");
    }
    asr(index: number): number {
        throw new Error("Method not implemented.");
    }
    nasb(index: number): number {
        throw new Error("Method not implemented.");
    }
    nasr(index: number): number {
        throw new Error("Method not implemented.");
    }
    terminalIndex(index: number): number {
        throw new Error("Method not implemented.");
    }
    nonterminalIndex(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopePrefix(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeSuffix(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeLhs(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeLa(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeStateSet(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeRhs(index: number): number {
        throw new Error("Method not implemented.");
    }
    scopeState(index: number): number {
        throw new Error("Method not implemented.");
    }
    inSymb(index: number): number {
        throw new Error("Method not implemented.");
    }
    name(index: number): string {
        throw new Error("Method not implemented.");
    }
    originalState(state: number): number {
        throw new Error("Method not implemented.");
    }
    asi(state: number): number {
        throw new Error("Method not implemented.");
    }
    nasi(state: number): number {
        throw new Error("Method not implemented.");
    }
    inSymbol(state: number): number {
        throw new Error("Method not implemented.");
    }
    ntAction(state: number, sym: number): number {
        throw new Error("Method not implemented.");
    }
    tAction(act: number, sym: number): number {
        throw new Error("Method not implemented.");
    }
    lookAhead(act: number, sym: number): number {
        throw new Error("Method not implemented.");
    }
    getErrorSymbol(): number {
        throw new Error("Method not implemented.");
    }
    getScopeUbound(): number {
        throw new Error("Method not implemented.");
    }
    getScopeSize(): number {
        throw new Error("Method not implemented.");
    }
    getMaxNameLength(): number {
        throw new Error("Method not implemented.");
    }
    getNumStates(): number {
        throw new Error("Method not implemented.");
    }
    getNtOffset(): number {
        throw new Error("Method not implemented.");
    }
    getLaStateOffset(): number {
        throw new Error("Method not implemented.");
    }
    getMaxLa(): number {
        throw new Error("Method not implemented.");
    }
    getNumRules(): number {
        throw new Error("Method not implemented.");
    }
    getNumNonterminals(): number {
        throw new Error("Method not implemented.");
    }
    getNumSymbols(): number {
        throw new Error("Method not implemented.");
    }
    getSegmentSize(): number {
        throw new Error("Method not implemented.");
    }
    getStartState(): number {
        throw new Error("Method not implemented.");
    }
    getStartSymbol(): number {
        throw new Error("Method not implemented.");
    }
    getEoftSymbol(): number {
        throw new Error("Method not implemented.");
    }
    getEoltSymbol(): number {
        throw new Error("Method not implemented.");
    }
    getAcceptAction(): number {
        throw new Error("Method not implemented.");
    }
    getErrorAction(): number {
        throw new Error("Method not implemented.");
    }
    isNullable(symbol: number): boolean {
        throw new Error("Method not implemented.");
    }
    isValidForParser(): boolean {
        throw new Error("Method not implemented.");
    }
    getBacktrack(): boolean {
        throw new Error("Method not implemented.");
    }
}
