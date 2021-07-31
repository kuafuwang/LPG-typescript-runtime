export class RecoveryParser extends DiagnoseParser implements ParseErrorCodes {
    private parser: BacktrackingParser;
    private action: IntSegmentedTuple;
    private tokens: IntTuple;
    private actionStack: Int32Array;
    private scope_repair: DiagnoseParser.PrimaryRepairInfo = new DiagnoseParser.PrimaryRepairInfo();
    constructor(parser: BacktrackingParser, action: IntSegmentedTuple, tokens: IntTuple, tokStream: IPrsStream, prs: ParseTable) {
        this.this(parser, null, action, tokens, tokStream, prs);
    }
    constructor(parser: BacktrackingParser, monitor: Monitor, action: IntSegmentedTuple, tokens: IntTuple, tokStream: IPrsStream, prs: ParseTable) {
        this.this(parser, monitor, action, tokens, tokStream, prs, 0, 0);
    }
    constructor(parser: BacktrackingParser, action: IntSegmentedTuple, tokens: IntTuple, tokStream: IPrsStream, prs: ParseTable, maxErrors: number, maxTime: number) {
        this.this(parser, null, action, tokens, tokStream, prs, maxErrors, maxTime);
    }
    constructor(parser: BacktrackingParser, monitor: Monitor, action: IntSegmentedTuple, tokens: IntTuple, tokStream: IPrsStream, prs: ParseTable, maxErrors: number, maxTime: number) {
        super(monitor, tokStream, prs, maxErrors, maxTime);
        this.parser = parser;
        this.action = action;
        this.tokens = tokens;
    }
    public reallocateStacks(): void {
        super.reallocateStacks();
        if (this.actionStack == null) {
            this.actionStack = new Int32Array(this.stateStack.length);
        } else {
            var old_stack_length: number = this.actionStack.length;
            java.lang.System.arraycopy(this.actionStack, 0, this.actionStack = new Int32Array(this.stateStack.length), 0, old_stack_length);
        }
        return;
    }
    public reportError(scope_index: number, error_token: number): void {
        var text: string = "\"";
        for (var i: number = this.scopeSuffix(scope_index); this.scopeRhs(i) != 0; i++) {
            if (!this.isNullable(this.scopeRhs(i))) {
                var symbol_index: number = (this.scopeRhs(i) > this.NT_OFFSET ? this.nonterminalIndex(this.scopeRhs(i) - this.NT_OFFSET) : this.terminalIndex(this.scopeRhs(i)));
                if (this.name(symbol_index).length > 0) {
                    if (text.length > 1) {
                        text += " ";
                    }
                    text += this.name(symbol_index);
                }
            }
        }
        text += "\"";
        this.tokStream.reportError(ParseErrorCodes.SCOPE_CODE, error_token, error_token, [text]);
        return;
    }
    public recover(marker_token: number, error_token: number): number {
        if (this.stateStack == null) {
            this.reallocateStacks();
        }
        this.tokens.reset();
        this.tokStream.reset();
        this.tokens.add(this.tokStream.getPrevious(this.tokStream.peek()));
        var restart_token: number = (marker_token != 0 ? marker_token : this.tokStream.getToken()), old_action_size: number = 0;
        this.stateStackTop = 0;
        this.stateStack[this.stateStackTop] = this.START_STATE;
        do {
            this.action.reset(old_action_size);
            if (!this.fixError(restart_token, error_token)) {
                throw new Error(error_token);
            }
            if (this.monitor != null && this.monitor.isCancelled()) {
                break;
            }
            restart_token = error_token;
            this.tokStream.reset(error_token);
            old_action_size = this.action.size();
            error_token = this.parser.backtrackParse(this.stateStack, this.stateStackTop, this.action, 0);
            this.tokStream.reset(this.tokStream.getNext(restart_token));
        } while (error_token != 0)
        return restart_token;
    }
    private fixError(start_token: number, error_token: number): boolean {
        var curtok: number = start_token, current_kind: number = this.tokStream.getKind(curtok), first_stream_token: number = this.tokStream.peek();
        this.buffer[1] = error_token;
        this.buffer[0] = this.tokStream.getPrevious(this.buffer[1]);
        for (var k: number = 2; k < DiagnoseParser.BUFF_SIZE; k++) {
            this.buffer[k] = this.tokStream.getNext(this.buffer[k - 1]);
        }
        this.scope_repair.distance = 0;
        this.scope_repair.misspellIndex = 0;
        this.scope_repair.bufferPosition = 1;
        this.main_configuration_stack = new ConfigurationStack(this.prs);
        this.locationStack[this.stateStackTop] = curtok;
        this.actionStack[this.stateStackTop] = this.action.size();
        var act: number = this.tAction(this.stateStack[this.stateStackTop], current_kind);
        for (; ;) {
            if (this.monitor != null && this.monitor.isCancelled()) {
                return true;
            }
            if (act <= this.NUM_RULES) {
                this.action.add(act);
                this.stateStackTop--;
                do {
                    this.stateStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.stateStack[this.stateStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
                try {
                    this.stateStack[++this.stateStackTop] = act;
                } catch ($ex$) {
                    if ($ex$ instanceof Error) {
                        var e: Error = <Error>$ex$;
                        this.reallocateStacks();
                        this.stateStack[this.stateStackTop] = act;
                    } else {
                        throw $ex$;
                    }
                }
                this.locationStack[this.stateStackTop] = curtok;
                this.actionStack[this.stateStackTop] = this.action.size();
                act = this.tAction(act, current_kind);
                continue;
            } else {
                if (act == this.ERROR_ACTION) {
                    if (curtok != error_token || this.main_configuration_stack.size() > 0) {
                        var configuration: ConfigurationElement = this.main_configuration_stack.pop();
                        if (configuration == null) {
                            act = this.ERROR_ACTION;
                        } else {
                            this.stateStackTop = configuration.stack_top;
                            configuration.retrieveStack(this.stateStack);
                            act = configuration.act;
                            curtok = configuration.curtok;
                            this.action.reset(configuration.action_length);
                            current_kind = this.tokStream.getKind(curtok);
                            this.tokStream.reset(this.tokStream.getNext(curtok));
                            continue;
                        }
                    }
                    break;
                } else {
                    if (act > this.ACCEPT_ACTION && act < this.ERROR_ACTION) {
                        if (this.main_configuration_stack.findConfiguration(this.stateStack, this.stateStackTop, curtok)) {
                            act = this.ERROR_ACTION;
                        } else {
                            this.main_configuration_stack.push(this.stateStack, this.stateStackTop, act + 1, curtok, this.action.size());
                            act = this.baseAction(act);
                        }
                        continue;
                    } else {
                        if (act < this.ACCEPT_ACTION) {
                            this.action.add(act);
                            curtok = this.tokStream.getToken();
                            current_kind = this.tokStream.getKind(curtok);
                        } else {
                            if (act > this.ERROR_ACTION) {
                                this.action.add(act);
                                curtok = this.tokStream.getToken();
                                current_kind = this.tokStream.getKind(curtok);
                                act -= this.ERROR_ACTION;
                                do {
                                    this.stateStackTop -= (this.rhs(act) - 1);
                                    act = this.ntAction(this.stateStack[this.stateStackTop], this.lhs(act));
                                } while (act <= this.NUM_RULES)
                            } else {
                                break;
                            }
                        }
                        try {
                            this.stateStack[++this.stateStackTop] = act;
                        } catch ($ex$) {
                            if ($ex$ instanceof Error) {
                                var e: Error = <Error>$ex$;
                                this.reallocateStacks();
                                this.stateStack[this.stateStackTop] = act;
                            } else {
                                throw $ex$;
                            }
                        }
                        if (curtok == error_token) {
                            this.scopeTrial(this.scope_repair, this.stateStack, this.stateStackTop);
                            if (this.scope_repair.distance >= DiagnoseParser.MIN_DISTANCE) {
                                this.tokens.add(start_token);
                                for (var token: number = first_stream_token; token != error_token; token = this.tokStream.getNext(token)) {
                                    this.tokens.add(token);
                                }
                                this.acceptRecovery(error_token);
                                break;
                            }
                        }
                        this.locationStack[this.stateStackTop] = curtok;
                        this.actionStack[this.stateStackTop] = this.action.size();
                        act = this.tAction(act, current_kind);
                    }
                }
            }
        }
        return (act != this.ERROR_ACTION);
    }
    private acceptRecovery(error_token: number): void {
        var recovery_action: IntTuple = new IntTuple();
        for (var k: number = 0; k <= this.scopeStackTop; k++) {
            var scope_index: number = this.scopeIndex[k], la: number = this.scopeLa(scope_index);
            recovery_action.reset();
            var act: number = this.tAction(this.stateStack[this.stateStackTop], la);
            if (act > this.ACCEPT_ACTION && act < this.ERROR_ACTION) {
                do {
                    recovery_action.add(this.baseAction(act++));
                } while (this.baseAction(act) != 0)
            } else {
                recovery_action.add(act);
            }
            var start_action_size: number = this.action.size();
            var index: number;
            for (index = 0; index < recovery_action.size(); index++) {
                this.action.reset(start_action_size);
                this.tokStream.reset(error_token);
                this.tempStackTop = this.stateStackTop - 1;
                var max_pos: number = this.stateStackTop;
                act = recovery_action.get(index);
                while (act <= this.NUM_RULES) {
                    this.action.add(act);
                    do {
                        var lhs_symbol: number = this.lhs(act);
                        this.tempStackTop -= (this.rhs(act) - 1);
                        act = (this.tempStackTop > max_pos ? this.tempStack[this.tempStackTop] : this.stateStack[this.tempStackTop]);
                        act = this.ntAction(act, lhs_symbol);
                    } while (act <= this.NUM_RULES)
                    if (this.tempStackTop + 1 >= this.stateStack.length) {
                        this.reallocateStacks();
                    }
                    max_pos = max_pos < this.tempStackTop ? max_pos : this.tempStackTop;
                    this.tempStack[this.tempStackTop + 1] = act;
                    act = this.tAction(act, la);
                }
                if (act != this.ERROR_ACTION) {
                    this.nextStackTop = ++this.tempStackTop;
                    for (var i: number = 0; i <= max_pos; i++) {
                        this.nextStack[i] = this.stateStack[i];
                    }
                    for (var i: number = max_pos + 1; i <= this.tempStackTop; i++) {
                        this.nextStack[i] = this.tempStack[i];
                    }
                    if (this.completeScope(this.action, this.scopeSuffix(scope_index))) {
                        for (var i: number = this.scopeSuffix(this.scopeIndex[k]); this.scopeRhs(i) != 0; i++) {
                            this.tokens.add((<IPrsStream>this.tokStream).makeErrorToken(error_token, this.tokStream.getPrevious(error_token), error_token, this.scopeRhs(i)));
                        }
                        this.reportError(this.scopeIndex[k], this.tokStream.getPrevious(error_token));
                        break;
                    }
                }
            }
            this.stateStackTop = this.nextStackTop;
            java.lang.System.arraycopy(this.nextStack, 0, this.stateStack, 0, this.stateStackTop + 1);
        }
        return;
    }
    private completeScope(action: IntSegmentedTuple, scope_rhs_index: number): boolean {
        var kind: number = this.scopeRhs(scope_rhs_index);
        if (kind == 0) {
            return true;
        }
        var act: number = this.nextStack[this.nextStackTop];
        if (kind > this.NT_OFFSET) {
            var lhs_symbol: number = kind - this.NT_OFFSET;
            if (this.baseCheck(act + lhs_symbol) != lhs_symbol) {
                return false;
            }
            act = this.ntAction(act, lhs_symbol);
            action.add(act <= this.NUM_RULES ? act + this.ERROR_ACTION : act);
            while (act <= this.NUM_RULES) {
                this.nextStackTop -= (this.rhs(act) - 1);
                act = this.ntAction(this.nextStack[this.nextStackTop], this.lhs(act));
            }
            this.nextStackTop++;
            this.nextStack[this.nextStackTop] = act;
            return this.completeScope(action, scope_rhs_index + 1);
        }
        act = this.tAction(act, kind);
        action.add(act);
        if (act < this.ACCEPT_ACTION) {
            this.nextStackTop++;
            this.nextStack[this.nextStackTop] = act;
            return this.completeScope(action, scope_rhs_index + 1);
        } else {
            if (act > this.ERROR_ACTION) {
                act -= this.ERROR_ACTION;
                do {
                    this.nextStackTop -= (this.rhs(act) - 1);
                    act = this.ntAction(this.nextStack[this.nextStackTop], this.lhs(act));
                } while (act <= this.NUM_RULES)
                this.nextStackTop++;
                this.nextStack[this.nextStackTop] = act;
                return true;
            } else {
                if (act > this.ACCEPT_ACTION && act < this.ERROR_ACTION) {
                    var save_action_size: number = action.size();
                    for (var i: number = act; this.baseAction(i) != 0; i++) {
                        action.reset(save_action_size);
                        act = this.baseAction(i);
                        action.add(act);
                        if (act <= this.NUM_RULES) {
                        } else {
                            if (act < this.ACCEPT_ACTION) {
                                this.nextStackTop++;
                                this.nextStack[this.nextStackTop] = act;
                                if (this.completeScope(action, scope_rhs_index + 1)) {
                                    return true;
                                }
                            } else {
                                if (act > this.ERROR_ACTION) {
                                    act -= this.ERROR_ACTION;
                                    do {
                                        this.nextStackTop -= (this.rhs(act) - 1);
                                        act = this.ntAction(this.nextStack[this.nextStackTop], this.lhs(act));
                                    } while (act <= this.NUM_RULES)
                                    this.nextStackTop++;
                                    this.nextStack[this.nextStackTop] = act;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}
;
