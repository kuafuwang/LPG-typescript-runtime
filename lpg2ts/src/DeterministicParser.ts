import { Stacks } from "./Stacks";
import { Monitor } from "./Monitor";
import { IntTuple } from "./IntTuple";
import { TokenStream } from "./TokenStream";
import { ParseTable } from "./ParseTable";
import { RuleAction } from "./RuleAction";

export class DeterministicParser extends Stacks {
    private taking_actions: boolean = false;
    private markerKind: number = 0;
    private monitor: Monitor;
    private START_STATE: number;
    private NUM_RULES: number;
    private NT_OFFSET: number;
    private LA_STATE_OFFSET: number;
    private EOFT_SYMBOL: number;
    private ACCEPT_ACTION: number;
    private ERROR_ACTION: number;
    private ERROR_SYMBOL: number;
    private lastToken: number;
    private currentAction: number;
    private action: IntTuple = null;
    private tokStream: TokenStream;
    private prs: ParseTable;
    private ra: RuleAction;
    private lookahead(act: number, token: number): number {
        act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, this.tokStream.getKind(token));
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.getNext(token)) : act);
    }
    private tAction(act: number, sym: number): number {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.peek()) : act);
    }
    private tAction(act: number, sym: Int32Array, index: number): number {
        act = this.prs.tAction(act, sym[index]);
        while (act > this.LA_STATE_OFFSET) {
            index = ((index + 1) % sym.length);
            act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, sym[index]);
        }
        return act;
    }
    private processReductions(): void {
        do {
            this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
            this.ra.ruleAction(this.currentAction);
            this.currentAction = this.prs.ntAction(this.stateStack[this.stateStackTop], this.prs.lhs(this.currentAction));
        } while (this.currentAction <= this.NUM_RULES)
        return;
    }
    public getCurrentRule(): number {
        if (this.taking_actions) {
            return this.currentAction;
        }
        throw new Error();
    }
    public getFirstToken(): number {
        if (this.taking_actions) {
            return this.getToken(1);
        }
        throw new Error();
    }
    public getFirstToken(i: number): number {
        if (this.taking_actions) {
            return this.getToken(i);
        }
        throw new Error();
    }
    public getLastToken(): number {
        if (this.taking_actions) {
            return this.lastToken;
        }
        throw new Error();
    }
    public getLastToken(i: number): number {
        if (this.taking_actions) {
            return (i >= this.prs.rhs(this.currentAction) ? this.lastToken : this.tokStream.getPrevious(this.getToken(i + 1)));
        }
        throw new Error();
    }
    public setMonitor(monitor: Monitor): void {
        this.monitor = monitor;
    }
    public reset(): void {
        this.taking_actions = false;
        this.markerKind = 0;
        if (this.action != null) {
            this.action.reset();
        }
    }
    public reset(monitor: Monitor, tokStream: TokenStream): void {
        this.monitor = monitor;
        this.tokStream = <TokenStream>tokStream;
        this.reset();
    }
    public reset(tokStream: TokenStream): void {
        this.reset(null, tokStream);
    }
    public reset(monitor: Monitor, tokStream: TokenStream, prs: ParseTable, ra: RuleAction): void {
        this.reset(monitor, tokStream);
        this.prs = prs;
        this.ra = ra;
        this.START_STATE = prs.getStartState();
        this.NUM_RULES = prs.getNumRules();
        this.NT_OFFSET = prs.getNtOffset();
        this.LA_STATE_OFFSET = prs.getLaStateOffset();
        this.EOFT_SYMBOL = prs.getEoftSymbol();
        this.ERROR_SYMBOL = prs.getErrorSymbol();
        this.ACCEPT_ACTION = prs.getAcceptAction();
        this.ERROR_ACTION = prs.getErrorAction();
        if (!prs.isValidForParser()) {
            throw new Error();
        }
        if (prs.getBacktrack()) {
            throw new Error();
        }
    }
    public reset(tokStream: TokenStream, prs: ParseTable, ra: RuleAction): void {
        this.reset(null, tokStream, prs, ra);
    }
    constructor() { }
    constructor(tokStream: TokenStream, prs: ParseTable, ra: RuleAction) {
        this.reset(null, tokStream, prs, ra);
    }
    constructor(monitor: Monitor, tokStream: TokenStream, prs: ParseTable, ra: RuleAction) {
        this.reset(monitor, tokStream, prs, ra);
    }
    public parse(): any {
        return this.parseEntry(0);
    }
    public parseEntry(marker_kind: number): any {
        this.taking_actions = true;
        this.tokStream.reset();
        this.lastToken = this.tokStream.getPrevious(this.tokStream.peek());
        var curtok: number, current_kind: number;
        if (marker_kind == 0) {
            curtok = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(curtok);
        } else {
            curtok = this.lastToken;
            current_kind = marker_kind;
        }
        this.reallocateStacks();
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;
        this.taking_actions = false;
        if (this.currentAction == this.ERROR_ACTION) {
            throw new Error(curtok);
        }
        return this.parseStack[marker_kind == 0 ? 0 : 1];
    }
    public resetParser(): void {
        this.resetParserEntry(0);
    }
    public resetParserEntry(marker_kind: number): void {
        this.markerKind = marker_kind;
        if (this.stateStack == null) {
            this.reallocateStacks();
        }
        this.stateStackTop = 0;
        this.stateStack[this.stateStackTop] = this.START_STATE;
        if (this.action == null) {
            this.action = new IntTuple(1 << 20);
        } else {
            this.action.reset();
        }
        this.taking_actions = false;
        if (marker_kind != 0) {
            var sym: Int32Array = new Int32Array(1);
            sym[0] = this.markerKind;
            this.parse(sym, 0);
        }
    }
    private recoverableState(state: number): boolean {
        for (var k: number = this.prs.asi(state); this.prs.asr(k) != 0; k++) {
            if (this.prs.asr(k) == this.ERROR_SYMBOL) {
                return true;
            }
        }
        return false;
    }
    public errorReset(): void {
        var gate: number = (this.markerKind == 0 ? 0 : 1);
        for (; this.stateStackTop >= gate; this.stateStackTop--) {
            if (this.recoverableState(this.stateStack[this.stateStackTop])) {
                break;
            }
        }
        if (this.stateStackTop < gate) {
            this.resetParserEntry(this.markerKind);
        }
        return;
    }
    public parse(sym: Int32Array, index: number): number {
        var save_action_length: number = this.action.size(), pos: number = this.stateStackTop, location_top: number = this.stateStackTop - 1;
        for (this.currentAction = this.tAction(this.stateStack[this.stateStackTop], sym, index); this.currentAction <= this.NUM_RULES; this.currentAction = this.tAction(this.currentAction, sym, index)) {
            this.action.add(this.currentAction);
            do {
                location_top -= (this.prs.rhs(this.currentAction) - 1);
                var state: number = (location_top > pos ? this.locationStack[location_top] : this.stateStack[location_top]);
                this.currentAction = this.prs.ntAction(state, this.prs.lhs(this.currentAction));
            } while (this.currentAction <= this.NUM_RULES)
            pos = pos < location_top ? pos : location_top;
            try {
                this.locationStack[location_top + 1] = this.currentAction;
            } catch ($ex$) {
                if ($ex$ instanceof Error) {
                    var e: Error = <Error>$ex$;
                    this.reallocateStacks();
                    this.locationStack[location_top + 1] = this.currentAction;
                } else {
                    throw $ex$;
                }
            }
        }
        if (this.currentAction > this.ERROR_ACTION || this.currentAction < this.ACCEPT_ACTION) {
            this.action.add(this.currentAction);
            this.stateStackTop = location_top + 1;
            for (var i: number = pos + 1; i <= this.stateStackTop; i++) {
                this.stateStack[i] = this.locationStack[i];
            }
            if (this.currentAction > this.ERROR_ACTION) {
                this.currentAction -= this.ERROR_ACTION;
                do {
                    this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                    this.currentAction = this.prs.ntAction(this.stateStack[this.stateStackTop], this.prs.lhs(this.currentAction));
                } while (this.currentAction <= this.NUM_RULES)
            }
            try {
                this.stateStack[++this.stateStackTop] = this.currentAction;
            } catch ($ex$) {
                if ($ex$ instanceof Error) {
                    var e: Error = <Error>$ex$;
                    this.reallocateStacks();
                    this.stateStack[this.stateStackTop] = this.currentAction;
                } else {
                    throw $ex$;
                }
            }
        } else {
            if (this.currentAction == this.ERROR_ACTION) {
                this.action.reset(save_action_length);
            }
        }
        return this.currentAction;
    }
    public parseActions(): any {
        this.taking_actions = true;
        this.tokStream.reset();
        this.lastToken = this.tokStream.getPrevious(this.tokStream.peek());
        var curtok: number = (this.markerKind == 0 ? this.tokStream.getToken() : this.lastToken);
        try {
            this.stateStackTop = -1;
            this.currentAction = this.START_STATE;
            for (var i: number = 0; i < this.action.size(); i++) {
                if (this.monitor != null && this.monitor.isCancelled()) {
                    this.taking_actions = false;
                    return null;
                }
                this.stateStack[++this.stateStackTop] = this.currentAction;
                this.locationStack[this.stateStackTop] = curtok;
                this.currentAction = this.action.get(i);
                if (this.currentAction <= this.NUM_RULES) {
                    this.stateStackTop--;
                    this.processReductions();
                } else {
                    this.lastToken = curtok;
                    curtok = this.tokStream.getToken();
                    if (this.currentAction > this.ERROR_ACTION) {
                        this.currentAction -= this.ERROR_ACTION;
                        this.processReductions();
                    }
                }
            }
        } catch ($ex$) {
            if ($ex$ instanceof Error) {
                var e: Error = <Error>$ex$;
                this.taking_actions = false;
                throw new Error(curtok);
            } else {
                throw $ex$;
            }
        }
        this.taking_actions = false;
        this.action = null;
        return this.parseStack[this.markerKind == 0 ? 0 : 1];
    }
}
;