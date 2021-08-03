import { ConfigurationElement } from "./ConfigurationElement";
import { ConfigurationStack } from "./ConfigurationStack";
import { IntTuple } from "./IntTuple";
import { Monitor } from "./Monitor";
import { ParseTable } from "./ParseTable";
import { TokenStream } from "./TokenStream";
import { ParseErrorCodes } from "./ParseErrorCodes"
;
import { java as Java } from "./jre";

export class RepairCandidate {
    public symbol: number;
    public location: number;
}

; export class PrimaryRepairInfo {
    public distance: number;
    public misspellIndex: number;
    public code: number;
    public bufferPosition: number;
    public symbol: number;

    constructor(clone: PrimaryRepairInfo = null) {
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
    public code: number;
    public distance: number;
    public bufferPosition: number;
    public stackPosition: number;
    public numDeletions: number;
    public symbol: number;
    public recoveryOnNextStack: boolean;
}

; export class StateInfo {
    public state: number;
    public next: number;
    constructor(state: number, next: number) {
        this.state = state;
        this.next = next;
    }
}
export class DiagnoseParser   {
    public monitor: Monitor = null;
    public tokStream: TokenStream;
    public prs: ParseTable;
    public ERROR_SYMBOL: number;
    public SCOPE_SIZE: number;
    public MAX_NAME_LENGTH: number;
    public NT_OFFSET: number;
    public LA_STATE_OFFSET: number;
    public NUM_RULES: number;
    public NUM_SYMBOLS: number;
    public START_STATE: number;
    public EOFT_SYMBOL: number;
    public EOLT_SYMBOL: number;
    public ACCEPT_ACTION: number;
    public ERROR_ACTION: number;
    public list: Int32Array;
    public maxErrors: number;
    public maxTime: number;
    public static STACK_INCREMENT: number = 256;
    public static BUFF_UBOUND: number = 31;
    public static BUFF_SIZE: number = 32;
    public static MAX_DISTANCE: number = 30;
    public static MIN_DISTANCE: number = 3;
    public stateStackTop: number;
    public stateStack: Int32Array;
    public locationStack: Int32Array;
    public tempStackTop: number;
    public tempStack: Int32Array;
    public prevStackTop: number;
    public prevStack: Int32Array;
    public nextStackTop: number;
    public nextStack: Int32Array;
    public scopeStackTop: number;
    public scopeIndex: Int32Array;
    public scopePosition: Int32Array;
    public buffer: Int32Array = new Int32Array(DiagnoseParser.BUFF_SIZE);
    public main_configuration_stack: ConfigurationStack;
    private static NIL: number = -1;
    private stateSeen: Int32Array;
    private statePoolTop: number;
    private statePool: StateInfo[];
    public setMonitor(monitor: Monitor): void {
        this.monitor = monitor;
    }
   
    constructor(tokStream: TokenStream, prs: ParseTable, maxErrors: number=0, maxTime: number=0,monitor?: Monitor) {
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
        return index > this.NT_OFFSET ? this.nonterminalIndex(index - this.NT_OFFSET) : this.terminalIndex(index);
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
    public reallocateStacks(): void {
        var old_stack_length: number = (this.stateStack == null ? 0 : this.stateStack.length), stack_length: number = old_stack_length + DiagnoseParser.STACK_INCREMENT;
        if (this.stateStack == null) {
            this.stateStack = new Int32Array(stack_length);
            this.locationStack = new Int32Array(stack_length);
            this.tempStack = new Int32Array(stack_length);
            this.prevStack = new Int32Array(stack_length);
            this.nextStack = new Int32Array(stack_length);
            this.scopeIndex = new Int32Array(stack_length);
            this.scopePosition = new Int32Array(stack_length);
        } else {
            Java.lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.tempStack, 0, this.tempStack = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.prevStack, 0, this.prevStack = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.nextStack, 0, this.nextStack = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.scopeIndex, 0, this.scopeIndex = new Int32Array(stack_length), 0, old_stack_length);
            Java.lang.System.arraycopy(this.scopePosition, 0, this.scopePosition = new Int32Array(stack_length), 0, old_stack_length);
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
        var current_token: number, current_kind: number;
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }
        var error_token: number = this.parseForError(current_kind);
        if (error_token != 0) {
            this.diagnoseEntry(marker_kind, error_token);
        }
        return;
    }
    public diagnoseEntry2(marker_kind: number, error_token: number): void {
        var action: IntTuple = new IntTuple(1 << 18);
        var startTime: number = Date.now();
        var errorCount: number = 0;
        if (this.stateStack == null) {
            this.reallocateStacks();
        }
        this.tempStackTop = 0;
        this.tempStack[this.tempStackTop] = this.START_STATE;
        this.tokStream.reset();
        var current_token: number, current_kind: number;
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }
        this.parseUpToError(action, current_kind, error_token);
        this.stateStackTop = 0;
        this.stateStack[this.stateStackTop] = this.START_STATE;
        this.tempStackTop = this.stateStackTop;
        Java.lang.System.arraycopy(this.tempStack, 0, this.stateStack, 0, this.tempStackTop + 1);
        this.tokStream.reset();
        if (marker_kind == 0) {
            current_token = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(current_token);
        } else {
            current_token = this.tokStream.peek();
            current_kind = marker_kind;
        }
        this.locationStack[this.stateStackTop] = current_token;
        var act: number;
        do {
            var prev_pos: number = -1;
            this.prevStackTop = -1;
            var next_pos: number = -1;
            this.nextStackTop = -1;
            var pos: number = this.stateStackTop;
            this.tempStackTop = this.stateStackTop - 1;
            Java.lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);
            var action_index: number = 0;
            act = action.get(action_index++);
            while (act <= this.NUM_RULES) {
                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
                if (this.tempStackTop + 1 >= this.stateStack.length) {
                    this.reallocateStacks();
                }
                pos = pos < this.tempStackTop ? pos : this.tempStackTop;
                this.tempStack[this.tempStackTop + 1] = act;
                act = action.get(action_index++);
            }
            while (act > this.ERROR_ACTION || act < this.ACCEPT_ACTION) {
                if (this.monitor != null && this.monitor.isCancelled()) {
                    return;
                }
                this.nextStackTop = this.tempStackTop + 1;
                for (var i: number = next_pos + 1; i <= this.nextStackTop; i++) {
                    this.nextStack[i] = this.tempStack[i];
                }
                for (var k: number = pos + 1; k <= this.nextStackTop; k++) {
                    this.locationStack[k] = this.locationStack[this.stateStackTop];
                }
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
                current_token = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(current_token);
                act = action.get(action_index++);
                while (act <= this.NUM_RULES) {
                    do {
                        var lhs_symbol: number = this.lhs(act);
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = (this.tempStackTop > next_pos ? this.tempStack[this.tempStackTop] : this.nextStack[this.tempStackTop]);
                        act = this.ntAction(act, lhs_symbol);
                    } while (act <= this.NUM_RULES)
                    if (this.tempStackTop + 1 >= this.stateStack.length) {
                        this.reallocateStacks();
                    }
                    next_pos = next_pos < this.tempStackTop ? next_pos : this.tempStackTop;
                    this.tempStack[this.tempStackTop + 1] = act;
                    act = action.get(action_index++);
                }
                if (act != this.ERROR_ACTION) {
                    this.prevStackTop = this.stateStackTop;
                    for (var i: number = prev_pos + 1; i <= this.prevStackTop; i++) {
                        this.prevStack[i] = this.stateStack[i];
                    }
                    prev_pos = pos;
                    this.stateStackTop = this.nextStackTop;
                    for (var k: number = pos + 1; k <= this.stateStackTop; k++) {
                        this.stateStack[k] = this.nextStack[k];
                    }
                    this.locationStack[this.stateStackTop] = current_token;
                    pos = next_pos;
                }
            }
            if (act == this.ERROR_ACTION) {
                errorCount += 1;
                if (errorCount > 1) {
                    if (this.maxErrors > 0 && errorCount > this.maxErrors) {
                        break;
                    }
                    if (this.maxTime > 0 && Date.now() - startTime > this.maxTime) {
                        break;
                    }
                }
                var candidate: RepairCandidate = this.errorRecovery(current_token);
                if (this.monitor != null && this.monitor.isCancelled()) {
                    return;
                }
                act = this.stateStack[this.stateStackTop];
                if (candidate.symbol == 0) {
                    break;
                } else {
                    if (candidate.symbol > this.NT_OFFSET) {
                        var lhs_symbol: number = candidate.symbol - this.NT_OFFSET;
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
                var next_token: number = this.tokStream.peek();
                this.tempStackTop = this.stateStackTop;
                Java.lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);
                error_token = this.parseForError(current_kind);
                if (error_token != 0) {
                    this.tokStream.reset(next_token);
                    this.tempStackTop = this.stateStackTop;
                    Java.lang.System.arraycopy(this.stateStack, 0, this.tempStack, 0, this.stateStackTop + 1);
                    this.parseUpToError(action, current_kind, error_token);
                    this.tokStream.reset(next_token);
                } else {
                    act = this.ACCEPT_ACTION;
                }
            }
        } while (act != this.ACCEPT_ACTION)
        return;
    }
    public parseForError(current_kind: number): number {
        var error_token: number = 0;
        var curtok: number = this.tokStream.getPrevious(this.tokStream.peek()), act: number = this.tAction(this.tempStack[this.tempStackTop], current_kind);
        var configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);
        for (; ;) {
            if (act <= this.NUM_RULES) {
                this.tempStackTop--;
                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
            } else {
                if (act > this.ERROR_ACTION) {
                    curtok = this.tokStream.getToken();
                    current_kind = this.tokStream.getKind(curtok);
                    act -= this.ERROR_ACTION;
                    do {
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                    } while (act <= this.NUM_RULES)
                } else {
                    if (act < this.ACCEPT_ACTION) {
                        curtok = this.tokStream.getToken();
                        current_kind = this.tokStream.getKind(curtok);
                    } else {
                        if (act == this.ERROR_ACTION) {
                            error_token = (error_token > curtok ? error_token : curtok);
                            var configuration: ConfigurationElement = configuration_stack.pop();
                            if (configuration == null) {
                                act = this.ERROR_ACTION;
                            } else {
                                this.tempStackTop = configuration.stack_top;
                                configuration.retrieveStack(this.tempStack);
                                act = configuration.act;
                                curtok = configuration.curtok;
                                current_kind = this.tokStream.getKind(curtok);
                                this.tokStream.reset(this.tokStream.getNext(curtok));
                                continue;
                            }
                            break;
                        } else {
                            if (act > this.ACCEPT_ACTION) {
                                if (configuration_stack.findConfiguration(this.tempStack, this.tempStackTop, curtok)) {
                                    act = this.ERROR_ACTION;
                                } else {
                                    configuration_stack.push(this.tempStack, this.tempStackTop, act + 1, curtok, 0);
                                    act = this.baseAction(act);
                                }
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            try {
                this.tempStack[++this.tempStackTop] = act;
            } catch ($ex$) {
                if ($ex$ instanceof Error) {
                    var e: Error = <Error>$ex$;
                    this.reallocateStacks();
                    this.tempStack[this.tempStackTop] = act;
                } else {
                    throw $ex$;
                }
            }
            act = this.tAction(act, current_kind);
        }
        return (act == this.ERROR_ACTION ? error_token : 0);
    }
    public parseUpToError(action: IntTuple, current_kind: number, error_token: number): void {
        var curtok: number = this.tokStream.getPrevious(this.tokStream.peek());
        var act: number = this.tAction(this.tempStack[this.tempStackTop], current_kind);
        var configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);
        action.reset();
        for (; ;) {
            if (act <= this.NUM_RULES) {
                action.add(act);
                this.tempStackTop--;
                do {
                    this.tempStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
            } else {
                if (act > this.ERROR_ACTION) {
                    action.add(act);
                    curtok = this.tokStream.getToken();
                    current_kind = this.tokStream.getKind(curtok);
                    act -= this.ERROR_ACTION;
                    do {
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = this.ntAction(this.tempStack[this.tempStackTop], this.lhs(act));
                    } while (act <= this.NUM_RULES)
                } else {
                    if (act < this.ACCEPT_ACTION) {
                        action.add(act);
                        curtok = this.tokStream.getToken();
                        current_kind = this.tokStream.getKind(curtok);
                    } else {
                        if (act == this.ERROR_ACTION) {
                            if (curtok != error_token) {
                                var configuration: ConfigurationElement = configuration_stack.pop();
                                if (configuration == null) {
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
                        } else {
                            if (act > this.ACCEPT_ACTION) {
                                if (configuration_stack.findConfiguration(this.tempStack, this.tempStackTop, curtok)) {
                                    act = this.ERROR_ACTION;
                                } else {
                                    configuration_stack.push(this.tempStack, this.tempStackTop, act + 1, curtok, action.size());
                                    act = this.baseAction(act);
                                }
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            try {
                this.tempStack[++this.tempStackTop] = act;
            } catch ($ex$) {
                if ($ex$ instanceof Error) {
                    var e: Error = <Error>$ex$;
                    this.reallocateStacks();
                    this.tempStack[this.tempStackTop] = act;
                } else {
                    throw $ex$;
                }
            }
            act = this.tAction(act, current_kind);
        }
        action.add(this.ERROR_ACTION);
        return;
    }
    public parseCheck(stack: Int32Array, stack_top: number, first_symbol: number, buffer_position: number): number {
        var buffer_index: number, current_kind: number;
        var local_stack: Int32Array = new Int32Array(stack.length);
        var local_stack_top: number = stack_top;
        for (var i: number = 0; i <= stack_top; i++) {
            local_stack[i] = stack[i];
        }
        var configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);
        var act: number = local_stack[local_stack_top];
        if (first_symbol > this.NT_OFFSET) {
            var lhs_symbol: number = first_symbol - this.NT_OFFSET;
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
        if (++local_stack_top >= local_stack.length) {
            return buffer_index;
        }
        local_stack[local_stack_top] = act;
        act = this.tAction(act, current_kind);
        for (; ;) {
            if (act <= this.NUM_RULES) {
                local_stack_top -= this.rhs(act);
                act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                while (act <= this.NUM_RULES) {
                    local_stack_top -= (this.rhs(act) - 1);
                    act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                }
            } else {
                if (act > this.ERROR_ACTION) {
                    if (buffer_index++ == DiagnoseParser.MAX_DISTANCE) {
                        break;
                    }
                    current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                    this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
                    act -= this.ERROR_ACTION;
                    do {
                        local_stack_top -= (this.rhs(act) - 1);
                        act = this.ntAction(local_stack[local_stack_top], this.lhs(act));
                    } while (act <= this.NUM_RULES)
                } else {
                    if (act < this.ACCEPT_ACTION) {
                        if (buffer_index++ == DiagnoseParser.MAX_DISTANCE) {
                            break;
                        }
                        current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                        this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
                    } else {
                        if (act == this.ERROR_ACTION) {
                            var configuration: ConfigurationElement = configuration_stack.pop();
                            if (configuration == null) {
                                act = this.ERROR_ACTION;
                            } else {
                                local_stack_top = configuration.stack_top;
                                configuration.retrieveStack(local_stack);
                                act = configuration.act;
                                buffer_index = configuration.curtok;
                                current_kind = this.tokStream.getKind(this.buffer[buffer_index]);
                                this.tokStream.reset(this.tokStream.getNext(this.buffer[buffer_index]));
                                continue;
                            }
                            break;
                        } else {
                            if (act > this.ACCEPT_ACTION) {
                                if (configuration_stack.findConfiguration(local_stack, local_stack_top, buffer_index)) {
                                    act = this.ERROR_ACTION;
                                } else {
                                    configuration_stack.push(local_stack, local_stack_top, act + 1, buffer_index, 0);
                                    act = this.baseAction(act);
                                }
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            if (++local_stack_top >= local_stack.length) {
                break;
            }
            local_stack[local_stack_top] = act;
            act = this.tAction(act, current_kind);
        }
        return (act == this.ACCEPT_ACTION ? DiagnoseParser.MAX_DISTANCE : buffer_index);
    }
    public errorRecovery(error_token: number): RepairCandidate {
        var prevtok: number = this.tokStream.getPrevious(error_token);
        var candidate: RepairCandidate = this.primaryPhase(error_token);
        if (candidate.symbol != 0) {
            return candidate;
        }
        candidate = this.secondaryPhase(error_token);
        if (candidate.symbol != 0) {
            return candidate;
        }
        if (this.tokStream.getKind(error_token) != this.EOFT_SYMBOL) {
            while (this.tokStream.getKind(this.buffer[DiagnoseParser.BUFF_UBOUND]) != this.EOFT_SYMBOL) {
                candidate = this.secondaryPhase(this.buffer[DiagnoseParser.MAX_DISTANCE - DiagnoseParser.MIN_DISTANCE + 2]);
                if (candidate.symbol != 0) {
                    return candidate;
                }
            }
        }
        var scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        scope_repair.bufferPosition = DiagnoseParser.BUFF_UBOUND;
        for (var top: number = this.stateStackTop; top >= 0; top--) {
            this.scopeTrial(scope_repair, this.stateStack, top);
            if (scope_repair.distance > 0) {
                break;
            }
        }
        for (var i: number = 0; i < this.scopeStackTop; i++) {
            this.emitError(ParseErrorCodes.SCOPE_CODE, -this.scopeIndex[i], this.locationStack[this.scopePosition[i]], this.buffer[1], this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
        }
        if (this.tokStream.getKind(error_token) == this.EOFT_SYMBOL) {
            this.emitError(ParseErrorCodes.EOF_CODE, this.terminalIndex(this.EOFT_SYMBOL), prevtok, prevtok);
        } else {
            var i: number;
            for (i = DiagnoseParser.BUFF_UBOUND; this.tokStream.getKind(this.buffer[i]) == this.EOFT_SYMBOL; i--) {
            }
            this.emitError(ParseErrorCodes.DELETION_CODE, this.terminalIndex(this.tokStream.getKind(error_token)), error_token, this.buffer[i]);
        }
        candidate.symbol = 0;
        candidate.location = this.buffer[DiagnoseParser.BUFF_UBOUND];
        return candidate;
    }
    public primaryPhase(error_token: number): RepairCandidate {
        var i: number = (this.nextStackTop >= 0 ? 3 : 2);
        this.buffer[i] = error_token;
        for (var j: number = i; j > 0; j--) {
            this.buffer[j - 1] = this.tokStream.getPrevious(this.buffer[j]);
        }
        for (var k: number = i + 1; k < DiagnoseParser.BUFF_SIZE; k++) {
            this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
        }
        var repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        if (this.nextStackTop >= 0) {
            repair.bufferPosition = 3;
            this.checkPrimaryDistance(repair, this.nextStack, this.nextStackTop);
        }
        var base_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
        base_repair.bufferPosition = 2;
        this.checkPrimaryDistance(base_repair, this.stateStack, this.stateStackTop);
        if (base_repair.distance > repair.distance || base_repair.misspellIndex > repair.misspellIndex) {
            repair = base_repair;
        }
        if (this.prevStackTop >= 0) {
            var prev_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
            prev_repair.bufferPosition = 1;
            this.checkPrimaryDistance(prev_repair, this.prevStack, this.prevStackTop);
            if (prev_repair.distance > repair.distance || prev_repair.misspellIndex > repair.misspellIndex) {
                repair = prev_repair;
            }
        }
        var candidate: RepairCandidate = new RepairCandidate();
        if (this.nextStackTop >= 0) {
            if (this.secondaryCheck(this.nextStack, this.nextStackTop, 3, repair.distance)) {
                return candidate;
            }
        } else {
            if (this.secondaryCheck(this.stateStack, this.stateStackTop, 2, repair.distance)) {
                return candidate;
            }
        }
        repair.distance = repair.distance - repair.bufferPosition + 1;
        if (repair.code == ParseErrorCodes.INVALID_CODE || repair.code == ParseErrorCodes.DELETION_CODE || repair.code == ParseErrorCodes.SUBSTITUTION_CODE || repair.code == ParseErrorCodes.MERGE_CODE) {
            repair.distance--;
        }
        if (repair.distance < DiagnoseParser.MIN_DISTANCE) {
            return candidate;
        }
        if (repair.code == ParseErrorCodes.INSERTION_CODE) {
            if (this.tokStream.getKind(this.buffer[repair.bufferPosition - 1]) == 0) {
                repair.code = ParseErrorCodes.BEFORE_CODE;
            }
        }
        if (repair.bufferPosition == 1) {
            this.stateStackTop = this.prevStackTop;
            Java.lang.System.arraycopy(this.prevStack, 0, this.stateStack, 0, this.stateStackTop + 1);
        } else {
            if (this.nextStackTop >= 0 && repair.bufferPosition >= 3) {
                this.stateStackTop = this.nextStackTop;
                Java.lang.System.arraycopy(this.nextStack, 0, this.stateStack, 0, this.stateStackTop + 1);
                this.locationStack[this.stateStackTop] = this.buffer[3];
            }
        }
        return this.primaryDiagnosis(repair);
    }
    public mergeCandidate(state: number, buffer_position: number): number {
        var str: string = this.tokStream.getName(this.buffer[buffer_position]) + this.tokStream.getName(this.buffer[buffer_position + 1]);
        for (var k: number = this.asi(state); this.asr(k) != 0; k++) {
            var i: number = this.terminalIndex(this.asr(k));
            if (str.length == this.name(i).length) {
                if (str.toLowerCase()===(this.name(i).toLowerCase())) {
                    return this.asr(k);
                }
            }
        }
        return 0;
    }
    public checkPrimaryDistance(repair: PrimaryRepairInfo, stck: Int32Array, stack_top: number): void {
        var scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo(repair);
        this.scopeTrial(scope_repair, stck, stack_top);
        if (scope_repair.distance > repair.distance) {
            repair.copy(scope_repair);
        }
        var symbol: number = this.mergeCandidate(stck[stack_top], repair.bufferPosition);
        if (symbol != 0) {
            var j: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 2);
            if ((j > repair.distance) || (j == repair.distance && repair.misspellIndex < 10)) {
                repair.misspellIndex = 10;
                repair.symbol = symbol;
                repair.distance = j;
                repair.code = ParseErrorCodes.MERGE_CODE;
            }
        }
        var j: number = this.parseCheck(stck, stack_top, this.tokStream.getKind(this.buffer[repair.bufferPosition + 1]), repair.bufferPosition + 2);
        var k: number = (this.tokStream.getKind(this.buffer[repair.bufferPosition]) == this.EOLT_SYMBOL && this.tokStream.afterEol(this.buffer[repair.bufferPosition + 1]) ? 10 : 0);
        if (j > repair.distance || (j == repair.distance && k > repair.misspellIndex)) {
            repair.misspellIndex = k;
            repair.code = ParseErrorCodes.DELETION_CODE;
            repair.distance = j;
        }
        var next_state: number = stck[stack_top], max_pos: number = stack_top;
        this.tempStackTop = stack_top - 1;
        this.tokStream.reset(this.buffer[repair.bufferPosition + 1]);
        var tok: number = this.tokStream.getKind(this.buffer[repair.bufferPosition]), act: number = this.tAction(next_state, tok);
        while (act <= this.NUM_RULES) {
            do {
                var lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);
                act = (this.tempStackTop > max_pos ? this.tempStack[this.tempStackTop] : stck[this.tempStackTop]);
                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)
            max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
            this.tempStack[this.tempStackTop + 1] = act;
            next_state = act;
            act = this.tAction(next_state, tok);
        }
        var root: number = 0;
        for (var i: number = this.asi(next_state); this.asr(i) != 0; i++) {
            symbol = this.asr(i);
            if (symbol != this.EOFT_SYMBOL && symbol != this.ERROR_SYMBOL) {
                if (root == 0) {
                    this.list[symbol] = symbol;
                } else {
                    this.list[symbol] = this.list[root];
                    this.list[root] = symbol;
                }
                root = symbol;
            }
        }
        if (stck[stack_top] != next_state) {
            for (var i: number = this.asi(stck[stack_top]); this.asr(i) != 0; i++) {
                symbol = this.asr(i);
                if (symbol != this.EOFT_SYMBOL && symbol != this.ERROR_SYMBOL && this.list[symbol] == 0) {
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
        var head: number = this.list[root];
        this.list[root] = 0;
        root = head;
        symbol = root;
        while (symbol != 0) {
            var m: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition), n: number = (symbol == this.EOLT_SYMBOL && this.tokStream.afterEol(this.buffer[repair.bufferPosition]) ? 10 : 0);
            if (m > repair.distance || (m == repair.distance && n > repair.misspellIndex)) {
                repair.misspellIndex = n;
                repair.distance = m;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INSERTION_CODE;
            }
            symbol = this.list[symbol];
        }
        symbol = root;
        while (symbol != 0) {
            var m: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 1), n: number = (symbol == this.EOLT_SYMBOL && this.tokStream.afterEol(this.buffer[repair.bufferPosition + 1]) ? 10 : this.misspell(symbol, this.buffer[repair.bufferPosition]));
            if (m > repair.distance || (m == repair.distance && n > repair.misspellIndex)) {
                repair.misspellIndex = n;
                repair.distance = m;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.SUBSTITUTION_CODE;
            }
            var s: number = symbol;
            symbol = this.list[symbol];
            this.list[s] = 0;
        }
        for (var nt_index: number = this.nasi(stck[stack_top]); this.nasr(nt_index) != 0; nt_index++) {
            symbol = this.nasr(nt_index) + this.NT_OFFSET;
            var n: number = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition + 1);
            if (n > repair.distance) {
                repair.misspellIndex = 0;
                repair.distance = n;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INVALID_CODE;
            }
            n = this.parseCheck(stck, stack_top, symbol, repair.bufferPosition);
            if (n > repair.distance || (n == repair.distance && repair.code == ParseErrorCodes.INVALID_CODE)) {
                repair.misspellIndex = 0;
                repair.distance = n;
                repair.symbol = symbol;
                repair.code = ParseErrorCodes.INSERTION_CODE;
            }
        }
        return;
    }
    public primaryDiagnosis(repair: PrimaryRepairInfo): RepairCandidate {
        var prevtok: number = this.buffer[repair.bufferPosition - 1], current_token: number = this.buffer[repair.bufferPosition];
        switch (repair.code) {
            case ParseErrorCodes.INSERTION_CODE:
            case ParseErrorCodes.BEFORE_CODE:
                var name_index: number = (repair.symbol > this.NT_OFFSET ? this.getNtermIndex(this.stateStack[this.stateStackTop], repair.symbol, repair.bufferPosition) : this.getTermIndex(this.stateStack, this.stateStackTop, repair.symbol, repair.bufferPosition));
                var tok: number = (repair.code == ParseErrorCodes.INSERTION_CODE ? prevtok : current_token);
                this.emitError(repair.code, name_index, tok, tok);
                break;
            case ParseErrorCodes.INVALID_CODE:
                var name_index: number = this.getNtermIndex(this.stateStack[this.stateStackTop], repair.symbol, repair.bufferPosition + 1);
                this.emitError(repair.code, name_index, current_token, current_token);
                break;
            case ParseErrorCodes.SUBSTITUTION_CODE:
                var name_index: number;
                if (repair.misspellIndex >= 6) {
                    name_index = this.terminalIndex(repair.symbol);
                } else {
                    name_index = this.getTermIndex(this.stateStack, this.stateStackTop, repair.symbol, repair.bufferPosition + 1);
                    if (name_index != this.terminalIndex(repair.symbol)) {
                        repair.code = ParseErrorCodes.INVALID_CODE;
                    }
                }
                this.emitError(repair.code, name_index, current_token, current_token);
                break;
            case ParseErrorCodes.MERGE_CODE:
                this.emitError(repair.code, this.terminalIndex(repair.symbol), current_token, this.tokStream.getNext(current_token));
                break;
            case ParseErrorCodes.SCOPE_CODE:
                for (var i: number = 0; i < this.scopeStackTop; i++) {
                    this.emitError(repair.code, -this.scopeIndex[i], this.locationStack[this.scopePosition[i]], prevtok, this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
                }
                repair.symbol = this.scopeLhs(this.scopeIndex[this.scopeStackTop]) + this.NT_OFFSET;
                this.stateStackTop = this.scopePosition[this.scopeStackTop];
                this.emitError(repair.code, -this.scopeIndex[this.scopeStackTop], this.locationStack[this.scopePosition[this.scopeStackTop]], prevtok, this.getNtermIndex(this.stateStack[this.stateStackTop], repair.symbol, repair.bufferPosition));
                break;
            default:
                this.emitError(repair.code, this.terminalIndex(this.ERROR_SYMBOL), current_token, current_token);
        }
        var candidate: RepairCandidate = new RepairCandidate();
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
            default:
                candidate.location = this.buffer[repair.bufferPosition + 1];
                candidate.symbol = this.tokStream.getKind(this.buffer[repair.bufferPosition + 1]);
                this.tokStream.reset(this.buffer[repair.bufferPosition + 2]);
                break;
        }
        return candidate;
    }
    public getTermIndex(stck: Int32Array, stack_top: number, tok: number, buffer_position: number): number {
        var act: number = stck[stack_top], max_pos: number = stack_top, highest_symbol: number = tok;
        this.tempStackTop = stack_top - 1;
        this.tokStream.reset(this.buffer[buffer_position]);
        act = this.tAction(act, tok);
        while (act <= this.NUM_RULES) {
            do {
                var lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);
                act = (this.tempStackTop > max_pos ? this.tempStack[this.tempStackTop] : stck[this.tempStackTop]);
                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)
            max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }
        this.tempStackTop++;
        var threshold: number = this.tempStackTop;
        tok = this.tokStream.getKind(this.buffer[buffer_position]);
        this.tokStream.reset(this.buffer[buffer_position + 1]);
        if (act > this.ERROR_ACTION) {
            act -= this.ERROR_ACTION;
        } else {
            if (act < this.ACCEPT_ACTION) {
                this.tempStack[this.tempStackTop + 1] = act;
                act = this.tAction(act, tok);
            }
        }
        while (act <= this.NUM_RULES) {
            do {
                var lhs_symbol: number = this.lhs(act);
                this.tempStackTop -= (this.rhs(act) - 1);
                if (this.tempStackTop < threshold) {
                    return (highest_symbol > this.NT_OFFSET ? this.nonterminalIndex(highest_symbol - this.NT_OFFSET) : this.terminalIndex(highest_symbol));
                }
                if (this.tempStackTop == threshold) {
                    highest_symbol = lhs_symbol + this.NT_OFFSET;
                }
                act = (this.tempStackTop > max_pos ? this.tempStack[this.tempStackTop] : stck[this.tempStackTop]);
                act = this.ntAction(act, lhs_symbol);
            } while (act <= this.NUM_RULES)
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }
        return (highest_symbol > this.NT_OFFSET ? this.nonterminalIndex(highest_symbol - this.NT_OFFSET) : this.terminalIndex(highest_symbol));
    }
    public getNtermIndex(start: number, sym: number, buffer_position: number): number {
        var highest_symbol: number = sym - this.NT_OFFSET, tok: number = this.tokStream.getKind(this.buffer[buffer_position]);
        this.tokStream.reset(this.buffer[buffer_position + 1]);
        this.tempStackTop = 0;
        this.tempStack[this.tempStackTop] = start;
        var act: number = this.ntAction(start, highest_symbol);
        if (act > this.NUM_RULES) {
            this.tempStack[this.tempStackTop + 1] = act;
            act = this.tAction(act, tok);
        }
        while (act <= this.NUM_RULES) {
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
    public misspell(sym: number, tok: number): number {
        var s1: string = (this.name(this.terminalIndex(sym))).toLowerCase();
        var n: number = s1.length;
        s1 += '\u0000';
        var s2: string = (this.tokStream.getName(tok)).toLowerCase();
        var m: number = (s2.length < this.MAX_NAME_LENGTH ? s2.length : this.MAX_NAME_LENGTH);
        s2 = s2.substring(0, m) + '\u0000';
        if (n == 1 && m == 1) {
            if ((s1.charAt(0) == ';' && s2.charAt(0) == ',') || (s1.charAt(0) == ',' && s2.charAt(0) == ';') || (s1.charAt(0) == ';' && s2.charAt(0) == ':') || (s1.charAt(0) == ':' && s2.charAt(0) == ';') || (s1.charAt(0) == '.' && s2.charAt(0) == ',') || (s1.charAt(0) == ',' && s2.charAt(0) == '.') || (s1.charAt(0) == '\'' && s2.charAt(0) == '\"') || (s1.charAt(0) == '\"' && s2.charAt(0) == '\'')) {
                return 3;
            }
        }
        var count: number = 0, prefix_length: number = 0, num_errors: number = 0;
        var i: number = 0, j: number = 0;
        while ((i < n) && (j < m)) {
            if (s1.charAt(i) == s2.charAt(j)) {
                count++;
                i++;
                j++;
                if (num_errors == 0) {
                    prefix_length++;
                }
            } else {
                if (s1.charAt(i + 1) == s2.charAt(j) && s1.charAt(i) == s2.charAt(j + 1)) {
                    count += 2;
                    i += 2;
                    j += 2;
                    num_errors++;
                } else {
                    if (s1.charAt(i + 1) == s2.charAt(j + 1)) {
                        i += 2;
                        j += 2;
                        num_errors++;
                    } else {
                        if ((n - i) > (m - j)) {
                            i++;
                        } else {
                            if ((m - j) > (n - i)) {
                                j++;
                            } else {
                                i++;
                                j++;
                            }
                        }
                        num_errors++;
                    }
                }
            }
        }
        if (i < n || j < m) {
            num_errors++;
        }
        if (num_errors > ((n < m ? n : m) / 6 + 1)) {
            count = prefix_length;
        }
        return (count * 10 / ((n < s1.length ? s1.length : n) + num_errors));
    }
    public scopeTrial(repair: PrimaryRepairInfo, stack: Int32Array, stack_top: number): void {
        if (this.stateSeen == null || this.stateSeen.length < this.stateStack.length) {
            this.stateSeen = new Int32Array(this.stateStack.length);
        }
        for (var i: number = 0; i < this.stateStack.length; i++) {
            this.stateSeen[i] = DiagnoseParser.NIL;
        }
        this.statePoolTop = 0;
        if (this.statePool == null || this.statePool.length < this.stateStack.length) {
            this.statePool = new Array<StateInfo>(this.stateStack.length);
        }
        this.scopeTrialCheck(repair, stack, stack_top, 0);
        repair.code = ParseErrorCodes.SCOPE_CODE;
        repair.misspellIndex = 10;
        return;
    }
    public scopeTrialCheck(repair: PrimaryRepairInfo, stack: Int32Array, stack_top: number, indx: number): void {
        for (var i: number = this.stateSeen[stack_top]; i != DiagnoseParser.NIL; i = this.statePool[i].next) {
            if (this.statePool[i].state == stack[stack_top]) {
                return;
            }
        }
        var old_state_pool_top: number = this.statePoolTop++;
        if (this.statePoolTop >= this.statePool.length) {
            Java.lang.System.arraycopy(this.statePool, 0, this.statePool = new Array<StateInfo>(this.statePoolTop * 2), 0, this.statePoolTop);
        }
        this.statePool[old_state_pool_top] = new StateInfo(stack[stack_top], this.stateSeen[stack_top]);
        this.stateSeen[stack_top] = old_state_pool_top;
        var action: IntTuple = new IntTuple(1 << 3);
        for (var i: number = 0; i < this.SCOPE_SIZE; i++) {
            action.reset();
            var act: number = this.tAction(stack[stack_top], this.scopeLa(i));
            if (act > this.ACCEPT_ACTION && act < this.ERROR_ACTION) {
                do {
                    action.add(this.baseAction(act++));
                } while (this.baseAction(act) != 0)
            } else {
                action.add(act);
            }
            for (var action_index: number = 0; action_index < action.size(); action_index++) {
                this.tokStream.reset(this.buffer[repair.bufferPosition]);
                this.tempStackTop = stack_top - 1;
                var max_pos: number = stack_top;
                act = action.get(action_index);
                while (act <= this.NUM_RULES) {
                    do {
                        var lhs_symbol: number = this.lhs(act);
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = (this.tempStackTop > max_pos ? this.tempStack[this.tempStackTop] : stack[this.tempStackTop]);
                        act = this.ntAction(act, lhs_symbol);
                    } while (act <= this.NUM_RULES)
                    if (this.tempStackTop + 1 >= this.stateStack.length) {
                        return;
                    }
                    max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
                    this.tempStack[this.tempStackTop + 1] = act;
                    act = this.tAction(act, this.scopeLa(i));
                }
                if (act != this.ERROR_ACTION) {
                    var j: number, k: number = this.scopePrefix(i);
                    for (j = this.tempStackTop + 1; j >= (max_pos + 1) && this.inSymbol(this.tempStack[j]) == this.scopeRhs(k); j--) {
                        k++;
                    }
                    if (j == max_pos) {
                        for (j = max_pos; j >= 1 && this.inSymbol(stack[j]) == this.scopeRhs(k); j--) {
                            k++;
                        }
                    }
                    var marked_pos: number = (max_pos < stack_top ? max_pos + 1 : stack_top);
                    if (this.scopeRhs(k) == 0 && j < marked_pos) {
                        var stack_position: number = j;
                        for (j = this.scopeStateSet(i); stack[stack_position] != this.scopeState(j) && this.scopeState(j) != 0; j++) {
                        }
                        if (this.scopeState(j) != 0) {
                            var previous_distance: number = repair.distance, distance: number = this.parseCheck(stack, stack_position, this.scopeLhs(i) + this.NT_OFFSET, repair.bufferPosition);
                            if ((distance - repair.bufferPosition + 1) < DiagnoseParser.MIN_DISTANCE) {
                                var top: number = stack_position;
                                act = this.ntAction(stack[top], this.scopeLhs(i));
                                while (act <= this.NUM_RULES) {
                                    top -= (this.rhs(act) - 1);
                                    act = this.ntAction(stack[top], this.lhs(act));
                                }
                                top++;
                                j = act;
                                act = stack[top];
                                stack[top] = j;
                                this.scopeTrialCheck(repair, stack, top, indx + 1);
                                stack[top] = act;
                            } else {
                                if (distance > repair.distance) {
                                    this.scopeStackTop = indx;
                                    repair.distance = distance;
                                }
                            }
                            if (this.tokStream.getKind(this.buffer[repair.bufferPosition]) == this.EOFT_SYMBOL && repair.distance == previous_distance) {
                                this.scopeStackTop = indx;
                                repair.distance = DiagnoseParser.MAX_DISTANCE;
                            }
                            if (repair.distance > previous_distance) {
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
    public secondaryCheck(stack: Int32Array, stack_top: number, buffer_position: number, distance: number): boolean {
        for (var top: number = stack_top - 1; top >= 0; top--) {
            var j: number = this.parseCheck(stack, top, this.tokStream.getKind(this.buffer[buffer_position]), buffer_position + 1);
            if (((j - buffer_position + 1) > DiagnoseParser.MIN_DISTANCE) && (j > distance)) {
                return true;
            }
        }
        var scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
        scope_repair.bufferPosition = buffer_position + 1;
        scope_repair.distance = distance;
        this.scopeTrial(scope_repair, stack, stack_top);
        return ((scope_repair.distance - buffer_position) > DiagnoseParser.MIN_DISTANCE && scope_repair.distance > distance);
    }
    public secondaryPhase(error_token: number): RepairCandidate {
        var repair: SecondaryRepairInfo = new SecondaryRepairInfo(), misplaced_repair: SecondaryRepairInfo = new SecondaryRepairInfo();
        var next_last_index: number = 0;
        if (this.nextStackTop >= 0) {
            var save_location: number;
            this.buffer[2] = error_token;
            this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
            this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);
            for (var k: number = 3; k < DiagnoseParser.BUFF_UBOUND; k++) {
                this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
            }
            this.buffer[DiagnoseParser.BUFF_UBOUND] = this.tokStream.badToken();
            for (next_last_index = DiagnoseParser.MAX_DISTANCE - 1; next_last_index >= 1 && this.tokStream.getKind(this.buffer[next_last_index]) == this.EOFT_SYMBOL; next_last_index--) {
            }
            next_last_index = next_last_index + 1;
            save_location = this.locationStack[this.nextStackTop];
            this.locationStack[this.nextStackTop] = this.buffer[2];
            misplaced_repair.numDeletions = this.nextStackTop;
            this.misplacementRecovery(misplaced_repair, this.nextStack, this.nextStackTop, next_last_index, true);
            if (misplaced_repair.recoveryOnNextStack) {
                misplaced_repair.distance++;
            }
            repair.numDeletions = this.nextStackTop + DiagnoseParser.BUFF_UBOUND;
            this.secondaryRecovery(repair, this.nextStack, this.nextStackTop, next_last_index, true);
            if (repair.recoveryOnNextStack) {
                repair.distance++;
            }
            this.locationStack[this.nextStackTop] = save_location;
        } else {
            misplaced_repair.numDeletions = this.stateStackTop;
            repair.numDeletions = this.stateStackTop + DiagnoseParser.BUFF_UBOUND;
        }
        this.buffer[3] = error_token;
        this.buffer[2] = this.tokStream.getPrevious(this.buffer[3]);
        this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
        this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);
        for (var k: number = 4; k < DiagnoseParser.BUFF_SIZE; k++) {
            this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
        }
        var last_index: number;
        for (last_index = DiagnoseParser.MAX_DISTANCE - 1; last_index >= 1 && this.tokStream.getKind(this.buffer[last_index]) == this.EOFT_SYMBOL; last_index--) {
        }
        last_index++;
        this.misplacementRecovery(misplaced_repair, this.stateStack, this.stateStackTop, last_index, false);
        this.secondaryRecovery(repair, this.stateStack, this.stateStackTop, last_index, false);
        if (misplaced_repair.distance > DiagnoseParser.MIN_DISTANCE) {
            if (misplaced_repair.numDeletions <= repair.numDeletions || (misplaced_repair.distance - misplaced_repair.numDeletions) >= (repair.distance - repair.numDeletions)) {
                repair.code = ParseErrorCodes.MISPLACED_CODE;
                repair.stackPosition = misplaced_repair.stackPosition;
                repair.bufferPosition = 2;
                repair.numDeletions = misplaced_repair.numDeletions;
                repair.distance = misplaced_repair.distance;
                repair.recoveryOnNextStack = misplaced_repair.recoveryOnNextStack;
            }
        }
        if (repair.recoveryOnNextStack) {
            this.stateStackTop = this.nextStackTop;
            Java.lang.System.arraycopy(this.nextStack, 0, this.stateStack, 0, this.stateStackTop + 1);
            this.buffer[2] = error_token;
            this.buffer[1] = this.tokStream.getPrevious(this.buffer[2]);
            this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);
            for (var k: number = 3; k < DiagnoseParser.BUFF_UBOUND; k++) {
                this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
            }
            this.buffer[DiagnoseParser.BUFF_UBOUND] = this.tokStream.badToken();
            this.locationStack[this.nextStackTop] = this.buffer[2];
            last_index = next_last_index;
        }
        if (repair.code == ParseErrorCodes.SECONDARY_CODE || repair.code == ParseErrorCodes.DELETION_CODE) {
            var scope_repair: PrimaryRepairInfo = new PrimaryRepairInfo();
            for (scope_repair.bufferPosition = 2; scope_repair.bufferPosition <= repair.bufferPosition && repair.code != ParseErrorCodes.SCOPE_CODE; scope_repair.bufferPosition++) {
                this.scopeTrial(scope_repair, this.stateStack, this.stateStackTop);
                var j: number = (scope_repair.distance == DiagnoseParser.MAX_DISTANCE ? last_index : scope_repair.distance), k: number = scope_repair.bufferPosition - 1;
                if ((scope_repair.distance - k) > DiagnoseParser.MIN_DISTANCE && (j - k) > (repair.distance - repair.numDeletions)) {
                    var i: number = this.scopeIndex[this.scopeStackTop];
                    repair.code = ParseErrorCodes.SCOPE_CODE;
                    repair.symbol = this.scopeLhs(i) + this.NT_OFFSET;
                    repair.stackPosition = this.stateStackTop;
                    repair.bufferPosition = scope_repair.bufferPosition;
                }
            }
        }
        var candidate: RepairCandidate = new RepairCandidate();
        if (repair.code == 0) {
            return candidate;
        }
        this.secondaryDiagnosis(repair);
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
            default:
                candidate.symbol = repair.symbol;
                candidate.location = this.buffer[repair.bufferPosition];
                this.tokStream.reset(this.buffer[repair.bufferPosition]);
                break;
        }
        return candidate;
    }
    public misplacementRecovery(repair: SecondaryRepairInfo, stack: Int32Array, stack_top: number, last_index: number, stack_flag: boolean): void {
        var previous_loc: number = this.buffer[2], stack_deletions: number = 0;
        for (var top: number = stack_top - 1; top >= 0; top--) {
            if (this.locationStack[top] < previous_loc) {
                stack_deletions++;
            }
            previous_loc = this.locationStack[top];
            var parse_distance: number = this.parseCheck(stack, top, this.tokStream.getKind(this.buffer[2]), 3), j: number = (parse_distance == DiagnoseParser.MAX_DISTANCE ? last_index : parse_distance);
            if ((parse_distance > DiagnoseParser.MIN_DISTANCE) && (j - stack_deletions) > (repair.distance - repair.numDeletions)) {
                repair.stackPosition = top;
                repair.distance = j;
                repair.numDeletions = stack_deletions;
                repair.recoveryOnNextStack = stack_flag;
            }
        }
        return;
    }
    public secondaryRecovery(repair: SecondaryRepairInfo, stack: Int32Array, stack_top: number, last_index: number, stack_flag: boolean): void {
        var previous_loc: number = this.buffer[2], stack_deletions: number = 0;
        for (var top: number = stack_top; top >= 0 && repair.numDeletions >= stack_deletions; top--) {
            if (this.locationStack[top] < previous_loc) {
                stack_deletions++;
            }
            previous_loc = this.locationStack[top];
            for (var i: number = 2; i <= (last_index - DiagnoseParser.MIN_DISTANCE + 1) && (repair.numDeletions >= (stack_deletions + i - 1)); i++) {
                var parse_distance: number = this.parseCheck(stack, top, this.tokStream.getKind(this.buffer[i]), i + 1), j: number = (parse_distance == DiagnoseParser.MAX_DISTANCE ? last_index : parse_distance);
                if ((parse_distance - i + 1) > DiagnoseParser.MIN_DISTANCE) {
                    var k: number = stack_deletions + i - 1;
                    if ((k < repair.numDeletions) || (j - k) > (repair.distance - repair.numDeletions) || ((repair.code == ParseErrorCodes.SECONDARY_CODE) && (j - k) == (repair.distance - repair.numDeletions))) {
                        repair.code = ParseErrorCodes.DELETION_CODE;
                        repair.distance = j;
                        repair.stackPosition = top;
                        repair.bufferPosition = i;
                        repair.numDeletions = k;
                        repair.recoveryOnNextStack = stack_flag;
                    }
                }
                for (var l: number = this.nasi(stack[top]); l >= 0 && this.nasr(l) != 0; l++) {
                    var symbol: number = this.nasr(l) + this.NT_OFFSET;
                    parse_distance = this.parseCheck(stack, top, symbol, i);
                    j = (parse_distance == DiagnoseParser.MAX_DISTANCE ? last_index : parse_distance);
                    if ((parse_distance - i + 1) > DiagnoseParser.MIN_DISTANCE) {
                        var k: number = stack_deletions + i - 1;
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
    public secondaryDiagnosis(repair: SecondaryRepairInfo): void {
        switch (repair.code) {
            case ParseErrorCodes.SCOPE_CODE:
                if (repair.stackPosition < this.stateStackTop) {
                    this.emitError(ParseErrorCodes.DELETION_CODE, this.terminalIndex(this.ERROR_SYMBOL), this.locationStack[repair.stackPosition], this.buffer[1]);
                }
                for (var i: number = 0; i < this.scopeStackTop; i++) {
                    this.emitError(ParseErrorCodes.SCOPE_CODE, -this.scopeIndex[i], this.locationStack[this.scopePosition[i]], this.buffer[1], this.nonterminalIndex(this.scopeLhs(this.scopeIndex[i])));
                }
                repair.symbol = this.scopeLhs(this.scopeIndex[this.scopeStackTop]) + this.NT_OFFSET;
                this.stateStackTop = this.scopePosition[this.scopeStackTop];
                this.emitError(ParseErrorCodes.SCOPE_CODE, -this.scopeIndex[this.scopeStackTop], this.locationStack[this.scopePosition[this.scopeStackTop]], this.buffer[1], this.getNtermIndex(this.stateStack[this.stateStackTop], repair.symbol, repair.bufferPosition));
                break;
            default:
                this.emitError(repair.code, (repair.code == ParseErrorCodes.SECONDARY_CODE ? this.getNtermIndex(this.stateStack[repair.stackPosition], repair.symbol, repair.bufferPosition) : this.terminalIndex(this.ERROR_SYMBOL)), this.locationStack[repair.stackPosition], this.buffer[repair.bufferPosition - 1]);
                this.stateStackTop = repair.stackPosition;
        }
        return;
    }

 

    public emitError(msg_code: number, name_index: number, left_token: number, right_token: number, scope_name_index: number=0): void {
        var left_token_loc: number = (left_token > right_token ? right_token : left_token), right_token_loc: number = right_token;
        var token_name: string = (name_index >= 0 && !(this.name(name_index).toUpperCase() === "ERROR") ? "\"" + this.name(name_index) + "\"" : "");
        if (msg_code == ParseErrorCodes.INVALID_CODE) {
            msg_code = token_name.length == 0 ? ParseErrorCodes.INVALID_CODE : ParseErrorCodes.INVALID_TOKEN_CODE;
        }
        if (msg_code == ParseErrorCodes.SCOPE_CODE) {
            token_name = "\"";
            for (var i: number = this.scopeSuffix(-<number>name_index); this.scopeRhs(i) != 0; i++) {
                if (!this.isNullable(this.scopeRhs(i))) {
                    var symbol_index: number = (this.scopeRhs(i) > this.NT_OFFSET ? this.nonterminalIndex(this.scopeRhs(i) - this.NT_OFFSET) : this.terminalIndex(this.scopeRhs(i)));
                    if (this.name(symbol_index).length > 0) {
                        if (token_name.length > 1) {
                            token_name += " ";
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

    private lookahead(act: number, token: number): number {
        act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, this.tokStream.getKind(token));
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.getNext(token)) : act);
    }
    public tAction(act: number, sym: number): number {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET ? this.lookahead(act, this.tokStream.peek()) : act);
    }
}
;