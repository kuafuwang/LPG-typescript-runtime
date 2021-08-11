import { Stacks } from "./Stacks";
import { Monitor } from "./Monitor";
import { TokenStream, EscapeStrictPropertyInitializationTokenStream } from "./TokenStream";
import { ParseTable, EscapeStrictPropertyInitializationParseTable } from "./ParseTable";
import { RuleAction, EscapeStrictPropertyInitializationRuleAction } from "./RuleAction";
import { IntSegmentedTuple } from "./IntSegmentedTuple";
import { IntTuple } from "./IntTuple";
import { RecoveryParser } from "./RecoveryParser";
import { ErrorToken } from "./ErrorToken";
import { PrsStream } from "./PrsStream";
import { ConfigurationStack } from "./ConfigurationStack";
import { ConfigurationElement } from "./ConfigurationElement";
import { IPrsStream, instanceOfIPrsStream } from "./Protocol";
import { BadParseException } from "./BadParseException";
import { Lpg as Lpg } from "./Utils";
import { TokenStreamNotIPrsStreamException } from "./TokenStreamNotIPrsStreamException";
import { BadParseSymFileException } from "./BadParseSymFileException";
import { NotBacktrackParseTableException } from "./NotBacktrackParseTableException";

export class BacktrackingParser extends Stacks {
    private monitor?: Monitor;
    private START_STATE: number=0;
    private NUM_RULES: number=0;
    private NT_OFFSET: number=0;
    private LA_STATE_OFFSET: number=0;
    private EOFT_SYMBOL: number=0;
    private ERROR_SYMBOL: number=0;
    private ACCEPT_ACTION: number=0;
    private ERROR_ACTION: number = 0;

    private lastToken: number=0;
    private currentAction: number = 0;

    private tokStream: TokenStream = new EscapeStrictPropertyInitializationTokenStream();
    private prs: ParseTable = new EscapeStrictPropertyInitializationParseTable();
    private ra: RuleAction = new EscapeStrictPropertyInitializationRuleAction();

    private action: IntSegmentedTuple = new IntSegmentedTuple(10, 1024);
    private tokens: IntTuple = new IntTuple(0);
    private actionStack: Int32Array = new Int32Array(0);
    private skipTokens: boolean = false;// true if error productions are used to skip tokens

    //
    // A starting marker indicates that we are dealing with an entry point
    // for a given nonterminal. We need to execute a shift action on the
    // marker in order to parse the entry point in question.
    //
    private markerTokenIndex: number = 0;
    private getMarkerToken(marker_kind: number, start_token_index: number): number {
        if (marker_kind === 0) {
            return 0;
        } else {
            if (this.markerTokenIndex === 0) {
                if (!(instanceOfIPrsStream(this.tokStream))) {
                    throw new TokenStreamNotIPrsStreamException();
                }
                this.markerTokenIndex = this.tokStream.makeErrorToken(  this.tokStream.getPrevious(start_token_index),
                                                                        this.tokStream.getPrevious(start_token_index),
                                                                        this.tokStream.getPrevious(start_token_index),
                                                                        marker_kind);
            } else {
                (<IPrsStream>this.tokStream).getIToken(this.markerTokenIndex).setKind(marker_kind);
            }
        }
        return this.markerTokenIndex;
    }

    //
    // Override the getToken function in Stacks.
    //
    public getToken(i: number): number {
        return this.tokens.get(this.locationStack[this.stateStackTop + (i - 1)]);
    }

    public getCurrentRule(): number {
        return this.currentAction;
    }
    public getFirstToken2(): number {
        return this.tokStream.getFirstRealToken(this.getToken(1));
    }
    public getFirstToken(i?: number): number {
        if (!i) {
            return this.getFirstToken2();
        }
        return this.tokStream.getFirstRealToken(this.getToken(i));
    }
    public getLastToken2(): number {
        return this.tokStream.getLastRealToken(this.lastToken);
    }
    public getLastToken(i? : number): number {
        if (!i) {
            return this.getLastToken2();
        }

        let l: number = (i >= this.prs.rhs(this.currentAction)
                            ? this.lastToken
                            : this.tokens.get(this.locationStack[this.stateStackTop + i] - 1));
        return this.tokStream.getLastRealToken(l);
    }
    public setMonitor(monitor: Monitor): void {
        this.monitor = monitor;
    }
    public reset1(): void {
        this.action.reset();
        this.skipTokens = false;
        this.markerTokenIndex = 0;
    }
    public reset2(tokStream: TokenStream, monitor?: Monitor): void {
        this.monitor = monitor;
        this.tokStream = <TokenStream>tokStream;
        this.reset1();
    }
   
    public reset(tokStream?: TokenStream, prs?: ParseTable, ra?: RuleAction, monitor?: Monitor): void {
        if (!tokStream) {
            this.reset1();
            return;
        }
        this.reset2(tokStream, monitor);
        if (ra)
            this.ra = ra;

        if (!prs) {
            return;
        }

        this.prs = prs;
        this.START_STATE = prs.getStartState();
        this.NUM_RULES = prs.getNumRules();
        this.NT_OFFSET = prs.getNtOffset();
        this.LA_STATE_OFFSET = prs.getLaStateOffset();
        this.EOFT_SYMBOL = prs.getEoftSymbol();
        this.ERROR_SYMBOL = prs.getErrorSymbol();
        this.ACCEPT_ACTION = prs.getAcceptAction();
        this.ERROR_ACTION = prs.getErrorAction();
        if (!prs.isValidForParser()) throw new BadParseSymFileException();
        if (!prs.getBacktrack()) throw new NotBacktrackParseTableException();
    }
    public reset3(tokStream: TokenStream, prs: ParseTable, ra: RuleAction): void {
        this.reset(tokStream, prs, ra);
    }
  
    constructor(tokStream?: TokenStream, prs?: ParseTable, ra?: RuleAction, monitor?: Monitor) {
        super();
        this.reset(tokStream, prs, ra, monitor);
    }

    //
    // Allocate or reallocate all the stacks. Their sizes should always be the same.
    //
    public reallocateOtherStacks(start_token_index: number): void {
        if (!this.actionStack ||this.actionStack.length === 0) {
            this.actionStack = new Int32Array(this.stateStack.length);
            this.locationStack = new Int32Array(this.stateStack.length);
            this.parseStack = new Array<any>(this.stateStack.length);
            this.actionStack[0] = 0;
            this.locationStack[0] = start_token_index;
        } else {
            if (this.actionStack.length < this.stateStack.length) {
                let old_length: number = this.actionStack.length;
                Lpg.Lang.System.arraycopy(this.actionStack, 0, this.actionStack = new Int32Array(this.stateStack.length), 0, old_length);
                Lpg.Lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(this.stateStack.length), 0, old_length);
                Lpg.Lang.System.arraycopy(this.parseStack, 0, this.parseStack = new Array<any>(this.stateStack.length), 0, old_length);
            }
        }
        return;
    }
    //public fuzzyParse(): any {
    //    return this.fuzzyParseEntry(0, lpg.lang.Integer.MAX_VALUE);
    //}
    public fuzzyParse(max_error_count?: number): any {
        if (!max_error_count) {
            max_error_count = Number.MAX_VALUE;
        }
        return this.fuzzyParseEntry(0, max_error_count);
    }
    //public fuzzyParseEntry(marker_kind: number): any {
    //    return this.fuzzyParseEntry(marker_kind, lpg.lang.Integer.MAX_VALUE);
    //}
    public fuzzyParseEntry(marker_kind: number, max_error_count?: number): any {
        if (!max_error_count) {
            max_error_count = Number.MAX_VALUE;
        }
        this.action.reset();
        this.tokStream.reset();// Position at first token.
        this.reallocateStateStack();
        this.stateStackTop = 0;
        this.stateStack[0] = this.START_STATE;

        //
        // The tuple tokens will eventually contain the sequence 
        // of tokens that resulted in a successful parse. We leave
        // it up to the "Stream" implementer to define the predecessor
        // of the first token as he sees fit.
        //
        let first_token: number = this.tokStream.peek(),
            start_token: number = first_token,
            marker_token: number = this.getMarkerToken(marker_kind, first_token);

        this.tokens = new IntTuple(this.tokStream.getStreamLength());
        this.tokens.add(this.tokStream.getPrevious(first_token));

        let error_token: number = this.backtrackParseInternal(this.action, marker_token);
        if (error_token !== 0) {// an error was detected?
            if (!(instanceOfIPrsStream(this.tokStream))) {
                throw new TokenStreamNotIPrsStreamException();
            }
            let rp = new RecoveryParser(this, this.action, this.tokens, <IPrsStream>this.tokStream, this.prs, max_error_count, 0, this.monitor);
            start_token = rp.recover(marker_token, error_token);
        }
        if (marker_token !== 0 && start_token === first_token) {
            this.tokens.add(marker_token);
        }
        let t: number;
        for (t = start_token; this.tokStream.getKind(t) != this.EOFT_SYMBOL; t = this.tokStream.getNext(t)) {
            this.tokens.add(t);
        }
        this.tokens.add(t);
        return this.parseActions(marker_kind);
    }
   
    public parse(max_error_count: number = 0): any {
        return this.parseEntry(0, max_error_count);
    }
    //
    // Parse input allowing up to max_error_count Error token recoveries.
    // When max_error_count is 0, no Error token recoveries occur.
    // When max_error is > 0, it limits the number of Error token recoveries.
    // When max_error is < 0, the number of error token recoveries is unlimited.
    // Also, such recoveries only require one token to be parsed beyond the recovery point.
    // (normally two tokens beyond the recovery point must be parsed)
    // Thus, a negative max_error_count should be used when error productions are used to 
    // skip tokens.
    //
    public parseEntry(marker_kind: number=0, max_error_count: number = 0): any {
        this.action.reset();
        this.tokStream.reset();// Position at first token.

        this.reallocateStateStack();
        this.stateStackTop = 0;
        this.stateStack[0] = this.START_STATE;

        this.skipTokens = max_error_count < 0;

        if (max_error_count > 0 &&  instanceOfIPrsStream(this.tokStream)  ) {
            max_error_count = 0;
        }
        //
        // The tuple tokens will eventually contain the sequence 
        // of tokens that resulted in a successful parse. We leave
        // it up to the "Stream" implementer to define the predecessor
        // of the first token as he sees fit.
        //
        this.tokens = new IntTuple(this.tokStream.getStreamLength());
        this.tokens.add(this.tokStream.getPrevious(this.tokStream.peek()));

        let start_token_index: number = this.tokStream.peek(),
            repair_token: number = this.getMarkerToken(marker_kind, start_token_index),
            start_action_index: number = this.action.size(),// obviously 0
            temp_stack: Int32Array = new Int32Array(this.stateStackTop + 1);
        Lpg.Lang.System.arraycopy(this.stateStack, 0, temp_stack, 0, temp_stack.length);

        let initial_error_token = this.backtrackParseInternal(this.action, repair_token);
        for (let error_token: number = initial_error_token, count: number = 0;
            error_token !== 0;
            error_token = this.backtrackParseInternal(this.action, repair_token), count++)
        {
            if (count === max_error_count) {
                throw new BadParseException(initial_error_token);
            }
            this.action.reset(start_action_index);
            this.tokStream.reset(start_token_index);
            this.stateStackTop = temp_stack.length - 1;
            Lpg.Lang.System.arraycopy(temp_stack, 0, this.stateStack, 0, temp_stack.length);
            this.reallocateOtherStacks(start_token_index);


            this.backtrackParseUpToError(repair_token, error_token);

            for (this.stateStackTop = this.findRecoveryStateIndex(this.stateStackTop);
                this.stateStackTop >= 0;
                this.stateStackTop = this.findRecoveryStateIndex(this.stateStackTop - 1))
            {
                let recovery_token = this.tokens.get(this.locationStack[this.stateStackTop] - 1);
                repair_token = this.errorRepair(<IPrsStream>this.tokStream,
                                                (recovery_token >= start_token_index ? recovery_token : error_token),
                                                error_token);
                if (repair_token !== 0) {
                    break;
                }
            }
            if (this.stateStackTop < 0) {
                throw new BadParseException(initial_error_token);
            }
            temp_stack = new Int32Array(this.stateStackTop + 1);
            Lpg.Lang.System.arraycopy(this.stateStack, 0, temp_stack, 0, temp_stack.length);

            start_action_index = this.action.size();
            start_token_index = this.tokStream.peek();
        }
        if (repair_token !== 0) {
            this.tokens.add(repair_token);
        }
        let t: number;
        for (t = start_token_index; this.tokStream.getKind(t) !== this.EOFT_SYMBOL; t = this.tokStream.getNext(t)) {
            this.tokens.add(t);
        }
        this.tokens.add(t);
        return this.parseActions(marker_kind);
    }
    //
    // Process reductions and continue...
    //
    private process_reductions(): void {
        do {
            this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
            this.ra.ruleAction(this.currentAction);
            this.currentAction = this.prs.ntAction(this.stateStack[this.stateStackTop], this.prs.lhs(this.currentAction));
        } while (this.currentAction <= this.NUM_RULES)
        return;
    }

    //
    // Now do the final parse of the input based on the actions in
    // the list "action" and the sequence of tokens in list "tokens".
    //
    private parseActions(marker_kind: number): any {
        let ti: number = -1,
            curtok: number;
        this.lastToken = this.tokens.get(++ti);
        curtok = this.tokens.get(++ti);
        this.allocateOtherStacks();
        //
        // Reparse the input...
        //
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;

        for (let i: number = 0; i < this.action.size(); i++) {
            //
            // if the parser needs to stop processing, it may do so here.
            //
            if (this.monitor  && this.monitor.isCancelled()) {
                return null;
            }
            this.stateStack[++this.stateStackTop] = this.currentAction;
            this.locationStack[this.stateStackTop] = ti;

            this.currentAction = this.action.get(i);
            if (this.currentAction <= this.NUM_RULES) { // a reduce action?
                this.stateStackTop--;// make reduction look like shift-reduction
                this.process_reductions();
            } else { // a shift or shift-reduce action
                if (this.tokStream.getKind(curtok) > this.NT_OFFSET) {
                    let badtok: ErrorToken = <ErrorToken>(<PrsStream>this.tokStream).getIToken(curtok);
                    throw new BadParseException(badtok.getErrorToken().getTokenIndex());
                }
                this.lastToken = curtok;
                curtok = this.tokens.get(++ti);
                if (this.currentAction > this.ERROR_ACTION) {
                    this.currentAction -= this.ERROR_ACTION;
                    this.process_reductions();
                }
            }
        }
        return this.parseStack[marker_kind == 0 ? 0 : 1];
    }

    //
    // Process reductions and continue...
    //
    private process_backtrack_reductions(act: number): number {
        do {
            this.stateStackTop -= (this.prs.rhs(act) - 1);
            act = this.prs.ntAction(this.stateStack[this.stateStackTop], this.prs.lhs(act));
        } while (act <= this.NUM_RULES)
        return act;
    }

    //
    // This method is intended to be used by the type RecoveryParser.
    // Note that the action tuple passed here must be the same action
    // tuple that was passed down to RecoveryParser. It is passed back
    // to this method as documention.
    //
    public backtrackParse(stack: Int32Array, stack_top: number, action: IntSegmentedTuple, initial_token: number): number {
        this.stateStackTop = stack_top;
        Lpg.Lang.System.arraycopy(stack, 0, this.stateStack, 0, this.stateStackTop + 1);
        return this.backtrackParseInternal(action, initial_token);
    }


    //
    // Parse the input until either the parse completes successfully or
    // an error is encountered. This function returns an integer that
    // represents the last action that was executed by the parser. If
    // the parse was succesful, then the tuple "action" contains the
    // successful sequence of actions that was executed.
    //
    private backtrackParseInternal(action: IntSegmentedTuple, initial_token: number): number {
        //
        // Allocate configuration stack.
        //
        let configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);

        //
        // Keep parsing until we successfully reach the end of file or
        // an error is encountered. The list of actions executed will
        // be stored in the "action" tuple.
        //
        let error_token: number = 0,
            maxStackTop: number = this.stateStackTop,
            start_token: number = this.tokStream.peek(),
            curtok: number = (initial_token > 0 ? initial_token : this.tokStream.getToken()),
            current_kind: number = this.tokStream.getKind(curtok),
            act: number = this.tAction(this.stateStack[this.stateStackTop], current_kind);
        //
        // The main driver loop
        //
        for (; ;) {
            //
            // if the parser needs to stop processing,
            // it may do so here.
            //
            if (this.monitor  && this.monitor.isCancelled()) {
                return 0;
            }
            if (act <= this.NUM_RULES) {
                action.add(act);// save this reduce action
                this.stateStackTop--;
                act = this.process_backtrack_reductions(act);
            }
            else if (act > this.ERROR_ACTION)
            {
                action.add(act); // save this shift-reduce action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                act = this.process_backtrack_reductions(act - this.ERROR_ACTION);
            }
            else if (act < this.ACCEPT_ACTION)
            {
                action.add(act);// save this shift action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
            }
            else if (act === this.ERROR_ACTION)
            {
                error_token = (error_token > curtok ? error_token : curtok);

                let configuration = configuration_stack.pop();
                if (configuration === undefined) {
                    act = this.ERROR_ACTION;
                } else {
                    action.reset(configuration.action_length);
                    act = configuration.act;
                    curtok = configuration.curtok;
                    current_kind = this.tokStream.getKind(curtok);
                    this.tokStream.reset(curtok === initial_token
                                                ? start_token
                                                : this.tokStream.getNext(curtok));
                    this.stateStackTop = configuration.stack_top;
                    configuration.retrieveStack(this.stateStack);
                    continue;
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION)
            {
                if (configuration_stack.findConfiguration(this.stateStack, this.stateStackTop, curtok)) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(this.stateStack, this.stateStackTop, act + 1, curtok, action.size());
                    act = this.prs.baseAction(act);
                    maxStackTop = this.stateStackTop > maxStackTop ? this.stateStackTop : maxStackTop;
                }
                continue;
            }
            else {
                break;// assert(act == ACCEPT_ACTION);
            }
                        
            if (++this.stateStackTop >= this.stateStack.length) {
                this.reallocateStateStack();
            }
            this.stateStack[this.stateStackTop] = act;

            act = this.tAction(act, current_kind);
        }
        return (act === this.ERROR_ACTION ? error_token : 0);
    }
    private backtrackParseUpToError(initial_token: number, error_token: number): void {
        //
        // Allocate configuration stack.
        //
        let configuration_stack = new ConfigurationStack(this.prs);

        //
        // Keep parsing until we successfully reach the end of file or
        // an error is encountered. The list of actions executed will
        // be stored in the "action" tuple.
        //
        let start_token: number = this.tokStream.peek(),
            curtok: number = (initial_token > 0 ? initial_token : this.tokStream.getToken()),
            current_kind: number = this.tokStream.getKind(curtok),
            act: number = this.tAction(this.stateStack[this.stateStackTop], current_kind);

        this.tokens.add(curtok);
        this.locationStack[this.stateStackTop] = this.tokens.size();
        this.actionStack[this.stateStackTop] = this.action.size();

        for (; ;) {
            //
            // if the parser needs to stop processing,
            // it may do so here.
            //
            if (this.monitor  && this.monitor.isCancelled()) {
                return;
            }

            if (act <= this.NUM_RULES) {
                this.action.add(act);// save this reduce action
                this.stateStackTop--;
                act = this.process_backtrack_reductions(act);
            }
            else if (act > this.ERROR_ACTION)
            {
                this.action.add(act); // save this shift-reduce action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                this.tokens.add(curtok);
                act = this.process_backtrack_reductions(act - this.ERROR_ACTION);
            }
            else if (act < this.ACCEPT_ACTION)
            {
                this.action.add(act); // save this shift action
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                this.tokens.add(curtok);
            }
            else if (act === this.ERROR_ACTION)
            {
                if (curtok !== error_token) {
                    let configuration = configuration_stack.pop();
                    if (configuration === undefined) {
                        act = this.ERROR_ACTION;
                    } else {
                        this.action.reset(configuration.action_length);
                        act = configuration.act;
                        let next_token_index: number = configuration.curtok;
                        this.tokens.reset(next_token_index);
                        curtok = this.tokens.get(next_token_index - 1);
                        current_kind = this.tokStream.getKind(curtok);
                        this.tokStream.reset(curtok === initial_token
                                                    ? start_token
                                                    : this.tokStream.getNext(curtok));
                        this.stateStackTop = configuration.stack_top;
                        configuration.retrieveStack(this.stateStack);
                        this.locationStack[this.stateStackTop] = this.tokens.size();
                        this.actionStack[this.stateStackTop] = this.action.size();
                        continue;
                    }
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION)
            {
                if (configuration_stack.findConfiguration(this.stateStack, this.stateStackTop, this.tokens.size())) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(this.stateStack, this.stateStackTop, act + 1, this.tokens.size(), this.action.size());
                    act = this.prs.baseAction(act);
                }
                continue;
            } else {
                break;// assert(act == ACCEPT_ACTION);
            }

            this.stateStack[++this.stateStackTop] = act;// no need to check if out of bounds
            this.locationStack[this.stateStackTop] = this.tokens.size();
            this.actionStack[this.stateStackTop] = this.action.size();
            act = this.tAction(act, current_kind);
        }
        return;
    }
    private repairable(error_token: number): boolean {
        //
        // Allocate configuration stack.
        //
        let configuration_stack: ConfigurationStack = new ConfigurationStack(this.prs);

        //
        // Keep parsing until we successfully reach the end of file or
        // an error is encountered. The list of actions executed will
        // be stored in the "action" tuple.
        //
        let start_token: number = this.tokStream.peek(),
            final_token: number = this.tokStream.getStreamLength(), // unreachable
            curtok: number = 0,
            current_kind: number = this.ERROR_SYMBOL,
            act: number = this.tAction(this.stateStack[this.stateStackTop], current_kind);
        for (; ;)
        {
            if (act <= this.NUM_RULES) {
                this.stateStackTop--;
                act = this.process_backtrack_reductions(act);
            }
            else if (act > this.ERROR_ACTION)
            {
                curtok = this.tokStream.getToken();
                if (curtok > final_token) {
                    return true;
                }
                current_kind = this.tokStream.getKind(curtok);
                act = this.process_backtrack_reductions(act - this.ERROR_ACTION);
            }
            else if (act < this.ACCEPT_ACTION)
            {
                curtok = this.tokStream.getToken();
                if (curtok > final_token) {
                    return true;
                }
                current_kind = this.tokStream.getKind(curtok);
            }
            else if (act === this.ERROR_ACTION)
            {
                let configuration = configuration_stack.pop();
                if (configuration === undefined) {
                    act = this.ERROR_ACTION;
                } else {
                    this.stateStackTop = configuration.stack_top;
                    configuration.retrieveStack(this.stateStack);
                    act = configuration.act;
                    curtok = configuration.curtok;
                    if (curtok === 0) {
                        current_kind = this.ERROR_SYMBOL;
                        this.tokStream.reset(start_token);
                    } else {
                        current_kind = this.tokStream.getKind(curtok);
                        this.tokStream.reset(this.tokStream.getNext(curtok));
                    }
                    continue;
                }
                break;
            }
            else if (act > this.ACCEPT_ACTION)
            {
                if (configuration_stack.findConfiguration(this.stateStack, this.stateStackTop, curtok)) {
                    act = this.ERROR_ACTION;
                } else {
                    configuration_stack.push(this.stateStack, this.stateStackTop, act + 1, curtok, 0);
                    act = this.prs.baseAction(act);
                }
                continue;
            } else {
                break;// assert(act == ACCEPT_ACTION);
            }
                        

         
            //
            // We consider a configuration to be acceptable for recovery
            // if we are able to consume enough symbols in the remainining
            // tokens to reach another potential recovery point past the
            // original error token.
            //
            if ((curtok > error_token) && (final_token == this.tokStream.getStreamLength())) {
                //
                // If the ERROR_SYMBOL is a valid Action Adjunct in the state
                // "act" then we set the terminating token as the successor of
                // the current token. I.e., we have to be able to parse at least
                // two tokens past the resynch point before we claim victory.
                //
                if (this.recoverableState(act)) {
                    final_token = this.skipTokens ? curtok : this.tokStream.getNext(curtok);
                }
            }
            if (++this.stateStackTop >= this.stateStack.length) {
                this.reallocateStateStack();
            }
            this.stateStack[this.stateStackTop] = act;

            act = this.tAction(act, current_kind);
        }
        //
        // If we can reach the end of the input successfully, we claim victory.
        //
        return (act === this.ACCEPT_ACTION);
    }
    private recoverableState(state: number): boolean {
        for (let k: number = this.prs.asi(state); this.prs.asr(k) !== 0; k++) {
            if (this.prs.asr(k) === this.ERROR_SYMBOL) {
                return true;
            }
        }
        return false;
    }
    private findRecoveryStateIndex(start_index: number): number {
        let i: number;
        for (i = start_index; i >= 0; i--) {
            //
            // If the ERROR_SYMBOL is an Action Adjunct in state stateStack[i]
            // then chose i as the index of the state to recover on.
            //
            if (this.recoverableState(this.stateStack[i])) {
                break;
            }
        }
        if (i >= 0) {// if a recoverable state, remove null reductions, if any.
            let k: number;
            for (k = i - 1; k >= 0; k--) {
                if (this.locationStack[k] != this.locationStack[i]) {
                    break;
                }
            }
            i = k + 1;
        }
        return i;
    }

    private errorRepair(stream: IPrsStream, recovery_token: number, error_token: number): number {
        let temp_stack: Int32Array = new Int32Array(this.stateStackTop + 1);
        Lpg.Lang.System.arraycopy(this.stateStack, 0, temp_stack, 0, temp_stack.length);
        for (;
            stream.getKind(recovery_token) !== this.EOFT_SYMBOL;
            recovery_token = stream.getNext(recovery_token))
        {
            stream.reset(recovery_token);
            if (this.repairable(error_token)) {
                break;
            }
            this.stateStackTop = temp_stack.length - 1;
            Lpg.Lang.System.arraycopy(temp_stack, 0, this.stateStack, 0, temp_stack.length);
        }

        if (stream.getKind(recovery_token) == this.EOFT_SYMBOL) {
            stream.reset(recovery_token);
            if (!this.repairable(error_token)) {
                this.stateStackTop = temp_stack.length - 1;
                Lpg.Lang.System.arraycopy(temp_stack, 0, this.stateStack, 0, temp_stack.length);
                return 0;
            }
        }

        this.stateStackTop = temp_stack.length - 1;
        Lpg.Lang.System.arraycopy(temp_stack, 0, this.stateStack, 0, temp_stack.length);
        stream.reset(recovery_token);
        this.tokens.reset(this.locationStack[this.stateStackTop] - 1);
        this.action.reset(this.actionStack[this.stateStackTop]);

        return stream.makeErrorToken(this.tokens.get(this.locationStack[this.stateStackTop] - 1),
                                                    stream.getPrevious(recovery_token),
                                                    error_token,
                                                    this.ERROR_SYMBOL);
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
}
;