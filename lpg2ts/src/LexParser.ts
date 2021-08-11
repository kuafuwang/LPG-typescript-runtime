
import { ParseTable, EscapeStrictPropertyInitializationParseTable } from "./ParseTable";
import { RuleAction, EscapeStrictPropertyInitializationRuleAction } from "./RuleAction";
import { IntTuple } from "./IntTuple";
import { Monitor } from "./Monitor";
import { Lpg as Lpg } from "./Utils";
import { ILexStream, EscapeStrictPropertyInitializationLexStream } from "./Protocol";
import { UnavailableParserInformationException } from "./UnavailableParserInformationException";

export class LexParser {
    private taking_actions: boolean = false;

    private START_STATE: number = 0;
    private LA_STATE_OFFSET: number = 0;
    private EOFT_SYMBOL: number = 0;
    private ACCEPT_ACTION: number = 0;
    private ERROR_ACTION: number = 0;
    private START_SYMBOL: number = 0;
    private NUM_RULES: number = 0;

    private tokStream: ILexStream = new EscapeStrictPropertyInitializationLexStream();
    private prs: ParseTable = new EscapeStrictPropertyInitializationParseTable();
    private ra: RuleAction = new EscapeStrictPropertyInitializationRuleAction();
    private action: IntTuple = new IntTuple(0);


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
    //
    // Stacks portion
    //
    private readonly STACK_INCREMENT: number = 1024;
    private stateStackTop: number = 0;
    private stackLength: number = 0;
    private stack: Int32Array = new Int32Array(0);
    private locationStack: Int32Array = new Int32Array(0);
    private tempStack: Int32Array = new Int32Array(0);

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
    private lastToken: number = 0;
    private currentAction: number = 0;
    private curtok: number = 0;
    private starttok: number = 0;
    private current_kind: number = 0;
    //
    // The following functions can be invoked only when the parser is
    // processing actions. Thus, they can be invoked when the parser
    // was entered via the main entry point (parseCharacters()). When using
    // the incremental parser (via the entry point scanNextToken(int [], int)),
    // they always return 0 when invoked. // TODO: Should we throw an Exception instead?
    // However, note that when parseActions() is invoked after successfully
    // parsing an input with the incremental parser, then they can be invoked.
    //
    public getFirstToken(i?: number): number {
        if (i) {
            return this.getToken(i);
        }
        return this.starttok;

    }
    public getLastToken(i?: number): number {
        if (!i) {
            return this.lastToken;
        }
        if (this.taking_actions) {
            return (i >= this.prs.rhs(this.currentAction)
                ? this.lastToken
                : this.tokStream.getPrevious(this.getToken(i + 1)));
        }
        throw new UnavailableParserInformationException();
    }
    public getCurrentRule(): number {
        if (this.taking_actions) {
            return this.currentAction;
        }
        throw new UnavailableParserInformationException();
    }

    //
    // Given a rule of the form     A ::= x1 x2 ... xn     n > 0
    //
    // the function getToken(i) yields the symbol xi, if xi is a terminal
    // or ti, if xi is a nonterminal that produced a string of the form
    // xi => ti w. If xi is a nullable nonterminal, then ti is the first
    //  symbol that immediately follows xi in the input (the lookahead).
    //
    public getToken(i: number): number {
        if (this.taking_actions) {
            return this.locationStack[this.stateStackTop + (i - 1)];
        }
        throw new UnavailableParserInformationException();
    }
    public setSym1(i: number): void { }
    public getSym(i: number): number {
        return this.getLastToken(i);
    }

    public resetTokenStream(i: number): void {
        //
        // if i exceeds the upper bound, reset it to point to the last element.
        //
        this.tokStream.reset(i > this.tokStream.getStreamLength() ? this.tokStream.getStreamLength() : i);
        this.curtok = this.tokStream.getToken();
        this.current_kind = this.tokStream.getKind(this.curtok);
        if (!this.stack || this.stack.length == 0) {
            this.reallocateStacks();
        }
        if (this.action.capacity() == 0) {
            this.action = new IntTuple(1 << 10);
        }
    }

    //
    // Parse the input and create a stream of tokens.
    //
    public parseCharacters(start_offset: number, end_offset: number, monitor?: Monitor): void {
        this.resetTokenStream(start_offset);
        while (this.curtok <= end_offset) {
            //
            // if the parser needs to stop processing,
            // it may do so here.
            //
            if (monitor && monitor.isCancelled()) {
                return;
            }
            this.lexNextToken(end_offset);
        }
    }
    //
    // Parse the input and create a stream of tokens.
    //
    public parseCharactersWhitMonitor(monitor?: Monitor): void {
        //
        // Indicate that we are running the regular parser and that it's
        // ok to use the utility functions to query the parser.
        //
        this.taking_actions = true;
        this.resetTokenStream(0);


        //
        // Until it reaches the end-of-file token, this outer loop
        // resets the parser and processes the next token.
        //
        ProcessTokens: while (this.current_kind != this.EOFT_SYMBOL) {
            //
            // if the parser needs to stop processing,
            // it may do so here.
            //
            if (monitor != null && monitor.isCancelled())
                break ProcessTokens;

            this.stateStackTop = -1;
            this.currentAction = this.START_STATE;
            this.starttok = this.curtok;

            ScanToken: for (; ;) {
                if (++this.stateStackTop >= this.stack.length) {
                    this.reallocateStacks();
                }
                this.stack[this.stateStackTop] = this.currentAction;

                this.locationStack[this.stateStackTop] = this.curtok;

                //
                // Compute the action on the next character. If it is a reduce action, we do not
                // want to accept it until we are sure that the character in question is can be parsed.
                // What we are trying to avoid is a situation where Curtok is not the EOF token
                // but it yields a default reduce action in the current configuration even though
                // it cannot ultimately be shifted; However, the state on top of the configuration also
                // contains a valid reduce action on EOF which, if taken, would lead to the successful
                // scanning of the token.
                //
                // Thus, if the character can be parsed, we proceed normally. Otherwise, we proceed
                // as if we had reached the end of the file (end of the token, since we are really
                // scanning).
                //
                this.parseNextCharacter(this.curtok, this.current_kind);
                if (this.currentAction == this.ERROR_ACTION && this.current_kind != this.EOFT_SYMBOL) // if not successful try EOF
                {
                    let save_next_token = this.tokStream.peek(); // save position after curtok
                    this.tokStream.reset(this.tokStream.getStreamLength() - 1); // point to the end of the input
                    this.parseNextCharacter(this.curtok, this.EOFT_SYMBOL);
                    // assert (currentAction == ACCEPT_ACTION || currentAction == ERROR_ACTION);
                    this.tokStream.reset(save_next_token); // reset the stream for the next token after curtok.
                }

                //
                // At this point, currentAction is either a Shift, Shift-Reduce, Accept or Error action.
                //
                if (this.currentAction > this.ERROR_ACTION) // Shift-reduce
                {
                    this.lastToken = this.curtok;
                    this.curtok = this.tokStream.getToken();
                    this.current_kind = this.tokStream.getKind(this.curtok);
                    this.currentAction -= this.ERROR_ACTION;
                    do {
                        this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                        this.ra.ruleAction(this.currentAction);
                        let lhs_symbol = this.prs.lhs(this.currentAction);
                        if (lhs_symbol == this.START_SYMBOL)
                            continue ProcessTokens;
                        this.currentAction = this.prs.ntAction(this.stack[this.stateStackTop], lhs_symbol);
                    } while (this.currentAction <= this.NUM_RULES);
                }
                else if (this.currentAction < this.ACCEPT_ACTION) // Shift
                {
                    this.lastToken = this.curtok;
                    this.curtok = this.tokStream.getToken();
                    this.current_kind = this.tokStream.getKind(this.curtok);
                }
                else if (this.currentAction == this.ACCEPT_ACTION)
                    continue ProcessTokens;
                else break ScanToken; // ERROR_ACTION
            }

            //
            // Whenever we reach this point, an error has been detected.
            // Note that the parser loop above can never reach the ACCEPT
            // point as it is short-circuited each time it reduces a phrase
            // to the START_SYMBOL.
            //
            // If an error is detected on a single bad character,
            // we advance to the next character before resuming the
            // scan. However, if an error is detected after we start
            // scanning a construct, we form a bad token out of the
            // characters that have already been scanned and resume
            // scanning on the character on which the problem was
            // detected. In other words, in that case, we do not advance.
            //
            if (this.starttok == this.curtok) {
                if (this.current_kind == this.EOFT_SYMBOL)
                    break ProcessTokens;
                this.tokStream.reportLexicalError(this.starttok, this.curtok);
                this.lastToken = this.curtok;
                this.curtok = this.tokStream.getToken();
                this.current_kind = this.tokStream.getKind(this.curtok);
            }
            else this.tokStream.reportLexicalError(this.starttok, this.lastToken);
        }

        this.taking_actions = false; // indicate that we are done

        return;

    }
    //
    // This function takes as argument a configuration ([stack, stackTop], [tokStream, curtok])
    // and determines whether or not curtok can be validly parsed in this configuration. If so,
    // it parses curtok and returns the final shift or shift-reduce action on it. Otherwise, it
    // leaves the configuration unchanged and returns ERROR_ACTION.
    //
    private parseNextCharacter(token: number, kind: number): void {
        let start_action: number = this.stack[this.stateStackTop],
            pos: number = this.stateStackTop,
            tempStackTop: number = this.stateStackTop - 1;

        Scan: for (this.currentAction = this.tAction(start_action, kind);
            this.currentAction <= this.NUM_RULES;
            this.currentAction = this.tAction(this.currentAction, kind)) {
            do {
                let lhs_symbol = this.prs.lhs(this.currentAction);
                if (lhs_symbol == this.START_SYMBOL)
                    break Scan;
                tempStackTop -= (this.prs.rhs(this.currentAction) - 1);
                let state = (tempStackTop > pos
                    ? this.tempStack[tempStackTop]
                    : this.stack[tempStackTop]);
                this.currentAction = this.prs.ntAction(state, lhs_symbol);
            } while (this.currentAction <= this.NUM_RULES);
            if (tempStackTop + 1 >= this.stack.length)
                this.reallocateStacks();
            //
            // ... Update the maximum useful position of the stack,
            // push goto state into (temporary) stack, and compute
            // the next action on the current symbol ...
            //
            pos = pos < tempStackTop ? pos : tempStackTop;
            this.tempStack[tempStackTop + 1] = this.currentAction;
        }

        //
        // If no error was detected, we update the configuration up to the point prior to the
        // shift or shift-reduce on the token by processing all reduce and goto actions associated
        // with the current token.
        //
        if (this.currentAction != this.ERROR_ACTION) {
            //
            // Note that it is important that the global variable currentAction be used here when
            // we are actually processing the rules. The reason being that the user-defined function
            // ra.ruleAction() may call public functions defined in this class (such as getLastToken())
            // which require that currentAction be properly initialized.
            //
            Replay: for (this.currentAction = this.tAction(start_action, kind);
                this.currentAction <= this.NUM_RULES;
                this.currentAction = this.tAction(this.currentAction, kind)) {
                this.stateStackTop--;
                do {
                    this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                    this.ra.ruleAction(this.currentAction);
                    let lhs_symbol = this.prs.lhs(this.currentAction);
                    if (lhs_symbol == this.START_SYMBOL) {
                        this.currentAction = (this.starttok == token // null string reduction to START_SYMBOL is illegal
                            ? this.ERROR_ACTION
                            : this.ACCEPT_ACTION);
                        break Replay;
                    }
                    this.currentAction = this.prs.ntAction(this.stack[this.stateStackTop], lhs_symbol);
                } while (this.currentAction <= this.NUM_RULES);

                if (++this.stateStackTop >= this.stack.length) {
                    this.reallocateStacks();
                }
                this.stack[this.stateStackTop] = this.currentAction;

                this.locationStack[this.stateStackTop] = token;
            }
        }

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
    private tAction(act: number, sym: number): number {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET
            ? this.lookahead(act, this.tokStream.peek())
            : act);
    }

    public scanNextToken2(): boolean {
        return this.lexNextToken(this.tokStream.getStreamLength());
    }
    public scanNextToken(start_offset?: number): boolean {

        if (!start_offset) {
            return this.scanNextToken2();
        }

        this.resetTokenStream(start_offset);
        return this.lexNextToken(this.tokStream.getStreamLength());
    }
    private lexNextToken(end_offset: number): boolean {
        //
        // Indicate that we are going to run the incremental parser and that
        // it's forbidden to use the utility functions to query the parser.
        //
        this.taking_actions = false;

        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;
        this.starttok = this.curtok;
        this.action.reset();

        ScanToken: for (; ;) {
            if (++this.stateStackTop >= this.stack.length) {
                this.reallocateStacks();
            }
            this.stack[this.stateStackTop] = this.currentAction;

            //
            // Compute the this.action on the next character. If it is a reduce this.action, we do not
            // want to accept it until we are sure that the character in question is parsable.
            // What we are trying to avoid is a situation where this.curtok is not the EOF token
            // but it yields a default reduce this.action in the current configuration even though
            // it cannot ultimately be shifted; However, the state on top of the configuration also
            // contains a valid reduce this.action on EOF which, if taken, would lead to the succesful
            // scanning of the token.
            //
            // Thus, if the character is parsable, we proceed normally. Otherwise, we proceed
            // as if we had reached the end of the file (end of the token, since we are really
            // scanning).
            //
            this.currentAction = this.lexNextCharacter(this.currentAction, this.current_kind);
            if (this.currentAction == this.ERROR_ACTION && this.current_kind != this.EOFT_SYMBOL) // if not successful try EOF
            {
                let save_next_token = this.tokStream.peek(); // save position after this.curtok
                this.tokStream.reset(this.tokStream.getStreamLength() - 1); // point to the end of the input
                this.currentAction = this.lexNextCharacter(this.stack[this.stateStackTop], this.EOFT_SYMBOL);
                // assert (this.currentAction == this.ACCEPT_ACTION || this.currentAction == this.ERROR_ACTION);
                this.tokStream.reset(save_next_token); // reset the stream for the next token after this.curtok.
            }

            this.action.add(this.currentAction); // save the this.action

            //
            // At this point, this.currentAction is either a Shift, Shift-Reduce, Accept or Error this.action.
            //
            if (this.currentAction > this.ERROR_ACTION) //Shift-reduce
            {
                this.curtok = this.tokStream.getToken();
                if (this.curtok > end_offset)
                    this.curtok = this.tokStream.getStreamLength();
                this.current_kind = this.tokStream.getKind(this.curtok);
                this.currentAction -= this.ERROR_ACTION;
                do {
                    let lhs_symbol = this.prs.lhs(this.currentAction);
                    if (lhs_symbol == this.START_SYMBOL) {
                        this.parseActions();
                        return true;
                    }
                    this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                    this.currentAction = this.prs.ntAction(this.stack[this.stateStackTop], lhs_symbol);
                } while (this.currentAction <= this.NUM_RULES);
            }
            else if (this.currentAction < this.ACCEPT_ACTION) // Shift
            {
                this.curtok = this.tokStream.getToken();
                if (this.curtok > end_offset)
                    this.curtok = this.tokStream.getStreamLength();
                this.current_kind = this.tokStream.getKind(this.curtok);
            }
            else if (this.currentAction == this.ACCEPT_ACTION)
                return true;
            else break ScanToken; // this.ERROR_ACTION
        }

        //
        // Whenever we reach this point, an error has been detected.
        // Note that the parser loop above can never reach the ACCEPT
        // point as it is short-circuited each time it reduces a phrase
        // to the this.START_SYMBOL.
        //
        // If an error is detected on a single bad character,
        // we advance to the next character before resuming the
        // scan. However, if an error is detected after we start
        // scanning a construct, we form a bad token out of the
        // characters that have already been scanned and resume
        // scanning on the character on which the problem was
        // detected. In other words, in that case, we do not advance.
        //
        if (this.starttok == this.curtok) {
            if (this.current_kind == this.EOFT_SYMBOL) {
                this.action = new IntTuple(0); // turn into garbage!
                return false;
            }
            this.lastToken = this.curtok;
            this.tokStream.reportLexicalError(this.starttok, this.curtok);
            this.curtok = this.tokStream.getToken();
            if (this.curtok > end_offset)
                this.curtok = this.tokStream.getStreamLength();
            this.current_kind = this.tokStream.getKind(this.curtok);
        }
        else {
            this.lastToken = this.tokStream.getPrevious(this.curtok);
            this.tokStream.reportLexicalError(this.starttok, this.lastToken);
        }


        return true;
    }


















    //
    // This function takes as argument a configuration ([this.stack, stackTop], [this.tokStream, this.curtok])
    // and determines whether or not the reduce this.action the this.curtok can be validly parsed in this
    // configuration.
    //
    private lexNextCharacter(act: number, kind: number): number {
        let action_save = this.action.size(),
            pos = this.stateStackTop,
            tempStackTop = this.stateStackTop - 1;
        act = this.tAction(act, kind);
        Scan: while (act <= this.NUM_RULES) {
            this.action.add(act);

            do {
                let lhs_symbol = this.prs.lhs(act);
                if (lhs_symbol == this.START_SYMBOL) {
                    if (this.starttok == this.curtok) // null string reduction to this.START_SYMBOL is illegal
                    {
                        act = this.ERROR_ACTION;
                        break Scan;
                    }
                    else {
                        this.parseActions();
                        return this.ACCEPT_ACTION;
                    }
                }
                tempStackTop -= (this.prs.rhs(act) - 1);
                let state = (tempStackTop > pos
                    ? this.tempStack[tempStackTop]
                    : this.stack[tempStackTop]);
                act = this.prs.ntAction(state, lhs_symbol);
            } while (act <= this.NUM_RULES);
            if (tempStackTop + 1 >= this.stack.length)
                this.reallocateStacks();
            //
            // ... Update the maximum useful position of the this.stack,
            // push goto state into (temporary) this.stack, and compute
            // the next this.action on the current symbol ...
            //
            pos = pos < tempStackTop ? pos : tempStackTop;
            this.tempStack[tempStackTop + 1] = act;
            act = this.tAction(act, kind);
        }

        //
        // If an error was detected, we restore the original configuration.
        // Otherwise, we update configuration up to the point prior to the
        // shift or shift-reduce on the token.
        //
        if (act == this.ERROR_ACTION)
            this.action.reset(action_save);
        else {
            this.stateStackTop = tempStackTop + 1;
            for (let i = pos + 1; i <= this.stateStackTop; i++) // update this.stack
                this.stack[i] = this.tempStack[i];
        }

        return act;
    }

    //
    // Now do the final parse of the input based on the actions in
    // the list "this.action" and the sequence of tokens in the token stream.
    //
    private parseActions(): void {
        //
        // Indicate that we are running the regular parser and that it's
        // ok to use the utility functions to query the parser.
        //
        this.taking_actions = true;

        this.curtok = this.starttok;
        this.lastToken = this.tokStream.getPrevious(this.curtok);

        //
        // Reparse the input...
        //
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;
        process_actions: for (let i = 0; i < this.action.size(); i++) {
            this.stack[++this.stateStackTop] = this.currentAction;
            this.locationStack[this.stateStackTop] = this.curtok;

            this.currentAction = this.action.get(i);
            if (this.currentAction <= this.NUM_RULES) // a reduce this.action?
            {
                this.stateStackTop--; // turn reduction intoshift-reduction
                do {
                    this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                    this.ra.ruleAction(this.currentAction);
                    let lhs_symbol = this.prs.lhs(this.currentAction);
                    if (lhs_symbol == this.START_SYMBOL) {
                        // assert(starttok != this.curtok);  // null string reduction to this.START_SYMBOL is illegal
                        break process_actions;
                    }
                    this.currentAction = this.prs.ntAction(this.stack[this.stateStackTop], lhs_symbol);
                } while (this.currentAction <= this.NUM_RULES);
            }
            else // a shift or shift-reduce this.action
            {
                this.lastToken = this.curtok;
                this.curtok = this.tokStream.getNext(this.curtok);
                if (this.currentAction > this.ERROR_ACTION) // a shift-reduce this.action?
                {
                    this.current_kind = this.tokStream.getKind(this.curtok);
                    this.currentAction -= this.ERROR_ACTION;
                    do {
                        this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                        this.ra.ruleAction(this.currentAction);
                        let lhs_symbol = this.prs.lhs(this.currentAction);
                        if (lhs_symbol == this.START_SYMBOL)
                            break process_actions;
                        this.currentAction = this.prs.ntAction(this.stack[this.stateStackTop], lhs_symbol);
                    } while (this.currentAction <= this.NUM_RULES);
                }
            }
        }

        this.taking_actions = false; // indicate that we are done

        return;
    }





}
;
