import { ILexStream } from "./ILexStream";
import { ParseTable } from "./ParseTable";
import { RuleAction } from "./RuleAction";
import { IntTuple } from "./IntTuple";
import { Monitor } from "./Monitor";

export class LexParser {
    private taking_actions: boolean = false;
    private START_STATE: number;
    private LA_STATE_OFFSET: number;
    private EOFT_SYMBOL: number;
    private ACCEPT_ACTION: number;
    private ERROR_ACTION: number;
    private START_SYMBOL: number;
    private NUM_RULES: number;
    private tokStream: ILexStream;
    private prs: ParseTable;
    private ra: RuleAction;
    private action: IntTuple = null;
    private STACK_INCREMENT: number = 1024;
    private stateStackTop: number;
    private stackLength: number = 0;
    private stack: Int32Array;
    private locationStack: Int32Array;
    private tempStack: Int32Array;
    private lastToken: number;
    private currentAction: number;
    private curtok: number;
    private starttok: number;
    private current_kind: number;

    public reset(tokStream: ILexStream, prs: ParseTable = null, ra: RuleAction = null): void {
        this.tokStream = tokStream;
        this.prs = prs;
        this.ra = ra;
        this.START_STATE = prs.getStartState();
        this.LA_STATE_OFFSET = prs.getLaStateOffset();
        this.EOFT_SYMBOL = prs.getEoftSymbol();
        this.ACCEPT_ACTION = prs.getAcceptAction();
        this.ERROR_ACTION = prs.getErrorAction();
        this.START_SYMBOL = prs.getStartSymbol();
        this.NUM_RULES = prs.getNumRules();
    }
  
    constructor(tokStream: ILexStream = null, prs: ParseTable = null, ra: RuleAction = null) {
        if (tokStream)
            this.reset(tokStream, prs, ra);
    }
    private reallocateStacks(): void {
        var old_stack_length: number = (this.stack == null ? 0 : this.stackLength);
        this.stackLength += this.STACK_INCREMENT;
        if (old_stack_length == 0) {
            this.stack = new Int32Array(this.stackLength);
            this.locationStack = new Int32Array(this.stackLength);
            this.tempStack = new Int32Array(this.stackLength);
        } else {
            java.lang.System.arraycopy(this.stack, 0, this.stack = new Int32Array(this.stackLength), 0, old_stack_length);
            java.lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(this.stackLength), 0, old_stack_length);
            java.lang.System.arraycopy(this.tempStack, 0, this.tempStack = new Int32Array(this.stackLength), 0, old_stack_length);
        }
        return;
    }
 
    public getFirstToken(i: number = -0xfffff): number {
        if (i) {
            return this.getToken(i);
        }
        return this.starttok;
      
    }
    public getLastToken(i: number = -0xfffff): number {
        if (!i) {
            return this.lastToken;
        }
        if (this.taking_actions) {
            return (i >= this.prs.rhs(this.currentAction) ? this.lastToken : this.tokStream.getPrevious(this.getToken(i + 1)));
        }
        throw new Error();
    }
    public getCurrentRule(): number {
        if (this.taking_actions) {
            return this.currentAction;
        }
        throw new Error();
    }
    public getToken(i: number): number {
        if (this.taking_actions) {
            return this.locationStack[this.stateStackTop + (i - 1)];
        }
        throw new Error();
    }
    public setSym1(i: number): void { }
    public getSym(i: number): number {
        return this.getLastToken(i);
    }

    public resetTokenStream(i: number): void {
        this.tokStream.reset(i > this.tokStream.getStreamLength() ? this.tokStream.getStreamLength() : i);
        this.curtok = this.tokStream.getToken();
        this.current_kind = this.tokStream.getKind(this.curtok);
        if (this.stack == null) {
            this.reallocateStacks();
        }
        if (this.action == null) {
            this.action = new IntTuple(1 << 10);
        }
    }
    
    public parseCharacters(start_offset: number, end_offset: number, monitor: Monitor = null): void {
        this.resetTokenStream(start_offset);
        while (this.curtok <= end_offset) {
            if (monitor != null && monitor.isCancelled()) {
                return;
            }
            this.lexNextToken(end_offset);
        }
    }
 
    public parseCharactersWhitMonitor(monitor: Monitor=null): void {
        this.taking_actions = true;
        this.resetTokenStream(0);
        this.lastToken = this.tokStream.getPrevious(this.curtok);
        this.taking_actions = false;
        return;
    }
    private parseNextCharacter(token: number, kind: number): void {
        var start_action: number = this.stack[this.stateStackTop], pos: number = this.stateStackTop, tempStackTop: number = this.stateStackTop - 1;
        if (this.currentAction != this.ERROR_ACTION) {
        }
        return;
    }
    private lookahead(act: number, token: number): number {
        act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, this.tokStream.getKind(token));
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.getNext(token)) : act);
    }
    private tAction(act: number, sym: number): number {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.peek()) : act);
    }
    public scanNextToken2(): boolean {
        return this.lexNextToken(this.tokStream.getStreamLength());
    }
    public scanNextToken(start_offset: number = -0xffff): boolean {
        if (-0xffff === start_offset) {
            return this.scanNextToken2();
        }
        this.resetTokenStream(start_offset);
        return this.lexNextToken(this.tokStream.getStreamLength());
    }
    private lexNextToken(end_offset: number): boolean {
        this.taking_actions = false;
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;
        this.starttok = this.curtok;
        this.action.reset();
        if (this.starttok == this.curtok) {
            if (this.current_kind == this.EOFT_SYMBOL) {
                this.action = null;
                return false;
            }
            this.lastToken = this.curtok;
            this.tokStream.reportLexicalError(this.starttok, this.curtok);
            this.curtok = this.tokStream.getToken();
            if (this.curtok > end_offset) {
                this.curtok = this.tokStream.getStreamLength();
            }
            this.current_kind = this.tokStream.getKind(this.curtok);
        } else {
            this.lastToken = this.tokStream.getPrevious(this.curtok);
            this.tokStream.reportLexicalError(this.starttok, this.lastToken);
        }
        return true;
    }
    private lexNextCharacter(act: number, kind: number): number {
        var action_save: number = this.action.size(), pos: number = this.stateStackTop, tempStackTop: number = this.stateStackTop - 1;
        act = this.tAction(act, kind);
        if (act == this.ERROR_ACTION) {
            this.action.reset(action_save);
        } else {
            this.stateStackTop = tempStackTop + 1;
            for (var i: number = pos + 1; i <= this.stateStackTop; i++) {
                this.stack[i] = this.tempStack[i];
            }
        }
        return act;
    }
    private parseActions(): void {
        this.taking_actions = true;
        this.curtok = this.starttok;
        this.lastToken = this.tokStream.getPrevious(this.curtok);
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;
        this.taking_actions = false;
        return;
    }
}
;