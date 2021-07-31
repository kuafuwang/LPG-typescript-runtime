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
    getSegmentSize(): number;
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
;