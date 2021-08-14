
import { ConfigurationStack } from "./ConfigurationStack";
import { IntTuple } from "./IntTuple";
import { Monitor } from "./Monitor";
import { ParseTable } from "./ParseTable";
import { TokenStream } from "./TokenStream";
import { ParseErrorCodes } from "./ParseErrorCodes"
;
import { Lpg as Lpg } from "./Utils";

export class RepairCandidate {
    public symbol: number=0;
    public location: number=0;
}

; export class PrimaryRepairInfo {
    public distance: number=0;
    public misspellIndex: number=0;
    public code: number=0;
    public bufferPosition: number=0;
    public symbol: number=0;

    constructor(clone?: PrimaryRepairInfo) {
        if (clone)
            this.copy(clone);
    }
    public copy(clone: PrimaryRepairInfo): void {
        this.distance = clone.distance;
        this.misspellIndex = clone.misspellIndex;
        this.code = clone.code;
        this.bufferPosition = clone.bufferPosition;
        this.symbol = clone.symbol;
        return;
    }
}

; export class SecondaryRepairInfo {
    public code: number=0;
    public distance: number=0;
    public bufferPosition: number=0;
    public stackPosition: number=0;
    public numDeletions: number=0;
    public symbol: number=0;
    public recoveryOnNextStack: boolean=false;
}

; export class StateInfo {
    public state: number=0;
    public next: number=0;
    constructor(state: number, next: number) {
        this.state = state;
        this.next = next;
    }
}

export  const STACK_INCREMENT: number = 256;
export const  BUFF_UBOUND: number = 31;
export const  BUFF_SIZE: number = 32;
export const  MAX_DISTANCE: number = 30;
export const  MIN_DISTANCE: number = 3;

export class DiagnoseParser   {

    public monitor?: Monitor | null;
    public tokStream: TokenStream;

    public prs: ParseTable;

    public ERROR_SYMBOL: number=0;
    public SCOPE_SIZE: number=0;
    public MAX_NAME_LENGTH: number=0;
    public NT_OFFSET: number=0;
    public LA_STATE_OFFSET: number=0;
    public NUM_RULES: number=0;
    public NUM_SYMBOLS: number=0;
    public START_STATE: number=0;
    public EOFT_SYMBOL: number=0;
    public EOLT_SYMBOL: number=0;
    public ACCEPT_ACTION: number=0;
    public ERROR_ACTION: number = 0;

    public list: Int32Array;

    public maxErrors: number = 0;

    public maxTime: number = 0;

 
    public setMonitor(monitor?: Monitor): void {
        this.monitor = monitor;
    }
   
    constructor(tokStream: TokenStream, prs: ParseTable, maxErrors: number=0, maxTime: number=0,monitor?: Monitor | null) {
        this.monitor = monitor;
        this.maxErrors = maxErrors;
        this.maxTime = maxTime;
        this.tokStream = tokStream;
        this.prs = prs;
        this.main_configuration_stack = new ConfigurationStack(prs);
        this.ERROR_SYMBOL = prs.getErrorSymbol();
        this.SCOPE_SIZE = prs.getScopeSize();
        this.MAX_NAME_LENGTH = prs.getMaxNameLength();
        this.NT_OFFSET = prs.getNtOffset();
        this.LA_STATE_OFFSET = prs.getLaStateOffset();
        this.NUM_RULES = prs.getNumRules();
        this.NUM_SYMBOLS = prs.getNumSymbols();
        this.START_STATE = prs.getStartState();
        this.EOFT_SYMBOL = prs.getEoftSymbol();
        this.EOLT_SYMBOL = prs.getEoltSymbol();
        this.ACCEPT_ACTION = prs.getAcceptAction();
        this.ERROR_ACTION = prs.getErrorAction();
        this.list = new Int32Array(this.NUM_SYMBOLS + 1);
    }




    public rhs(index: number): number {
        return this.prs.rhs(index);
    }
    public baseAction(index: number): number {
        return this.prs.baseAction(index);
    }
    public baseCheck(index: number): number {
        return this.prs.baseCheck(index);
    }
    public lhs(index: number): number {
        return this.prs.lhs(index);
    }
    public termCheck(index: number): number {
        return this.prs.termCheck(index);
    }
    public termAction(index: number): number {
        return this.prs.termAction(index);
    }
    public asb(index: number): number {
        return this.prs.asb(index);
    }
    public asr(index: number): number {
        return this.prs.asr(index);
    }
    public nasb(index: number): number {
        return this.prs.nasb(index);
    }
    public nasr(index: number): number {
        return this.prs.nasr(index);
    }
    public terminalIndex(index: number): number {
        return this.prs.terminalIndex(index);
    }
    public nonterminalIndex(index: number): number {
        return this.prs.nonterminalIndex(index);
    }
    public symbolIndex(index: number): number {
        return index > this.NT_OFFSET
            ? this.nonterminalIndex(index - this.NT_OFFSET)
            : this.terminalIndex(index);
    }
    public scopePrefix(index: number): number {
        return this.prs.scopePrefix(index);
    }
    public scopeSuffix(index: number): number {
        return this.prs.scopeSuffix(index);
    }
    public scopeLhs(index: number): number {
        return this.prs.scopeLhs(index);
    }
    public scopeLa(index: number): number {
        return this.prs.scopeLa(index);
    }
    public scopeStateSet(index: number): number {
        return this.prs.scopeStateSet(index);
    }
    public scopeRhs(index: number): number {
        return this.prs.scopeRhs(index);
    }
    public scopeState(index: number): number {
        return this.prs.scopeState(index);
    }
    public inSymb(index: number): number {
        return this.prs.inSymb(index);
    }
    public name(index: number): string {
        return this.prs.name(index);
    }
    public originalState(state: number): number {
        return this.prs.originalState(state);
    }
    public asi(state: number): number {
        return this.prs.asi(state);
    }
    public nasi(state: number): number {
        return this.prs.nasi(state);
    }
    public inSymbol(state: number): number {
        return this.prs.inSymbol(state);
    }
    public ntAction(state: number, sym: number): number {
        return this.prs.ntAction(state, sym);
    }
    public isNullable(symbol: number): boolean {
        return this.prs.isNullable(symbol);
    }

    public stateStackTop: number = -1;
    public stateStack: Int32Array = new Int32Array(0);

    public locationStack: Int32Array = new Int32Array(0);

    public tempStackTop: number = -1;
    public tempStack: Int32Array = new Int32Array(0);

    public prevStackTop: number = -1;
    public prevStack: Int32Array = new Int32Array(0);

    public nextStackTop: number = -1;
    public nextStack: Int32Array = new Int32Array(0);

    public scopeStackTop: number = -1;
    public scopeIndex: Int32Array = new Int32Array(0);
    public scopePosition: Int32Array = new Int32Array(0);

    public buffer: Int32Array = new Int32Array(BUFF_SIZE);
    public main_configuration_stack: ConfigurationStack;

    private static readonly  NIL: number = -1;
    private stateSeen: Int32Array = new Int32Array(0);

    private statePoolTop: number = -1;
    private statePool: StateInfo[] = [];


    public reallocateStacks(): void {
        let old_stack_length: number = (this.stateStack == undefined ? 0 : this.stateStack.length),
            stack_length: number = old_stack_length + STACK_INCREMENT;

        if (!this.stateStack ||   this.stateStack.length == 0) {
            this.stateStack = new Int32Array(stack_length);
            this.locationStack = new Int32Array(stack_length);
            this.tempStack = new Int32Array(stack_length);
            this.prevStack = new Int32Array(stack_length);
            this.nextStack = new Int32Array(stack_length);
            this.scopeIndex = new Int32Array(stack_length);
            this.scopePosition = new Int32Array(stack_length);
        } else {
            Lpg.Lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.tempStack, 0, this.tempStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.prevStack, 0, this.prevStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.nextStack, 0, this.nextStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.scopeIndex, 0, this.scopeIndex = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.scopePosition, 0, this.scopePosition = new Int32Array(stack_length), 0, old_stack_length);
        }
        return;
    }
   
    public diagnose(error_token: number=0): void {
        this.diagnoseEntry(0, error_token);
    }

    public diagnoseEntry(marker_kind: number, error_token ?: number): void {
        if (error_token) {
            this.diagnoseEntry2(marker_kind, error_token);
        } else {
            this.diagnoseEntry1(marker_kind);
        }
    }
    public diagnoseEntry1(marker_kind: number): void {
        this.reallocateStacks();
        this.tempStackTop = 0;
        this.tempStack[this.tempStackTop] = this.START_STATE;
        this.tokStream.reset();
        let current_token: number,
            current_kind: number;
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }

        //
        // If an error was found, start the diagnosis and recovery.
        //
        let error_token: number = this.parseForError(current_kind);
        if (error_token !== 0) {
            this.diagnoseEntry(marker_kind, error_token);
        }
        return;
    }
    public diagnoseEntry2(marker_kind: number, error_token: number): void {
        let action: IntTuple = new IntTuple(1 << 18);
        let startTime: number = Date.now();
        let errorCount: number = 0;

        //
        // Compute sequence of actions that leads us to the
        // error_token.
        //
        if (!this.stateStack || this.stateStack.length == 0) {
            this.reallocateStacks();
        }

        this.tempStackTop = 0;
        this.tempStack[this.tempStackTop] = this.START_STATE;
        this.tokStream.reset();
        let current_token: number,
            current_kind: number;
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }
        this.parseUpToError(action, current_kind, error_token);

        //
        // Start parsing
        //
        this.stateStackTop = 0;
        this.stateStack[this.stateStackTop] = this.START_STATE;

        this.tempStackTop = this.stateStackTop;
        Lpg.Lang.System.arraycopy(this.tempStack, 0, this.stateStack, 0, this.tempStackTop + 1);

        this.tokStream.reset();
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }
        this.locationStack[this.stateStackTop] = current_token;

        //
        // Process a terminal
        //
        let act: number;
        do {
            //
            // Synchronize state stacks and update the location stack
            //
            let prev_pos: number = -1;
            this.prevStackTop = -1;

            let next_pos: number = -1;
            this.nextStackTop = -1;

            let pos: number = this.stateStackTop;
            this.tempStackTop = this.stateStackTop - 1;
            Lpg.Lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);

            let action_index: number = 0;
            act = action.get(action_index++);// tAction(act, current_kind);

            //
            // When a reduce action is encountered, we compute all REDUCE
            // and associated goto actions induced by the current token.
            // Eventually, a SHIFT, SHIFT-REDUCE, ACCEPT or ERROR action is
            // computed...
            //
            while (act <= this.NUM_RULES) {
                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)

                //
                // ... Update the maximum useful position of the
                // (STATE_)STACK, push goto state into stack, and
                // compute next action on current symbol ...
                //
                if (this.tempStackTop + 1 >= this.stateStack.length) {
                    this.reallocateStacks();
                }
                pos = pos < this.tempStackTop ? pos : this.tempStackTop;
                this.tempStack[this.tempStackTop + 1] = act;
                act = action.get(action_index++); // tAction(act, current_kind);
            }
            //
            // At this point, we have a shift, shift-reduce, accept or error
            // action.  STACK contains the configuration of the state stack
            // prior to executing any action on current_token. next_stack contains
            // the configuration of the state stack after executing all
            // reduce actions induced by current_token.  The variable pos indicates
            // the highest position in STACK that is still useful after the
            // reductions are executed.
            //
            while (act > this.ERROR_ACTION || act < this.ACCEPT_ACTION) {

                //
                // if the parser needs to stop processing,
                // it may do so here.
                //
                if (this.monitor  && this.monitor.isCancelled()) {
                    return;
                }

                this.nextStackTop = this.tempStackTop + 1;
                for (let i: number = next_pos + 1; i <= this.nextStackTop; i++) {
                    this.nextStack[i] = this.tempStack[i];
                }

                for (let k: number = pos + 1; k <= this.nextStackTop; k++) {
                    this.locationStack[k] = this.locationStack[this.stateStackTop];
                }

                //
                // If we have a shift-reduce, process it as well as
                // the goto-reduce actions that follow it.
                //
                if (act > this.ERROR_ACTION) {
                    act -= this.ERROR_ACTION;
                    do {
                        this.nextStackTop -= (this.rhs(act) - 1);
                        act = this.ntAction(this.nextStack[this.nextStackTop], this.lhs(act));
                    } while (act <= this.NUM_RULES)
                    pos = pos < this.nextStackTop ? pos : this.nextStackTop;
                }

                if (this.nextStackTop + 1 >= this.stateStack.length) {
                    this.reallocateStacks();
                }

                this.tempStackTop = this.nextStackTop;
                this.nextStack[++this.nextStackTop] = act;
                next_pos = this.nextStackTop;
                //
                // Simulate the parser through the next token without
                // destroying STACK or next_stack.
                //
                current_token = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(current_token);
                act = action.get(action_index++);// tAction(act, current_kind);
                while (act <= this.NUM_RULES) {
                    //
                    // ... Process all goto-reduce actions following
                    // reduction, until a goto action is computed ...
                    //

                    do {
                        let lhs_symbol: number = this.lhs(act);
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = (this.tempStackTop > next_pos
                                                 ? this.tempStack[this.tempStackTop]
                                                 : this.nextStack[this.tempStackTop]);
                        act = this.ntAction(act, lhs_symbol);
                    } while (act <= this.NUM_RULES)
                    //
                    // ... Update the maximum useful position of the
                    // (STATE_)STACK, push GOTO state into stack, and
                    // compute next action on current symbol ...
                    //
                    if (this.tempStackTop + 1 >= this.stateStack.length) {
                        this.reallocateStacks();
                    }
                    next_pos = next_pos < this.tempStackTop ? next_pos : this.tempStackTop;
                    this.tempStack[this.tempStackTop + 1] = act;
                    act = action.get(action_index++);// tAction(act, current_kind);
                }
                //
                // No error was detected, Read next token into
                // PREVTOK element, advance CURRENT_TOKEN pointer and
                // update stacks.
                //
                if (act !== this.ERROR_ACTION) {
                    this.prevStackTop = this.stateStackTop;
                    for (let i: number = prev_pos + 1; i <= this.prevStackTop; i++) {
                        this.prevStack[i] = this.stateStack[i];
                    }
                    prev_pos = pos;

                    this.stateStackTop = this.nextStackTop;
                    for (let k: number = pos + 1; k <= this.stateStackTop; k++) {
                        this.stateStack[k] = this.nextStack[k];
                    }
                    this.locationStack[this.stateStackTop] = current_token;
                    pos = next_pos;
                }
            }

            //
            // At this stage, either we have an ACCEPT or an ERROR
            // action.
            //
            if (act == this.ERROR_ACTION) {
                //
                // An error was detected.
                //
                errorCount += 1;
                //
                // Check time and error limits after the first error encountered
                // Exit if number of errors exceeds maxError or if maxTime reached
                //
                if (errorCount > 1) {
                    if (this.maxErrors > 0 && errorCount > this.maxErrors) {
                        break;
                    }
                    if (this.maxTime > 0 && Date.now() - startTime > this.maxTime) {
                        break;
                    }
                }
                let candidate: RepairCandidate = this.errorRecovery(current_token);
                //
                // if the parser needs to stop processing,
                // it may do so here.
                //
                if (this.monitor  && this.monitor.isCancelled()) {
                    return;
                }
                act = this.stateStack[this.stateStackTop];

                //
                // If the recovery was successful on a nonterminal candidate,
                // parse through that candidate and "read" the next token.
                //
                if (candidate.symbol == 0) {
                    break;
                } else {
                    if (candidate.symbol > this.NT_OFFSET) {
                        let lhs_symbol: number = candidate.symbol - this.NT_OFFSET;
                        act = this.ntAction(act, lhs_symbol);
                        while (act <= this.NUM_RULES) {
                            this.stateStackTop -= (this.rhs(act) - 1);
                            act = this.ntAction(this.stateStack[this.stateStackTop], this.lhs(act));
                        }
                        this.stateStack[++this.stateStackTop] = act;
                        current_token = this.tokStream.getToken();
                        current_kind = this.tokStream.getKind(current_token);
                        this.locationStack[this.stateStackTop] = current_token;
                    } else {
                        current_kind = candidate.symbol;
                        this.locationStack[this.stateStackTop] = candidate.location;
                    }
                }
                //
                // At this stage, we have a recovery configuration. See how
                // far we can go with it.
                //
                let next_token: number = this.tokStream.peek();
                this.tempStackTop = this.stateStackTop;
                Lpg.Lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);
                error_token = this.parseForError(current_kind);

                if (error_token !== 0) {
                    this.tokStream.reset(next_token);
                    this.tempStackTop = this.stateStackTop;
                    Lpg.Lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);
                    this.parseUpToError(action, current_kind, error_token);
                    this.tokStream.reset(next_token);
                } else {
                    act = this.ACCEPT_ACTION;
                }
            }
        } while (act !== this.ACCEPT_ACTION)
        return;
    }
    //
    // Given the configuration consisting of the states in tempStack
    // and the sequence of tokens (current_kind, followed by the tokens
    // in tokStream), keep parsing until either the parse completes
    // successfully or it encounters an error. If the parse is not
    // succesful, we return the farthest token on which an error was
    // encountered. Otherwise, we return 0.
    //
    public parseForError(current_kind: number): number {
        let error_token: number = 0;
        //
        // Get next token in stream and compute initial action
        //
        let curtok: number = this.tokStream.getPrevious(this.tokStream.peek()),
            act: number = this.tAction(this.tempStack[this.tempStackTop], current_kind);
        //
        // Allocate configuration stack.
        //
        let configuration_stack = new ConfigurationStack(this.prs);

        //
        // Keep parsing until we reach the end of file and succeed or
        // an error is encountered. The list of actions executed will
        // be store in the "action" tuple.
        //
        for (; ;) {
            if (act <= this.NUM_RULES) {

                this.tempStackTop--;

                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)

            }
            else if (act > this.ERROR_ACTION)
            {
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                act -= this.ERROR_ACTION;

                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
            }
            else if (act < this.ACCEPT_ACTION) {
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
            }
            else if (act == this.ERROR_ACTION)
            {
                error_token = (error_token > curtok ? error_token : curtok);

                let configuration = configuration_stack.pop();
                if (configuration == undefined) {
                    act = this.ERROR_ACTION;
                } else {
                    this.tempStackTop = configuration.stack_top;
                    configuration.retrieveStack(this.tempStack);
                    act = configuration.act;
                    curtok = configuration.curtok;
                    // no need to execute: action.reset(configuration.action_length);
                    current_kind = this.tokStream.getKind(curtok);
                    this.tokStream.reset(this.tokStream.getNext(curtok));
                    continue;
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION)
            {
                if (configuration_stack.findConfiguration(this.tempStack, this.tempStackTop, curtok)) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(this.tempStack, this.tempStackTop, act + 1, curtok, 0);
                    act = this.baseAction(act);
                }
                continue;
            }
            else {
                break;// assert(act == ACCEPT_ACTION);
            }

            if (++this.tempStackTop >= this.tempStack.length) {
                this.reallocateStacks();
            }
            this.tempStack[this.tempStackTop] = act;
            act = this.tAction(act, current_kind);
        }
        return (act == this.ERROR_ACTION ? error_token : 0);
    }
    //
    // Given the configuration consisting of the states in tempStack
    // and the sequence of tokens (current_kind, followed by the tokens
    // in tokStream), parse up to error_token in the tokStream and store
    // all the parsing actions executed in the "action" tuple.
    //
    public parseUpToError(action: IntTuple, current_kind: number, error_token: number): void {
        //
        // Assume predecessor of next token and compute initial action
        //
        let curtok: number = this.tokStream.getPrevious(this.tokStream.peek());
        let act: number = this.tAction(this.tempStack[this.tempStackTop], current_kind);
        //
        // Allocate configuration stack.
        //
        let configuration_stack = new ConfigurationStack(this.prs);
        //
        // Keep parsing until we reach the end of file and succeed or
        // an error is encountered. The list of actions executed will
        // be store in the "action" tuple.
        //
        action.reset();
        for (; ;) {
            if (act <= this.NUM_RULES) {
                action.add(act);// save this reduce action
                this.tempStackTop--;

                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)

            }
            else if (act > this.ERROR_ACTION)
            {
                action.add(act); // save this shift-reduce action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                act -= this.ERROR_ACTION;

                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
            }
            else if (act < this.ACCEPT_ACTION)
            {
                action.add(act);// save this shift action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
            }
            else if (act == this.ERROR_ACTION)
            {
                if (curtok !== error_token) {
                    let configuration = configuration_stack.pop();
                    if (configuration == undefined) {
                        act = this.ERROR_ACTION;
                    } else {
                        this.tempStackTop = configuration.stack_top;
                        configuration.retrieveStack(this.tempStack);
                        act = configuration.act;
                        curtok = configuration.curtok;
                        action.reset(configuration.action_length);
                        current_kind = this.tokStream.getKind(curtok);
                        this.tokStream.reset(this.tokStream.getNext(curtok));
                        continue;
                    }
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION) {
                if (configuration_stack.findConfiguration(this.tempStack, this.tempStackTop, curtok)) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(this.tempStack, this.tempStackTop, act + 1, curtok, action.size());
                    act = this.baseAction(act);
                }
                continue;
            } else {
                break;// assert(act == ACCEPT_ACTION);
            }


            if (++this.tempStackTop >= this.tempStack.length) {
                this.reallocateStacks();
            }
            this.tempStack[this.tempStackTop] = act;
            act = this.tAction(act, current_kind);
        }
        action.add(this.ERROR_ACTION);
        return;
    }
    //
    // Try to parse until first_symbol and all tokens in BUFFER have
    // been consumed, or an error is encountered. Return the number
    // of tokens that were expended before the parse blocked.
    //
    public parseCheck(stack: Int32Array, stack_top: number, first_symbol: number, buffer_position: number): number {
        let buffer_index: number,
            current_kind: number;

        let local_stack: Int32Array = new Int32Array(stack.length);
        let local_stack_top: number = stack_top;
        for (let i: number = 0; i <= stack_top; i++) {
            local_stack[i] = stack[i];
        }
        let configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);

        //
        // If the first symbol is a nonterminal, process it here.
        //
        let act: number = local_stack[local_stack_top];
        if (first_symbol > this.NT_OFFSET) {
            let lhs_symbol: number = first_symbol - this.NT_OFFSET;
            buffer_index = buffer_position;
            current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
            this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
            act = this.ntAction(act, lhs_symbol);
            while (act <= this.NUM_RULES) {
                local_stack_top -= (this.rhs(act) - 1);
                act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
            }
        } else {
            local_stack_top--;
            buffer_index = buffer_position - 1;
            current_kind = first_symbol;
            this.tokStream.reset(this.buffer[buffer_position]);
        }

        //
        // Start parsing the remaining symbols in the buffer
        //
        if (++local_stack_top >= local_stack.length) {// Stack overflow!!!
            return buffer_index;
        }
        local_stack[local_stack_top] = act;

        act = this.tAction(act, current_kind);

        for (; ;)
        {
            if (act <= this.NUM_RULES) // reduce action
            {  
                local_stack_top -= this.rhs(act);
                act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                while (act <= this.NUM_RULES) {
                    local_stack_top -= (this.rhs(act) - 1);
                    act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                }
            }
            else if (act > this.ERROR_ACTION)     // shift-reduce action
            {
                if (buffer_index++ == MAX_DISTANCE) {
                    break;
                }
                current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
                act -= this.ERROR_ACTION;

                do {
                    local_stack_top -= (this.rhs(act) - 1);
                    act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                } while (act <= this.NUM_RULES)
            }
            else if (act < this.ACCEPT_ACTION)    // shift action
            {
                if (buffer_index++ == MAX_DISTANCE) {
                    break;
                }
                current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
            }
            else if (act == this.ERROR_ACTION)
            {
                let configuration = configuration_stack.pop();
                if (configuration == undefined) {
                    act = this.ERROR_ACTION;
                } else {
                    local_stack_top = configuration.stack_top;
                    configuration.retrieveStack(local_stack);
                    act = configuration.act;
                    buffer_index = configuration.curtok;
                    // no need to execute: action.reset(configuration.action_length);
                    current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                    this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
                    continue;
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION)
            {
                if (configuration_stack.findConfiguration(local_stack, local_stack_top, buffer_index)) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(local_stack, local_stack_top, act + 1, buffer_index, 0);
                    act = this.baseAction(act);
                }
                continue;
            }
            else {
                break;
            }
                        

            if (++local_stack_top >= local_stack.length) {
                break;
            }
            local_stack[local_stack_top] = act;
            act = this.tAction(act, current_kind);
        }
        return (act == this.ACCEPT_ACTION ? MAX_DISTANCE : buffer_index);
    }

    //
    //  This routine is invoked when an error is encountered.  It
    // tries to diagnose the error and recover from it.  If it is
    // successful, the state stack, the current token and the buffer
    // are readjusted; i.e., after a successful recovery,
    // state_stack_top points to the location in the state stack
    // that contains the state on which to recover; current_token
    // identifies the symbol on which to recover.
    //
    // Up to three configurations may be available when this routine
    // is invoked. PREV_STACK may contain the sequence of states
    // preceding any action on prevtok, STACK always contains the
    // sequence of states preceding any action on current_token, and
    // NEXT_STACK may contain the sequence of states preceding any
    // action on the successor of current_token.
    //
    public errorRecovery(error_token: number): RepairCandidate {
        let prevtok: number = this.tokStream.getPrevious(error_token);

        //
        // Try primary phase recoveries. If not successful, try secondary
        // phase recoveries.  If not successful and we are at end of the
        // file, we issue the end-of-file error and quit. Otherwise, ...
        //
        let candidate: RepairCandidate = this.primaryPhase(error_token);
        if (candidate.symbol !== 0) {
            return candidate;
        }
        candidate = this.secondaryPhase(error_token);
        if (candidate.symbol !== 0) {
            return candidate;
        }
        //
        // At this point, primary and (initial attempt at) secondary
        // recovery did not work.  We will now get into "panic mode" and
        // keep trying secondary phase recoveries until we either find
        // a successful recovery or have consumed the remaining input
        // tokens.
        //
        if (this.tokStream.getKind(error_token) !== this.EOFT_SYMBOL) {
            while (this.tokStream.getKind(this.buffer[BUFF_UBOUND]) !== this.EOFT_SYMBOL) {
                candidate = this.secondaryPhase(this.buffer[MAX_DISTANCE - MIN_DISTANCE + 2]);
                if (candidate.symbol != 0) {
                    return candidate;
                }
            }
        }
        //
        // If no successful recovery is found and we have reached the
        // end of the file, check whether or not any scope recovery is
        // applicable at the end of the file after discarding some
        // states.
        //
        let scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        scope_repair.bufferPosition = BUFF_UBOUND;
        for (let top: number = this.stateStackTop; top >= 0; top--) {
            this.scopeTrial(scope_repair, this.stateStack, top);
            if (scope_repair.distance > 0) {
                break;
            }
        }
        //
        // If any scope repair was successful, emit the message now
        //
        for (let i: number = 0; i < this.scopeStackTop; i++) {
            this.emitError(ParseErrorCodes.SCOPE_CODE,
                            -this.scopeIndex[i],
                            this.locationStack[this.scopePosition[i]],
                            this.buffer[1],
                            this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
        }

        //
        // If the original error_token was already pointing to the EOF, issue the EOF-reached message.
        //
        if (this.tokStream.getKind(error_token) == this.EOFT_SYMBOL) {
            this.emitError(ParseErrorCodes.EOF_CODE,
                            this.terminalIndex(this.EOFT_SYMBOL),
                            prevtok,
                            prevtok);
        } else {
            //
            // We reached the end of the file while panicking. Delete all
            // remaining tokens in the input.
            //
            let i: number;
            for (i = BUFF_UBOUND; this.tokStream.getKind(this.buffer[i]) == this.EOFT_SYMBOL; i--)
            {
            }

            this.emitError(ParseErrorCodes.DELETION_CODE,
                            this.terminalIndex(this.tokStream.getKind(error_token)),
                            error_token,
                            this.buffer[i]);
        }
        //
        // Create the "failed" candidate and return it.
        //
        candidate.symbol = 0;
        candidate.location = this.buffer[BUFF_UBOUND];// point to EOF
        return candidate;
    }

    //
    // This function tries primary and scope recovery on each
    // available configuration.  If a successful recovery is found
    // and no secondary phase recovery can do better, a diagnosis is
    // issued, the configuration is updated and the function returns
    // "true".  Otherwise, it returns "false".
    //
    public primaryPhase(error_token: number): RepairCandidate {
        //
        // Initialize the buffer.
        //
        let i: number = (this.nextStackTop >= 0 ? 3 : 2);
        this.buffer[i] = error_token;

        for (let j: number = i; j > 0; j--) {
            this.buffer[j - 1] = this.tokStream.getPrevious(this.buffer[j]);
        }
        for (let k: number = i + 1; k < BUFF_SIZE; k++) {
            this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
        }

        //
        // If NEXT_STACK_TOP > 0 then the parse was successful on CURRENT_TOKEN
        // and the error was detected on the successor of CURRENT_TOKEN. In
        // that case, first check whether or not primary recovery is
        // possible on next_stack ...
        //
        let repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        if (this.nextStackTop >= 0) {
            repair.bufferPosition = 3;
            this.checkPrimaryDistance(repair, this.nextStack, this.nextStackTop);
        }

        //
        // ... Try primary recovery on the current token and compare
        // the quality of this recovery to the one on the next token...
        //
        let base_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
        base_repair.bufferPosition = 2;
        this.checkPrimaryDistance(base_repair, this.stateStack, this.stateStackTop);
        if (base_repair.distance > repair.distance || base_repair.misspellIndex > repair.misspellIndex) {
            repair = base_repair;
        }

        //
        // Finally, if prev_stack_top >= 0 try primary recovery on
        // the prev_stack configuration and compare it to the best
        // recovery computed thus far.
        //
        if (this.prevStackTop >= 0) {
            let prev_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
            prev_repair.bufferPosition = 1;
            this.checkPrimaryDistance(prev_repair, this.prevStack, this.prevStackTop);
            if (prev_repair.distance > repair.distance || prev_repair.misspellIndex > repair.misspellIndex) {
                repair = prev_repair;
            }
        }


        //
        // Before accepting the best primary phase recovery obtained,
        // ensure that we cannot do better with a similar secondary
        // phase recovery.
        //
        let candidate: RepairCandidate = new RepairCandidate();
        if (this.nextStackTop >= 0)// next_stack available
        {
            if (this.secondaryCheck(this.nextStack, this.nextStackTop, 3, repair.distance)) {
                return candidate;
            }
        } else {
            if (this.secondaryCheck(this.stateStack, this.stateStackTop, 2, repair.distance)) {
                return candidate;
            }
        }

        //
        // First, adjust distance if the recovery is on the error token;
        // it is important that the adjustment be made here and not at
        // each primary trial to prevent the distance tests from being
        // biased in favor of deferred recoveries which have access to
        // more input tokens...
        //
        repair.distance = repair.distance - repair.bufferPosition + 1;

        //
        // ...Next, adjust the distance if the recovery is a deletion or
        // (some form of) substitution...
        //
        if (repair.code == ParseErrorCodes.INVALID_CODE ||
            repair.code == ParseErrorCodes.DELETION_CODE ||
            repair.code == ParseErrorCodes.SUBSTITUTION_CODE ||
            repair.code == ParseErrorCodes.MERGE_CODE) {
            repair.distance--;
        }

        //
        // ... After adjustment, check if the most successful primary
        // recovery can be applied.  If not, continue with more radical
        // recoveries...
        //
        if (repair.distance < MIN_DISTANCE) {
            return candidate;
        }

        //
        // When processing an insertion error, if the token preceeding
        // the error token is not available, we change the repair code
        // into a BEFORE_CODE to instruct the reporting routine that it
        // indicates that the repair symbol should be inserted before
        // the error token.
        //
        if (repair.code == ParseErrorCodes.INSERTION_CODE) {
            if (this.tokStream.getKind(this.buffer[repair.bufferPosition - 1]) == 0) {
                repair.code = ParseErrorCodes.BEFORE_CODE;
            }
        }


        //
        // Select the proper sequence of states on which to recover,
        // update stack accordingly and call diagnostic routine.
        //
        if (repair.bufferPosition == 1) {
            this.stateStackTop = this.prevStackTop;
            Lpg.Lang.System.arraycopy(this.prevStack, 0, this.stateStack, 0, this.stateStackTop + 1);
        } else {
            if (this.nextStackTop >= 0 && repair.bufferPosition >= 3) {
                this.stateStackTop = this.nextStackTop;
                Lpg.Lang.System.arraycopy(this.nextStack, 0, this.stateStack, 0, this.stateStackTop + 1);
                this.locationStack[this.stateStackTop] = this.buffer[3];
            }
        }
        return this.primaryDiagnosis(repair);
    }



    //
    //  This function checks whether or not a given state has a
    // candidate, whose string representaion is a merging of the two
    // tokens at positions buffer_position and buffer_position+1 in
    // the buffer.  If so, it returns the candidate in question;
    // otherwise it returns 0.
    //
    public mergeCandidate(state: number, buffer_position: number): number {
        let str: string = this.tokStream.getName(this.buffer[buffer_position]) + this.tokStream.getName(this.buffer[buffer_position + 1]);
        for (let k: number = this.asi(state); this.asr(k) != 0; k++) {
            let i: number = this.terminalIndex(this.asr(k));
            if (str.length == this.name(i).length) {
                if (str.toLowerCase()==(this.name(i).toLowerCase())) {
                    return this.asr(k);
                }
            }
        }
        return 0;
    }




    //
    // This procedure takes as arguments a parsing configuration
    // consisting of a state stack (stack and stack_top) and a fixed
    // number of input tokens (starting at buffer_position) in the
    // input BUFFER; and some reference arguments: repair_code,
    // distance, misspell_index, candidate, and stack_position
    // which it sets based on the best possible recovery that it
    // finds in the given configuration.  The effectiveness of a
    // a repair is judged based on two criteria:
    //
    //       1) the number of tokens that can be parsed after the repair
    //              is applied: distance.
    //       2) how close to perfection is the candidate that is chosen:
    //              misspell_index.
    //
    // When this procedure is entered, distance, misspell_index and
    // repair_code are assumed to be initialized.
    //

    public checkPrimaryDistance(repair: PrimaryRepairInfo, stck: Int32Array, stack_top: number): void {
        //
        //  First, try scope recovery.
        //
        let scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
        this.scopeTrial(scope_repair, stck, stack_top);
        if (scope_repair.distance > repair.distance) {
            repair.copy(scope_repair);
        }

        //
        //  Next, try merging the error token with its successor.
        //
        let symbol: number = this.mergeCandidate(stck[stack_top], repair.bufferPosition);
        if (symbol !== 0) {
            let j: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 2);
            if ((j > repair.distance) || (j == repair.distance && repair.misspellIndex < 10)) {
                repair.misspellIndex = 10;
                repair.symbol = symbol;
                repair.distance = j;
                repair.code = ParseErrorCodes.MERGE_CODE;
            }
        }

        //
        // Next, try deletion of the error token.
        //
        let j: number = this.parseCheck(stck,
                                        stack_top,
                                        this.tokStream.getKind(this.buffer[repair.bufferPosition + 1]),
                                        repair.bufferPosition + 2);

        let k: number = (this.tokStream.getKind(this.buffer[repair.bufferPosition]) == this.EOLT_SYMBOL &&
                         this.tokStream.afterEol(this.buffer[repair.bufferPosition + 1])
                         ? 10
                         : 0);

        if (j > repair.distance || (j == repair.distance && k > repair.misspellIndex)) {
            repair.misspellIndex = k;
            repair.code = ParseErrorCodes.DELETION_CODE;
            repair.distance = j;
        }

        //
        // Update the error configuration by simulating all reduce and
        // goto actions induced by the error token. Then assign the top
        // most state of the new configuration to next_state.
        //
        let next_state: number = stck[stack_top],
            max_pos: number = stack_top;
        this.tempStackTop = stack_top - 1;

        this.tokStream.reset(this.buffer[repair.bufferPosition + 1]);
        let tok: number = this.tokStream.getKind(this.buffer[repair.bufferPosition]),
            act: number = this.tAction(next_state, tok);
        while (act <= this.NUM_RULES)
        {
            do
            {
                let lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);
                act = (this.tempStackTop > max_pos
                                        ? this.tempStack[this.tempStackTop]
                                        : stck[this.tempStackTop]);

                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)
            max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
            this.tempStack[this.tempStackTop + 1] = act;
            next_state = act;
            act = this.tAction(next_state, tok);
        }

        //
        //  Next, place the list of candidates in proper order.
        //
        let root: number = 0;
        for (let i: number = this.asi(next_state); this.asr(i) !== 0; i++) {
            symbol = this.asr(i);
            if (symbol !== this.EOFT_SYMBOL && symbol !== this.ERROR_SYMBOL) {
                if (root == 0) {
                    this.list[symbol] = symbol;
                } else {
                    this.list[symbol] = this.list[root];
                    this.list[root] = symbol;
                }
                root = symbol;
            }
        }
        if (stck[stack_top] !== next_state) {
            for (let i: number = this.asi(stck[stack_top]); this.asr(i) !== 0; i++) {
                symbol = this.asr(i);
                if (symbol !== this.EOFT_SYMBOL && symbol !== this.ERROR_SYMBOL && this.list[symbol] == 0) {
                    if (root == 0) {
                        this.list[symbol] = symbol;
                    } else {
                        this.list[symbol] = this.list[root];
                        this.list[root] = symbol;
                    }
                    root = symbol;
                }
            }
        }

        let head: number = this.list[root];
        this.list[root] = 0;
        root = head;

        //
        //  Next, try insertion for each possible candidate available in
        // the current state, except EOFT and ERROR_SYMBOL.
        //

        symbol = root;
        while (symbol !== 0) {
            let m: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition),
                n: number = (symbol == this.EOLT_SYMBOL && this.tokStream.afterEol(this.buffer[repair.bufferPosition])
                        ? 10
                        : 0);
            if (m > repair.distance ||
                (m == repair.distance && n > repair.misspellIndex)) {
                repair.misspellIndex = n;
                repair.distance = m;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INSERTION_CODE;
            }
            symbol = this.list[symbol];
        }

        //
        //  Next, Try substitution for each possible candidate available
        // in the current state, except EOFT and ERROR_SYMBOL.
        //
        symbol = root;
        while (symbol !== 0) {

            let m: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 1),
                n: number = (symbol == this.EOLT_SYMBOL && this.tokStream.afterEol(this.buffer[repair.bufferPosition + 1])
                    ? 10
                    : this.misspell(symbol, this.buffer[repair.bufferPosition]));
            if (m > repair.distance ||
                (m == repair.distance && n > repair.misspellIndex))
            {
                repair.misspellIndex = n;
                repair.distance = m;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.SUBSTITUTION_CODE;
            }
            let s: number = symbol;
            symbol = this.list[symbol];
            this.list[s] = 0;// reset element
        }

        //
        // Next, we try to insert a nonterminal candidate in front of the
        // error token, or substituting a nonterminal candidate for the
        // error token. Precedence is given to insertion.
        //
        for (let nt_index: number = this.nasi(stck[stack_top]); this.nasr(nt_index) !== 0; nt_index++) {
            symbol = this.nasr(nt_index) + this.NT_OFFSET;
            let n: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 1);
            if (n > repair.distance) {
                repair.misspellIndex = 0;
                repair.distance = n;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INVALID_CODE;
            }

            n = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition);
            if (n > repair.distance || (n == repair.distance && repair.code == ParseErrorCodes.INVALID_CODE))
            {
                repair.misspellIndex = 0;
                repair.distance = n;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INSERTION_CODE;
            }
        }
        return;
    }

    //
    // This procedure is invoked to issue a diagnostic message and
    // adjust the input buffer.  The recovery in question is either
    // the insertion of one or more scopes, the merging of the error
    // token with its successor, the deletion of the error token,
    // the insertion of a single token in front of the error token
    // or the substitution of another token for the error token.
    //
    public primaryDiagnosis(repair: PrimaryRepairInfo): RepairCandidate {
        //
        //  Issue diagnostic.
        //
        let prevtok: number = this.buffer[repair.bufferPosition - 1],
            current_token: number = this.buffer[repair.bufferPosition];

        switch (repair.code) {
            case ParseErrorCodes.INSERTION_CODE:
            case ParseErrorCodes.BEFORE_CODE:
                {
                    let name_index: number = (repair.symbol > this.NT_OFFSET
                                                    ? this.getNtermIndex(this.stateStack[this.stateStackTop],
                                                                        repair.symbol,
                                                                        repair.bufferPosition)

                                                    : this.getTermIndex(this.stateStack,
                                                                        this.stateStackTop,
                                                                        repair.symbol,
                                                                        repair.bufferPosition));

                    let tok: number = (repair.code == ParseErrorCodes.INSERTION_CODE ? prevtok : current_token);
                    this.emitError(repair.code, name_index, tok, tok);
                }
                break;
            case ParseErrorCodes.INVALID_CODE:
                {
                    let name_index: number = this.getNtermIndex(this.stateStack[this.stateStackTop],
                                                                repair.symbol,
                                                                repair.bufferPosition + 1);
                    this.emitError(repair.code, name_index, current_token, current_token);
                }
                break;
            case ParseErrorCodes.SUBSTITUTION_CODE:
                {
                    let name_index: number;
                    if (repair.misspellIndex >= 6) {
                        name_index = this.terminalIndex(repair.symbol);
                    } else {
                        name_index = this.getTermIndex(this.stateStack,
                            this.stateStackTop,
                            repair.symbol,
                            repair.bufferPosition + 1);
                        if (name_index != this.terminalIndex(repair.symbol)) {
                            repair.code = ParseErrorCodes.INVALID_CODE;
                        }
                    }
                    this.emitError(repair.code, name_index, current_token, current_token);
                }
                break;
            case ParseErrorCodes.MERGE_CODE:
                 this.emitError(repair.code,
                                this.terminalIndex(repair.symbol),
                                current_token,
                                this.tokStream.getNext(current_token));
                break;
            case ParseErrorCodes.SCOPE_CODE:
            {
                for (let i: number = 0; i < this.scopeStackTop; i++) {
                    this.emitError(repair.code,
                                    -this.scopeIndex[i],
                                    this.locationStack[this.scopePosition[i]],
                                    prevtok,
                                    this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
                }
                repair.symbol = this.scopeLhs(this.scopeIndex[this.scopeStackTop]) + this.NT_OFFSET;
                this.stateStackTop = this.scopePosition[this.scopeStackTop];
                this.emitError(repair.code,
                                -this.scopeIndex[this.scopeStackTop],
                                this.locationStack[this.scopePosition[this.scopeStackTop]],
                                prevtok,
                                this.getNtermIndex(this.stateStack[this.stateStackTop], repair.symbol, repair.bufferPosition));
                break;
            }
            default:// deletion
                this.emitError(repair.code, this.terminalIndex(this.ERROR_SYMBOL), current_token, current_token);
        }


        //
        //  Update buffer.
        //
        let candidate: RepairCandidate = new RepairCandidate();
        switch (repair.code) {
            case ParseErrorCodes.INSERTION_CODE:
            case ParseErrorCodes.BEFORE_CODE:
            case ParseErrorCodes.SCOPE_CODE:
                candidate.symbol = repair.symbol;
                candidate.location = this.buffer[repair.bufferPosition];
                this.tokStream.reset(this.buffer[repair.bufferPosition]);
                break;
            case ParseErrorCodes.INVALID_CODE:
            case ParseErrorCodes.SUBSTITUTION_CODE:
                candidate.symbol = repair.symbol;
                candidate.location = this.buffer[repair.bufferPosition];
                this.tokStream.reset(this.buffer[repair.bufferPosition + 1]);
                break;
            case ParseErrorCodes.MERGE_CODE:
                candidate.symbol = repair.symbol;
                candidate.location = this.buffer[repair.bufferPosition];
                this.tokStream.reset(this.buffer[repair.bufferPosition + 2]);
                break;
            default:// deletion
                candidate.location = this.buffer[repair.bufferPosition + 1];
                candidate.symbol = this.tokStream.getKind(this.buffer[repair.bufferPosition + 1]);
                this.tokStream.reset(this.buffer[repair.bufferPosition + 2]);
                break;
        }
        return candidate;
    }

    //
    // This function takes as parameter an integer STACK_TOP that
    // points to a STACK element containing the state on which a
    // primary recovery will be made; the terminal candidate on which
    // to recover; and an integer: buffer_position, which points to
    // the position of the next input token in the BUFFER.  The
    // parser is simulated until a shift (or shift-reduce) action
    // is computed on the candidate.  Then we proceed to compute the
    // the name index of the highest level nonterminal that can
    // directly or indirectly produce the candidate.
    //
    public getTermIndex(stck: Int32Array, stack_top: number, tok: number, buffer_position: number): number {
        //
        // Initialize stack index of temp_stack and initialize maximum
        // position of state stack that is still useful.
        //
        let act: number = stck[stack_top],
            max_pos: number = stack_top,
            highest_symbol: number = tok;

        this.tempStackTop = stack_top - 1;

        //
        // Compute all reduce and associated actions induced by the
        // candidate until a SHIFT or SHIFT-REDUCE is computed. ERROR
        // and ACCEPT actions cannot be computed on the candidate in
        // this context, since we know that it is suitable for recovery.
        //
        this.tokStream.reset(this.buffer[buffer_position]);
        act = this.tAction(act, tok);
        while (act <= this.NUM_RULES) {
            //
            // Process all goto-reduce actions following reduction,
            // until a goto action is computed ...
            //
            do {
                let lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);
                act = (this.tempStackTop > max_pos
                                        ? this.tempStack[this.tempStackTop]
                                        : stck[this.tempStackTop]);
                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)
            //
            // Compute new maximum useful position of (STATE_)stack,
            // push goto state into the stack, and compute next
            // action on candidate ...
            //
            max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }

        //
        // At this stage, we have simulated all actions induced by the
        // candidate and we are ready to shift or shift-reduce it. First,
        // set tok and next_ptr appropriately and identify the candidate
        // as the initial highest_symbol. If a shift action was computed
        // on the candidate, update the stack and compute the next
        // action. Next, simulate all actions possible on the next input
        // token until we either have to shift it or are about to reduce
        // below the initial starting point in the stack (indicated by
        // max_pos as computed in the previous loop).  At that point,
        // return the highest_symbol computed.
        //
        this.tempStackTop++;// adjust top of stack to reflect last goto
                                             // next move is shift or shift-reduce.

        let threshold: number = this.tempStackTop;

        tok = this.tokStream.getKind(this.buffer[buffer_position]);
        this.tokStream.reset(this.buffer[buffer_position + 1]);

        if (act > this.ERROR_ACTION) {// shift-reduce on candidate?
            act -= this.ERROR_ACTION;
        } else {
            if (act < this.ACCEPT_ACTION) {// shift on candidate
                this.tempStack[this.tempStackTop + 1] = act;
                act = this.tAction(act, tok);
            }
        }
        while (act <= this.NUM_RULES) {
            //
            // Process all goto-reduce actions following reduction,
            // until a goto action is computed ...
            //
            do {
                let lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);

                if (this.tempStackTop < threshold) {
                    return (highest_symbol  > this.NT_OFFSET
                                            ? this.nonterminalIndex(highest_symbol - this.NT_OFFSET)
                                            : this.terminalIndex(highest_symbol));
                }
                if (this.tempStackTop == threshold) {
                    highest_symbol = lhs_symbol + this.NT_OFFSET;
                }
                act = (this.tempStackTop > max_pos
                                        ? this.tempStack[this.tempStackTop]
                                        : stck[this.tempStackTop]);
                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)

            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);

        }
        return (highest_symbol  > this.NT_OFFSET
                                ? this.nonterminalIndex(highest_symbol - this.NT_OFFSET)
                                : this.terminalIndex(highest_symbol));
    }
    //
    // This function takes as parameter a starting state number:
    // start, a nonterminal symbol, A (candidate), and an integer,
    // buffer_position,  which points to the position of the next
    // input token in the BUFFER.
    // It returns the highest level non-terminal B such that
    // B =>*rm A.  I.e., there does not exists a nonterminal C such
    // that C =>+rm B. (Recall that for an LALR(k) grammar if
    // C =>+rm B, it cannot be the case that B =>+rm C)
    //
    public getNtermIndex(start: number, sym: number, buffer_position: number): number {
        let highest_symbol: number = sym - this.NT_OFFSET,
            tok: number = this.tokStream.getKind(this.buffer[buffer_position]);
        this.tokStream.reset(this.buffer[buffer_position + 1]);

        //
        // Initialize stack index of temp_stack and initialize maximum
        // position of state stack that is still useful.
        //
        this.tempStackTop = 0;
        this.tempStack[this.tempStackTop] = start;

        let act: number = this.ntAction(start, highest_symbol);
        if (act > this.NUM_RULES) {// goto action?
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }

        while (act <= this.NUM_RULES) {
            //
            // Process all goto-reduce actions following reduction,
            // until a goto action is computed ...
            //
            do {
                this.tempStackTop -= (this.rhs(act) - 1);
                if (this.tempStackTop < 0) {
                    return this.nonterminalIndex(highest_symbol);
                }
                if (this.tempStackTop == 0) {
                    highest_symbol = this.lhs(act);
                }
                act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
            } while (act <= this.NUM_RULES)
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }
        return this.nonterminalIndex(highest_symbol);
    }
    //
    //  Check whether or not there is a high probability that a
    // given string is a misspelling of another.
    // Certain singleton symbols (such as ":" and ";") are also
    // considered to be misspellings of each other.
    //
    public misspell(sym: number, tok: number): number {
        //
        // Set up the two strings in question. Note that there is a "0"
        // gate added at the end of each string. This is important as
        // the algorithm assumes that it can "peek" at the symbol immediately
        // following the one that is being analysed.
        //
        let s1: string = (this.name(this.terminalIndex(sym))).toLowerCase();
        let n: number = s1.length;
        s1 += '\u0000';
        let s2: string = (this.tokStream.getName(tok)).toLowerCase();
        let m: number = (s2.length < this.MAX_NAME_LENGTH ? s2.length : this.MAX_NAME_LENGTH);
        s2 = s2.substring(0, m) + '\u0000';

        //
        //  Singleton misspellings:
        //
        //  ;      <---->     ,
        //
        //  ;      <---->     :
        //
        //  .      <---->     ,
        //
        //  '      <---->     "
        //
        //
        if (n == 1 && m == 1) {
            if ((s1.charAt(0) == ';' && s2.charAt(0) == ',') ||
                (s1.charAt(0) == ','  && s2.charAt(0) == ';') ||
                (s1.charAt(0) == ';' && s2.charAt(0) == ':') ||
                (s1.charAt(0) == ':'  && s2.charAt(0) == ';') ||
                (s1.charAt(0) == '.'  && s2.charAt(0) == ',') ||
                (s1.charAt(0) == ','  && s2.charAt(0) == '.') ||
                (s1.charAt(0) == '\'' && s2.charAt(0) == '\"') ||
                (s1.charAt(0) == '\"' && s2.charAt(0) == '\'')) {
                return 3;
            }
        }

        //
        // Scan the two strings. Increment "match" count for each match.
        // When a transposition is encountered, increase "match" count
        // by two but count it as one error. When a typo is found, skip
        // it and count it as one error. Otherwise we have a mismatch; if
        // one of the strings is longer, increment its index, otherwise,
        // increment both indices and continue.
        //
        // This algorithm is an adaptation of a boolean misspelling
        // algorithm proposed by Juergen Uhl.
        //
        let count: number = 0,
            prefix_length: number = 0,
            num_errors: number = 0;

        let i: number = 0,
            j: number = 0;

        while ((i < n) && (j < m)) {
            if (s1.charAt(i) == s2.charAt(j)) {
                count++;
                i++;
                j++;
                if (num_errors == 0) {
                    prefix_length++;
                }
            }
            else if (s1.charAt(i + 1) == s2.charAt(j) && s1.charAt(i) == s2.charAt(j + 1))
            {
                count += 2;
                i += 2;
                j += 2;
                num_errors++;
            }
            else if (s1.charAt(i + 1) == s2.charAt(j + 1)) // mismatch
            {
                i += 2;
                j += 2;
                num_errors++;
            }
            else
            {
                if ((n - i) > (m - j)) {
                    i++;
                }
                else if ((m - j) > (n - i)) {
                    j++;
                }
                else {
                    i++;
                    j++;
                }
                num_errors++;
            }

        }

        if (i < n || j < m) {
            num_errors++;
        }

        if (num_errors > ((n < m ? n : m) / 6 + 1)) {
            count = prefix_length;
        }

        return Math.floor(count * 10 / ((n < s1.length ? s1.length : n) + num_errors));
    }

    public scopeTrial(repair: PrimaryRepairInfo, stack: Int32Array, stack_top: number): void {
        if (!this.stateSeen  || this.stateSeen.length == 0 || this.stateSeen.length < this.stateStack.length) {
            this.stateSeen = new Int32Array(this.stateStack.length);
        }
        for (let i: number = 0; i < this.stateStack.length; i++) {
            this.stateSeen[i] = DiagnoseParser.NIL;
        }

        this.statePoolTop = 0;
        if (!this.statePool ||this.statePool.length == 0 || this.statePool.length < this.stateStack.length) {
            this.statePool = new Array<StateInfo>(this.stateStack.length);
        }
        this.scopeTrialCheck(repair, stack, stack_top, 0);
        repair.code = ParseErrorCodes.SCOPE_CODE;
        repair.misspellIndex = 10;
        return;
    }

    public scopeTrialCheck(repair: PrimaryRepairInfo, stack: Int32Array, stack_top: number, indx: number): void {

        for (let i: number = this.stateSeen[stack_top]; i != DiagnoseParser.NIL; i = this.statePool[i].next) {
            if (this.statePool[i].state == stack[stack_top]) {
                return;
            }
        }
        let old_state_pool_top: number = this.statePoolTop++;
        if (this.statePoolTop >= this.statePool.length) {
            Lpg.Lang.System.arraycopy(this.statePool, 0, this.statePool = new Array<StateInfo>(this.statePoolTop * 2), 0, this.statePoolTop);
        }

        this.statePool[old_state_pool_top] = new StateInfo(stack[stack_top], this.stateSeen[stack_top]);
        this.stateSeen[stack_top] = old_state_pool_top;

        let action: IntTuple = new IntTuple(1 << 3);
        for (let i: number = 0; i < this.SCOPE_SIZE; i++) {
            //
            // Compute the action (or set of actions in case of conflicts) that
            // can be executed on the scope lookahead symbol. Save the action(s)
            // in the action tuple.
            //
            action.reset();
            let act: number = this.tAction(stack[stack_top], this.scopeLa(i));
            if (act > this.ACCEPT_ACTION && act < this.ERROR_ACTION)// conflicting actions?
            {
                do {
                    action.add(this.baseAction(act++));
                } while (this.baseAction(act) != 0)
            } else {
                action.add(act);
            }

            //
            // For each action defined on the scope lookahead symbol,
            // try scope recovery.
            //
            for (let action_index: number = 0; action_index < action.size(); action_index++)
            {
                this.tokStream.reset(this.buffer[repair.bufferPosition]);
                this.tempStackTop = stack_top - 1;
                let max_pos: number = stack_top;

                act = action.get(action_index);
                while (act <= this.NUM_RULES) {
                    //
                    // ... Process all goto-reduce actions following
                    // reduction, until a goto action is computed ...
                    //
                    do {
                        let lhs_symbol: number = this.lhs(act);
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = (this.tempStackTop > max_pos
                                                ? this.tempStack[this.tempStackTop]
                                                : stack[this.tempStackTop]);

                        act = this.ntAction(act, lhs_symbol);
                    } while (act <= this.NUM_RULES)
                    if (this.tempStackTop + 1 >= this.stateStack.length) {
                        return;
                    }
                    max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
                    this.tempStack[this.tempStackTop + 1] = act;
                    act = this.tAction(act, this.scopeLa(i));
                }
                //
                // If the lookahead symbol is parsable, then we check
                // whether or not we have a match between the scope
                // prefix and the transition symbols corresponding to
                // the states on top of the stack.
                //
                if (act !== this.ERROR_ACTION) {
                    let j: number,
                        k: number = this.scopePrefix(i);
                    for (j = this.tempStackTop + 1;
                        j >= (max_pos + 1) &&
                            this.inSymbol(this.tempStack[j]) == this.scopeRhs(k); j--) {
                        k++;
                    }
                    if (j == max_pos) {
                        for (j = max_pos;
                            j >= 1 && this.inSymbol(stack[j]) == this.scopeRhs(k);
                            j--) {
                            k++;
                        }
                    }
                    //
                    // If the prefix matches, check whether the state
                    // newly exposed on top of the stack, (after the
                    // corresponding prefix states are popped from the
                    // stack), is in the set of "source states" for the
                    // scope in question and that it is at a position
                    // below the threshold indicated by MARKED_POS.
                    //
                    let marked_pos: number = (max_pos < stack_top ? max_pos + 1 : stack_top);
                    if (this.scopeRhs(k) == 0 && j < marked_pos) {// match?
                        let stack_position: number = j;
                        for (j = this.scopeStateSet(i);
                             stack[stack_position] != this.scopeState(j) &&
                             this.scopeState(j) !== 0;
                             j++) {
                        }
                        //
                        // If the top state is valid for scope recovery,
                        // the left-hand side of the scope is used as
                        // starting symbol and we calculate how far the
                        // parser can advance within the forward context
                        // after parsing the left-hand symbol.
                        //
                        if (this.scopeState(j) !== 0) {// state was found
                            let previous_distance: number = repair.distance,
                                distance: number = this.parseCheck(stack,
                                                                    stack_position,
                                                                    this.scopeLhs(i) + this.NT_OFFSET,
                                                                    repair.bufferPosition);

                            //
                            // if the recovery is not successful, we
                            // update the stack with all actions induced
                            // by the left-hand symbol, and recursively
                            // call SCOPE_TRIAL_CHECK to try again.
                            // Otherwise, the recovery is successful. If
                            // the new distance is greater than the
                            // initial SCOPE_DISTANCE, we update
                            // SCOPE_DISTANCE and set scope_stack_top to INDX
                            // to indicate the number of scopes that are
                            // to be applied for a succesful  recovery.
                            // NOTE that this procedure cannot get into
                            // an infinite loop, since each prefix match
                            // is guaranteed to take us to a lower point
                            // within the stack.
                            //
                            if ((distance - repair.bufferPosition + 1) < MIN_DISTANCE) {
                                let top: number = stack_position;
                                act = this.ntAction(stack[top], this.scopeLhs(i));
                                while (act <= this.NUM_RULES) {
                                    top -= (this.rhs(act) - 1);
                                    act = this.ntAction(stack[top], this.lhs(act));
                                }
                                top++;
                                j = act;
                                act = stack[top];// save
                                stack[top] = j;// swap
                                this.scopeTrialCheck(repair, stack, top, indx + 1);
                                stack[top] = act;// restore
                            }
                            else if (distance > repair.distance)
                            {
                                this.scopeStackTop = indx;
                                repair.distance = distance;
                            }

                            //
                            // If no other recovery possibility is left (due to
                            // backtracking and we are at the end of the input,
                            // then we favor a scope recovery over all other kinds
                            // of recovery.
                            //
                            if ( // TODO: main_configuration_stack.size() == 0 && // no other bactracking possibilities left
                                this.tokStream.getKind(this.buffer[repair.bufferPosition]) == this.EOFT_SYMBOL &&
                                repair.distance == previous_distance)
                            {
                                this.scopeStackTop = indx;
                                repair.distance = MAX_DISTANCE;
                            }
                            //
                            // If this scope recovery has beaten the
                            // previous distance, then we have found a
                            // better recovery (or this recovery is one
                            // of a list of scope recoveries). Record
                            // its information at the proper location
                            // (INDX) in SCOPE_INDEX and SCOPE_STACK.
                            //
                            if (repair.distance > previous_distance)
                            {
                                this.scopeIndex[indx] = i;
                                this.scopePosition[indx] = stack_position;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    //
    // This function computes the ParseCheck distance for the best
    // possible secondary recovery for a given configuration that
    // either deletes none or only one symbol in the forward context.
    // If the recovery found is more effective than the best primary
    // recovery previously computed, then the function returns true.
    // Only misplacement, scope and manual recoveries are attempted;
    // simple insertion or substitution of a nonterminal are tried
    // in CHECK_PRIMARY_DISTANCE as part of primary recovery.
    //
    public secondaryCheck(stack: Int32Array, stack_top: number, buffer_position: number, distance: number): boolean {
        for (let top: number = stack_top - 1; top >= 0; top--) {
            let j: number = this.parseCheck(stack,
                                            top,
                                            this.tokStream.getKind(this.buffer[buffer_position]),
                                            buffer_position + 1);
            if (((j - buffer_position + 1) > MIN_DISTANCE) && (j > distance)) {
                return true;
            }
        }

        let scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        scope_repair.bufferPosition = buffer_position + 1;
        scope_repair.distance = distance;
        this.scopeTrial(scope_repair, stack, stack_top);
        return ((scope_repair.distance - buffer_position) > MIN_DISTANCE && scope_repair.distance > distance);
    }



    //
    // Secondary_phase is a boolean function that checks whether or
    // not some form of secondary recovery is applicable to one of
    // the error configurations. First, if "next_stack" is available,
    // misplacement and secondary recoveries are attempted on it.
    // Then, in any case, these recoveries are attempted on "stack".
    // If a successful recovery is found, a diagnosis is issued, the
    // configuration is updated and the function returns "true".
    // Otherwise, the function returns false.
    //
    public secondaryPhase(error_token: number): RepairCandidate {
        let repair: SecondaryRepairInfo = new SecondaryRepairInfo(),
            misplaced_repair: SecondaryRepairInfo = new SecondaryRepairInfo();

        //
        // If the next_stack is available, try misplaced and secondary
        // recovery on it first.
        //
        let next_last_index: number = 0;
        if (this.nextStackTop >= 0) {

            let save_location: number;

            this.buffer[2] = error_token;
            this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
            this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);

            for (let k: number = 3; k < BUFF_UBOUND; k++) {
                this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
            }

            this.buffer[BUFF_UBOUND] = this.tokStream.badToken();// elmt not available
            //
            // If we are at the end of the input stream, compute the
            // index position of the first EOFT symbol (last useful
            // index).
            //
            for (next_last_index = MAX_DISTANCE - 1;
                next_last_index >= 1 &&
                this.tokStream.getKind(this.buffer[next_last_index]) == this.EOFT_SYMBOL;
                next_last_index--) {
            }

            next_last_index = next_last_index + 1;

            save_location = this.locationStack[this.nextStackTop];
            this.locationStack[this.nextStackTop] = this.buffer[2];
            misplaced_repair.numDeletions = this.nextStackTop;
            this.misplacementRecovery(misplaced_repair, this.nextStack, this.nextStackTop, next_last_index, true);
            if (misplaced_repair.recoveryOnNextStack) {
                misplaced_repair.distance++;
            }
            repair.numDeletions = this.nextStackTop + BUFF_UBOUND;
            this.secondaryRecovery( repair,
                                    this.nextStack,
                                    this.nextStackTop,
                                    next_last_index, true);

            if (repair.recoveryOnNextStack) {
                repair.distance++;
            }
            this.locationStack[this.nextStackTop] = save_location;
        } else {// next_stack not available, initialize ...
            misplaced_repair.numDeletions = this.stateStackTop;
            repair.numDeletions = this.stateStackTop + BUFF_UBOUND;
        }

        //
        // Try secondary recovery on the "stack" configuration.
        //
        this.buffer[3] = error_token;

        this.buffer[2] = this.tokStream.getPrevious(this.buffer[3]);
        this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
        this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);

        for (let k: number = 4; k < BUFF_SIZE; k++) {
            this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
        }

        let last_index: number;
        for (last_index = MAX_DISTANCE - 1;
            last_index >= 1 &&
            this.tokStream.getKind(this.buffer[last_index]) == this.EOFT_SYMBOL;
            last_index--) {
        }
        last_index++;

        this.misplacementRecovery(misplaced_repair, this.stateStack, this.stateStackTop, last_index, false);

        this.secondaryRecovery(repair, this.stateStack, this.stateStackTop, last_index, false);

        //
        // If a successful misplaced recovery was found, compare it with
        // the most successful secondary recovery.  If the misplaced
        // recovery either deletes fewer symbols or parse-checks further
        // then it is chosen.
        //
        if (misplaced_repair.distance > MIN_DISTANCE)
        {
            if (misplaced_repair.numDeletions <= repair.numDeletions ||
                (misplaced_repair.distance - misplaced_repair.numDeletions) >=
                (repair.distance - repair.numDeletions))
            {
                repair.code = ParseErrorCodes.MISPLACED_CODE;
                repair.stackPosition = misplaced_repair.stackPosition;
                repair.bufferPosition = 2;
                repair.numDeletions = misplaced_repair.numDeletions;
                repair.distance = misplaced_repair.distance;
                repair.recoveryOnNextStack = misplaced_repair.recoveryOnNextStack;
            }
        }


        //
        // If the successful recovery was on next_stack, update: stack,
        // buffer, location_stack and last_index.
        //
        if (repair.recoveryOnNextStack)
        {
            this.stateStackTop = this.nextStackTop;
            Lpg.Lang.System.arraycopy(this.nextStack, 0, this.stateStack, 0, this.stateStackTop + 1);

            this.buffer[2] = error_token;
            this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
            this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);

            for (let k: number = 3; k < BUFF_UBOUND; k++) {
                this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
            }

            this.buffer[BUFF_UBOUND] = this.tokStream.badToken();// elmt not available

            this.locationStack[this.nextStackTop] = this.buffer[2];
            last_index = next_last_index;
        }

        //
        // Next, try scope recoveries after deletion of one, two, three,
        // four ... buffer_position tokens from the input stream.
        //
        if (repair.code == ParseErrorCodes.SECONDARY_CODE || repair.code == ParseErrorCodes.DELETION_CODE) {
            let scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
            for (scope_repair.bufferPosition = 2;
                scope_repair.bufferPosition <= repair.bufferPosition &&
                repair.code !== ParseErrorCodes.SCOPE_CODE; scope_repair.bufferPosition++)
            {
                this.scopeTrial(scope_repair, this.stateStack, this.stateStackTop);
                let j: number = (scope_repair.distance == MAX_DISTANCE
                                                        ? last_index
                                                        : scope_repair.distance),
                    k: number = scope_repair.bufferPosition - 1;
                if ((scope_repair.distance - k) > MIN_DISTANCE && (j - k) > (repair.distance - repair.numDeletions)) {
                    let i: number = this.scopeIndex[this.scopeStackTop];// upper bound
                    repair.code = ParseErrorCodes.SCOPE_CODE;
                    repair.symbol = this.scopeLhs(i) + this.NT_OFFSET;
                    repair.stackPosition = this.stateStackTop;
                    repair.bufferPosition = scope_repair.bufferPosition;
                }
            }
        }
        //
        // If a successful repair was not found, quit!  Otherwise, issue
        // diagnosis and adjust configuration...
        //
        let candidate: RepairCandidate = new RepairCandidate();
        if (repair.code == 0) {
            return candidate;
        }
        this.secondaryDiagnosis(repair);

        //
        // Update buffer based on number of elements that are deleted.
        //
        switch (repair.code) {
            case ParseErrorCodes.MISPLACED_CODE:
                candidate.location = this.buffer[2];
                candidate.symbol = this.tokStream.getKind(this.buffer[2]);
                this.tokStream.reset(this.tokStream.getNext(this.buffer[2]));
                break;
            case ParseErrorCodes.DELETION_CODE:
                candidate.location = this.buffer[repair.bufferPosition];
                candidate.symbol = this.tokStream.getKind(this.buffer[repair.bufferPosition]);
                this.tokStream.reset(this.tokStream.getNext(this.buffer[repair.bufferPosition]));
                break;
            default:// SCOPE_CODE || SECONDARY_CODE
                candidate.symbol = repair.symbol;
                candidate.location = this.buffer[repair.bufferPosition];
                this.tokStream.reset(this.buffer[repair.bufferPosition]);
                break;
        }
        return candidate;
    }

    //
    // This boolean function checks whether or not a given
    // configuration yields a better misplacement recovery than
    // the best misplacement recovery computed previously.
    //
    public misplacementRecovery(repair: SecondaryRepairInfo, stack: Int32Array, stack_top: number, last_index: number, stack_flag: boolean): void {
        let previous_loc: number = this.buffer[2],
            stack_deletions: number = 0;
        for (let top: number = stack_top - 1; top >= 0; top--) {
            if (this.locationStack[top] < previous_loc) {
                stack_deletions++;
            }
            previous_loc = this.locationStack[top];

            let parse_distance: number = this.parseCheck(stack, top, this.tokStream.getKind(this.buffer[2]), 3),
                j: number = (parse_distance == MAX_DISTANCE ? last_index : parse_distance);
            if ((parse_distance > MIN_DISTANCE) && (j - stack_deletions) > (repair.distance - repair.numDeletions)) {
                repair.stackPosition = top;
                repair.distance = j;
                repair.numDeletions = stack_deletions;
                repair.recoveryOnNextStack = stack_flag;
            }
        }
        return;
    }

    //
    // This function checks whether or not a given
    // configuration yields a better secondary recovery than the
    // best misplacement recovery computed previously.
    //
    public secondaryRecovery(repair: SecondaryRepairInfo, stack: Int32Array, stack_top: number, last_index: number, stack_flag: boolean): void {
        let previous_loc: number = this.buffer[2],
            stack_deletions: number = 0;

        for (let top: number = stack_top; top >= 0 && repair.numDeletions >= stack_deletions; top--) {
            if (this.locationStack[top] < previous_loc) {
                stack_deletions++;
            }
            previous_loc = this.locationStack[top];

            for (let i: number = 2;
                i <= (last_index - MIN_DISTANCE + 1) &&
                (repair.numDeletions >= (stack_deletions + i - 1)); i++)
            {
                let parse_distance: number = this.parseCheck(stack, top, this.tokStream.getKind(this.buffer[i]), i + 1),
                    j: number = (parse_distance == MAX_DISTANCE ? last_index : parse_distance);

                if ((parse_distance - i + 1) > MIN_DISTANCE) {

                    let k: number = stack_deletions + i - 1;
                    if ((k < repair.numDeletions) ||
                        (j - k) > (repair.distance - repair.numDeletions) ||
                        ((repair.code == ParseErrorCodes.SECONDARY_CODE) && (j - k) == (repair.distance - repair.numDeletions)))
                    {
                        repair.code = ParseErrorCodes.DELETION_CODE;
                        repair.distance = j;
                        repair.stackPosition = top;
                        repair.bufferPosition = i;
                        repair.numDeletions = k;
                        repair.recoveryOnNextStack = stack_flag;
                    }
                }
                for (let l: number = this.nasi(stack[top]); l >= 0 && this.nasr(l) != 0; l++) {
                    let symbol: number = this.nasr(l) + this.NT_OFFSET;
                    parse_distance = this.parseCheck(stack, top, symbol, i);
                    j = (parse_distance == MAX_DISTANCE ? last_index : parse_distance);

                    if ((parse_distance - i + 1) > MIN_DISTANCE)
                    {
                        let k: number = stack_deletions + i - 1;
                        if (k < repair.numDeletions || (j - k) > (repair.distance - repair.numDeletions)) {
                            repair.code = ParseErrorCodes.SECONDARY_CODE;
                            repair.symbol = symbol;
                            repair.distance = j;
                            repair.stackPosition = top;
                            repair.bufferPosition = i;
                            repair.numDeletions = k;
                            repair.recoveryOnNextStack = stack_flag;
                        }
                    }
                }
            }
        }
        return;
    }
    //
    // This procedure is invoked to issue a secondary diagnosis and
    // adjust the input buffer.  The recovery in question is either
    // an automatic scope recovery, a manual scope recovery, a
    // secondary substitution or a secondary deletion.
    //
    public secondaryDiagnosis(repair: SecondaryRepairInfo): void {
        switch (repair.code) {
            case ParseErrorCodes.SCOPE_CODE:
                if (repair.stackPosition < this.stateStackTop) {
                    this.emitError( ParseErrorCodes.DELETION_CODE,
                                    this.terminalIndex(this.ERROR_SYMBOL),
                                    this.locationStack[repair.stackPosition],
                                    this.buffer[1]);
                }
                for (let i: number = 0; i < this.scopeStackTop; i++) {
                    this.emitError(ParseErrorCodes.SCOPE_CODE,
                        -this.scopeIndex[i],
                        this.locationStack[this.scopePosition[i]],
                        this.buffer[1],
                        this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
                }

                repair.symbol = this.scopeLhs(this.scopeIndex[this.scopeStackTop]) + this.NT_OFFSET;
                this.stateStackTop = this.scopePosition[this.scopeStackTop];
                this.emitError(ParseErrorCodes.SCOPE_CODE,
                    -this.scopeIndex[this.scopeStackTop],
                    this.locationStack[this.scopePosition[this.scopeStackTop]],
                    this.buffer[1],
                    this.getNtermIndex(this.stateStack[this.stateStackTop],
                                        repair.symbol,
                                        repair.bufferPosition));
                break;
            default:
                this.emitError(repair.code,
                    (repair.code == ParseErrorCodes.SECONDARY_CODE
                                    ? this.getNtermIndex(this.stateStack[repair.stackPosition],
                                                        repair.symbol,
                                                        repair.bufferPosition)
                                    : this.terminalIndex(this.ERROR_SYMBOL)),
                    this.locationStack[repair.stackPosition],
                    this.buffer[repair.bufferPosition - 1]);
                this.stateStackTop = repair.stackPosition;
        }
        return;
    }

  
    //
    // This method is invoked by an LPG PARSER or a semantic
    // routine to process an error message.
    //

    public emitError(msg_code: number, name_index: number, left_token: number, right_token: number, scope_name_index: number=0): void {
        let left_token_loc: number = (left_token > right_token ? right_token : left_token),
            right_token_loc: number = right_token;
        
        let   token_name = (name_index >= 0 &&
            !(this.name(name_index).toUpperCase() == "ERROR")
                ? "\"" + this.name(name_index) + "\""
                : "");
        
        if (msg_code == ParseErrorCodes.INVALID_CODE) {
            msg_code = token_name.length == 0 ? ParseErrorCodes.INVALID_CODE : ParseErrorCodes.INVALID_TOKEN_CODE;
        }
        if (msg_code == ParseErrorCodes.SCOPE_CODE) {
            token_name = "\"";
            for (let i: number = this.scopeSuffix(-<number>name_index); this.scopeRhs(i) !== 0; i++) {

                if (!this.isNullable(this.scopeRhs(i))) {
                    let symbol_index: number = (this.scopeRhs(i) > this.NT_OFFSET
                                                                ? this.nonterminalIndex(this.scopeRhs(i) - this.NT_OFFSET)
                                                                : this.terminalIndex(this.scopeRhs(i)));

                    if (this.name(symbol_index).length > 0) {
                        if (token_name.length > 1) {// Not just starting quote?
                            token_name += " ";// add a space separator
                        }
                        token_name += this.name(symbol_index);
                    }
                }
            }
            token_name += "\"";
        }
        this.tokStream.reportError(msg_code, left_token, right_token, token_name);
        return;
    }
    //
    // keep looking ahead until we compute a valid action
    //
    private lookahead(act: number, token: number): number {
        act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, this.tokStream.getKind(token));
        return (act > this.LA_STATE_OFFSET
                    ? this.lookahead(act, this.tokStream.getNext(token))
                    : act);
    }
    //
    // Compute the next action defined on act and sym. If this
    // action requires more lookahead, these lookahead symbols
    // are in the token stream beginning at the next token that
    // is yielded by peek().
    //
    public tAction(act: number, sym: number): number
    {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET
                    ? this.lookahead(act, this.tokStream.peek())
                    : act);
    }
}
