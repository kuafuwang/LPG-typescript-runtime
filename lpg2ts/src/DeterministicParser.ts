import { Stacks } from "./Stacks";
import { Monitor } from "./Monitor";
import { IntTuple } from "./IntTuple";
import { TokenStream, EscapeStrictPropertyInitializationTokenStream } from "./TokenStream";
import { ParseTable, EscapeStrictPropertyInitializationParseTable } from "./ParseTable";
import { RuleAction, EscapeStrictPropertyInitializationRuleAction } from "./RuleAction";
import { BadParseException } from "./BadParseException";
import { UnavailableParserInformationException } from "./UnavailableParserInformationException";
import { BadParseSymFileException } from "./BadParseSymFileException";
import { NotDeterministicParseTableException } from "./NotDeterministicParseTableException";

export class DeterministicParser extends Stacks {
    private taking_actions: boolean = false;
    private markerKind: number = 0;

    private monitor?: Monitor | null;
    private START_STATE: number=0;
    private NUM_RULES: number=0;
    private NT_OFFSET: number=0;
    private LA_STATE_OFFSET: number=0;
    private EOFT_SYMBOL: number=0;
    private ACCEPT_ACTION: number=0;
    private ERROR_ACTION: number=0;
    private ERROR_SYMBOL: number = 0;

    private lastToken: number=0;
    private currentAction: number=0;
    private action: IntTuple = new IntTuple(0);

    private tokStream: TokenStream = new EscapeStrictPropertyInitializationTokenStream();
    private prs: ParseTable = new EscapeStrictPropertyInitializationParseTable();
    private ra: RuleAction = new EscapeStrictPropertyInitializationRuleAction();
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
    private tAction1(act: number, sym: number): number {
        act = this.prs.tAction(act, sym);
        return (act > this.LA_STATE_OFFSET
                    ? this.lookahead(act, this.tokStream.peek())
                    : act);
    }
    //
    // Compute the next action defined on act and the next k tokens
    // whose types are stored in the array sym starting at location
    // index. The array sym is a circular buffer. If we reach the last
    // element of sym and we need more lookahead, we proceed to the
    // first element.
    // 
    // assert(sym.length == prs.getMaxLa());
    //
    private tAction(act: number, sym: Int32Array , index: number): number {
       
        act = this.prs.tAction(act, sym[index]);
        while (act > this.LA_STATE_OFFSET) {
            index = ((index + 1) % sym.length);
            act = this.prs.lookAhead(act - this.LA_STATE_OFFSET, sym[index]);
        }
        return act;
    }
    //
    // Process reductions and continue...
    //
    private processReductions(): void {
        do {
            this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
            this.ra.ruleAction(this.currentAction);
            this.currentAction = this.prs.ntAction( this.stateStack[this.stateStackTop],
                                                    this.prs.lhs(this.currentAction));
        } while (this.currentAction <= this.NUM_RULES)
        return;
    }
    //
    // The following functions can be invoked only when the parser is
    // processing actions. Thus, they can be invoked when the parser
    // was entered via the main entry point (parse()). When using
    // the incremental parser (via the entry point parse(int [], int)),
    // an Exception is thrown if any of these functions is invoked?
    // However, note that when parseActions() is invoked after successfully
    // parsing an input with the incremental parser, then they can be invoked.
    //
    public getCurrentRule(): number {
        if (this.taking_actions) {
            return this.currentAction;
        }
        throw new UnavailableParserInformationException();
    }
    public getFirstToken1(): number {
        if (this.taking_actions) {
            return this.getToken(1);
        }
        throw new UnavailableParserInformationException();
    }
    public getFirstToken(i?: number): number {
        if (!i) {
            return this.getFirstToken1();
        }
        if (this.taking_actions) {
            return this.getToken(i);
        }
        throw new UnavailableParserInformationException();
    }
    public getLastToken1(): number {
        if (this.taking_actions) {
            return this.lastToken;
        }
        throw new UnavailableParserInformationException();
    }
    public getLastToken(i?: number): number {
        if (!i) {
            return this.getLastToken1();
        }
        if (this.taking_actions) {
            return (i >= this.prs.rhs(this.currentAction)
                      ? this.lastToken
                      : this.tokStream.getPrevious(this.getToken(i + 1)));
        }
        throw new UnavailableParserInformationException();
    }
    public setMonitor(monitor?: Monitor): void {
        this.monitor = monitor;
    }
    public reset1(): void {
        this.taking_actions = false;
        this.markerKind = 0;
        if (this.action.capacity() !== 0 ) {
            this.action.reset();
        }
    }
    public reset2(tokStream: TokenStream,monitor?: Monitor | null): void {
        this.monitor = monitor;
        this.tokStream = <TokenStream>tokStream;
        this.reset1();
    }
   
    public reset(tokStream?: TokenStream | null , prs?: ParseTable | null, ra?: RuleAction  | null , monitor?: Monitor | null): void {
        if (ra)
            this.ra = ra;
        if (prs)
        {
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
                if (prs.getBacktrack()) throw new NotDeterministicParseTableException();
        }
        if (!tokStream) {
            this.reset1();
            return;
        }
        this.reset2(tokStream, monitor);




    }
   
    constructor(tokStream?: TokenStream | null , prs?: ParseTable | null, ra?: RuleAction | null, monitor?: Monitor | null) {
        super();
        this.reset(tokStream, prs, ra, monitor);
    }

    public parseEntry(marker_kind: number = 0): any {
        //
        // Indicate that we are running the regular parser and that it's
        // ok to use the utility functions to query the parser.
        //
        this.taking_actions = true;
        //
        // Reset the token stream and get the first token.
        //
        this.tokStream.reset();
        this.lastToken = this.tokStream.getPrevious(this.tokStream.peek());
        let curtok: number,
            current_kind: number;
        if (marker_kind == 0) {
            curtok = this.tokStream.getToken();
            current_kind = this.tokStream.getKind(curtok);
        } else {
            curtok = this.lastToken;
            current_kind = marker_kind;
        }
        //
        // Start parsing.
        //
        this.reallocateStacks();// make initial allocation
        this.stateStackTop = -1;
        this.currentAction = this.START_STATE;

        processTerminals: for (; ;) {
            //
            // if the parser needs to stop processing,
            // it may do so here.
            //
            if (this.monitor != null && this. monitor.isCancelled()) {
                this.taking_actions = false; // indicate that we are done
                return null;
            }
            if (++this.stateStackTop >= this.stateStack.length) {
                this.reallocateStacks();
               
            }
            this.stateStack[this.stateStackTop] = this.currentAction;

            this.locationStack[this.stateStackTop] = curtok;

            this.currentAction = this.tAction1(this.currentAction, current_kind);

            if (this.currentAction <= this. NUM_RULES) {
                this. stateStackTop--; // make reduction look like a shift-reduce
                this.  processReductions();
            }
            else if (this.currentAction > this.ERROR_ACTION) {
                this.lastToken = curtok;
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
                this.currentAction -= this.ERROR_ACTION;
                this.processReductions();
            }
            else if (this.currentAction < this.ACCEPT_ACTION) {
                this. lastToken = curtok;
                curtok = this.tokStream.getToken();
                current_kind = this.tokStream.getKind(curtok);
            }
            else break processTerminals;
        }

        this. taking_actions = false; // indicate that we are done

        if (this.currentAction == this.ERROR_ACTION)
            throw new BadParseException(curtok);

        return this.parseStack[marker_kind == 0 ? 0 : 1];
    }
    //
    // This method is invoked when using the parser in an incremental mode
    // using the entry point parse(int [], int).
    //
    public resetParser(): void {
        this.resetParserEntry(0);
    }
    //
    // This method is invoked when using the parser in an incremental mode
    // using the entry point parse(int [], int).
    //
    public resetParserEntry(marker_kind: number): void {
        this.markerKind = marker_kind;
        if (this.stateStack == undefined || this.stateStack.length == 0) {
            this.reallocateStacks();// make initial allocation
        }
        this.stateStackTop = 0;
        this.stateStack[this.stateStackTop] = this.START_STATE;
        if (this.action.capacity() == 0) {
            this.action = new IntTuple(1 << 20);
        } else {
            this.action.reset();
        }
        //
        // Indicate that we are going to run the incremental parser and that
        // it's forbidden to use the utility functions to query the parser.
        //
        this.taking_actions = false;
        if (marker_kind !== 0) {
            let sym: Int32Array = new Int32Array(1);
            sym[0] = this.markerKind;
            this.parse(sym, 0);
        }
    }
    //
    // Find a state in the state stack that has a valid action on ERROR token
    //
    private recoverableState(state: number): boolean {
        for (let k: number = this.prs.asi(state); this.prs.asr(k) !== 0; k++) {
            if (this.prs.asr(k) == this.ERROR_SYMBOL) {
                return true;
            }
        }
        return false;
    }

    //
    // Reset the parser at a point where it can legally process
    // the error token. If we can't do that, reset it to the beginning.
    //
    public errorReset(): void {
        let gate: number = (this.markerKind == 0 ? 0 : 1);
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

    //
    // This is an incremental LALR(k) parser that takes as argument
    // the next k tokens in the input. If these k tokens are valid for
    // the current configuration, it advances past the first of the k
    // tokens and returns either:
    //
    //    . the last transition induced by that token 
    //    . the Accept action
    //
    // If the tokens are not valid, the initial configuration remains
    // unchanged and the Error action is returned.
    //
    // Note that it is the user's responsibility to start the parser in a
    // proper configuration by initially invoking the method resetParser
    // prior to invoking this function.
    //
    public parse(sym: Int32Array, index: number): number
    {

        // assert(sym.length == prs.getMaxLa());

        //
        // First, we save the current length of the action tuple, in
        // case an error is encountered and we need to restore the
        // original configuration.
        //
        // Next, we declara and initialize the variable pos which will
        // be used to indicate the highest useful position in stateStack
        // as we are simulating the actions induced by the next k input
        // terminals in sym.
        //
        // The location stack will be used here as a temporary stack
        // to simulate these actions. We initialize its first useful
        // offset here.
        //
        let save_action_length: number = this.action.size(),
            pos: number = this.stateStackTop,
            location_top: number = this.stateStackTop - 1;

        //
        // When a reduce action is encountered, we compute all REDUCE
        // and associated goto actions induced by the current token.
        // Eventually, a SHIFT, SHIFT-REDUCE, ACCEPT or ERROR action is
        // computed...
        //
        for (this.currentAction = this.tAction(this.stateStack[this.stateStackTop], sym, index);
            this.currentAction <= this.NUM_RULES;
            this.currentAction = this.tAction(this.currentAction, sym, index))
        {
            this.action.add(this.currentAction);
            do {
                location_top -= (this.prs.rhs(this.currentAction) - 1);
                let state: number = (location_top > pos
                    ? this.locationStack[location_top]
                    : this.stateStack[location_top]);
                this.currentAction = this.prs.ntAction(state, this.prs.lhs(this.currentAction));
            } while (this.currentAction <= this.NUM_RULES);

            //
            // ... Update the maximum useful position of the
            // stateSTACK, push goto state into stack, and
            // continue by compute next action on current symbol
            // and reentering the loop...
            //
            pos = pos < location_top ? pos : location_top;
            if (location_top + 1 >= this.locationStack.length) {
                this.reallocateStacks();
            }
            this.locationStack[location_top + 1] = this.currentAction;
  
        }
        //
        // At this point, we have a shift, shift-reduce, accept or error
        // action. stateSTACK contains the configuration of the state stack
        // prior to executing any action on the currenttoken. locationStack
        // contains the configuration of the state stack after executing all
        // reduce actions induced by the current token. The variable pos
        // indicates the highest position in the stateSTACK that is still
        // useful after the reductions are executed.
        //
        if (this.currentAction > this.ERROR_ACTION ||// SHIFT-REDUCE action ?
            this.currentAction < this.ACCEPT_ACTION) // SHIFT action ?
        {
            this.action.add(this.currentAction);
            //
            // If no error was detected, update the state stack with 
            // the info that was temporarily computed in the locationStack.
            //
            this.stateStackTop = location_top + 1;
            for (let i: number = pos + 1; i <= this.stateStackTop; i++) {
                this.stateStack[i] = this.locationStack[i];
            }

            //
            // If we have a shift-reduce, process it as well as
            // the goto-reduce actions that follow it.
            //

            if (this.currentAction > this.ERROR_ACTION) {
                this.currentAction -= this.ERROR_ACTION;
                do {
                    this.stateStackTop -= (this.prs.rhs(this.currentAction) - 1);
                    this.currentAction = this.prs.ntAction(this.stateStack[this.stateStackTop],
                                                           this.prs.lhs(this.currentAction));
                } while (this.currentAction <= this.NUM_RULES);
            }
            //
            // Process the final transition - either a shift action of
            // if we started out with a shift-reduce, the final GOTO
            // action that follows it.
            //
            if(++this.stateStackTop >= this.stateStack.length){
                this.reallocateStacks();
            }
            this.stateStack[this.stateStackTop] = this.currentAction;
        }
        else if (this.currentAction == this.ERROR_ACTION) {
            this.action.reset(save_action_length);// restore original action state.
        }
        return this.currentAction;
    }
    //
    // Now do the final parse of the input based on the actions in
    // the list "action" and the sequence of tokens in the token stream.
    //
    public parseActions(): any
    {
        //
        // Indicate that we are processing actions now (for the incremental
        // parser) and that it's ok to use the utility functions to query the
        // parser.
        //
        this.taking_actions = true;
        this.tokStream.reset();
        this.lastToken = this.tokStream.getPrevious(this.tokStream.peek());
        let curtok: number = (this.markerKind == 0 ? this.tokStream.getToken() : this.lastToken);

        try {
            //
            // Reparse the input...
            //
            this.stateStackTop = -1;
            this.currentAction = this.START_STATE;

            for (let i: number = 0; i < this.action.size(); i++)
            {
                //
                // if the parser needs to stop processing, it may do so here.
                //
                if (this.monitor  && this.monitor.isCancelled()) {
                    this.taking_actions = false;
                    return undefined;
                }
                this.stateStack[++this.stateStackTop] = this.currentAction;
                this.locationStack[this.stateStackTop] = curtok;

                this.currentAction = this.action.get(i);
                if (this.currentAction <= this.NUM_RULES) // a reduce action?
                {
                    this.stateStackTop--;// turn reduction intoshift-reduction
                    this.processReductions();
                }
                else // a shift or shift-reduce action
                {
                    this.lastToken = curtok;
                    curtok = this.tokStream.getToken();
                    if (this.currentAction > this.ERROR_ACTION) {
                        this.currentAction -= this.ERROR_ACTION;
                        this.processReductions();
                    }
                }
            }
        }
        catch ($ex$) // if any exception is thrown, indicate BadParse
        {
            this.taking_actions = false;
            throw new BadParseException(curtok);
        }
        this.taking_actions = false;// indicate that we are done.
        this.action = new IntTuple(0);
        return this.parseStack[this.markerKind == 0 ? 0 : 1];
    }
}

