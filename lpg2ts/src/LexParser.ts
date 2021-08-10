
import { ParseTable } from "./ParseTable";
import { RuleAction } from "./RuleAction";
import { IntTuple } from "./IntTuple";
import { Monitor } from "./Monitor";
import { Lpg as Lpg } from "./Utils";
import { ILexStream } from "./Protocol";

export class LexParser {
    private taking_actions: boolean = false;
    private START_STATE: number=0;
    private LA_STATE_OFFSET: number=0;
    private EOFT_SYMBOL: number=0;
    private ACCEPT_ACTION: number=0;
    private ERROR_ACTION: number=0;
    private START_SYMBOL: number=0;
    private NUM_RULES: number=0;
    private tokStream: ILexStream;
    private prs: ParseTable;
    private ra: RuleAction;
    private action: IntTuple = new IntTuple(0);
    private readonly  STACK_INCREMENT: number = 1024;
    private stateStackTop: number = 0;
    private stackLength: number = 0;
    private stack: Int32Array = new Int32Array(0) ;
    private locationStack: Int32Array = new Int32Array(0);
    private tempStack: Int32Array = new Int32Array(0);
    private lastToken: number =0;
    private currentAction: number=0;
    private curtok: number=0;
    private starttok: number=0;
    private current_kind: number=0;

    public reset(tokStream: ILexStream, prs: ParseTable, ra: RuleAction): void {
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
  
    constructor(tokStream?: ILexStream, prs?: ParseTable, ra?: RuleAction) {
        if (tokStream && prs && ra)
            this.reset(tokStream, prs, ra);
    }
    private reallocateStacks(): void {
        let old_stack_length: number = (this.stack.length === 0 ? 0 : this.stackLength);
        this.stackLength += this.STACK_INCREMENT;
        if (old_stack_length == 0) {
            this.stack = new Int32Array(this.stackLength);
            this.locationStack = new Int32Array(this.stackLength);
            this.tempStack = new Int32Array(this.stackLength);
        } else {
            Lpg.Lang.System.arraycopy(this.stack, 0, this.stack = new Int32Array(this.stackLength), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(this.stackLength), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.tempStack, 0, this.tempStack = new Int32Array(this.stackLength), 0, old_stack_length);
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
        if (this.stack.length == 0) {
            this.reallocateStacks();
        }
        if (this.action.capacity() == 0) {
            this.action = new IntTuple(1 << 10);
        }
    }
    
    public parseCharacters(start_offset: number, end_offset: number, monitor?: Monitor): void {
        this.resetTokenStream(start_offset);
        while (this.curtok <= end_offset) {
            if (monitor && monitor.isCancelled()) {
                return;
            }
            this.lexNextToken(end_offset);
        }
    }
 
    public parseCharactersWhitMonitor(monitor?: Monitor): void {
        this.taking_actions = true;
        this.resetTokenStream(0);
        this.lastToken = this.tokStream.getPrevious(this.curtok);
        this.taking_actions = false;
        return;
    }
    private parseNextCharacter(token: number, kind: number): void {
        let start_action: number = this.stack[this.stateStackTop], pos: number = this.stateStackTop, tempStackTop: number = this.stateStackTop - 1;
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
                this.action = new IntTuple(0);
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
        let action_save: number = this.action.size();
        let   pos: number = this.stateStackTop, tempStackTop: number = this.stateStackTop - 1;
        act = this.tAction(act, kind);
        if (act == this.ERROR_ACTION) {
            this.action.reset(action_save);
        } else {
            this.stateStackTop = tempStackTop + 1;
            for (let i: number = pos + 1; i <= this.stateStackTop; i++) {
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