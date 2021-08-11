import { Lpg as Lpg } from "./Utils";

export class Stacks {
    public    readonly  STACK_INCREMENT: number = 1024;
    public stateStackTop: number=0;
    public stateStack: Int32Array = new Int32Array(0);
    public locationStack: Int32Array = new Int32Array(0);
    public parseStack: any[] = new Array<any>();

    //
    // Given a rule of the form     A ::= x1 x2 ... xn     n > 0
    //
    // the function GETTOKEN(i) yields the symbol xi, if xi is a terminal
    // or ti, if xi is a nonterminal that produced a string of the form
    // xi => ti w.
    //
    public getToken(i: number): number {
        return this.locationStack[this.stateStackTop + (i - 1)];
    }

    //
    // Given a rule of the form     A ::= x1 x2 ... xn     n > 0
    //
    // The function GETSYM(i) yields the AST subtree associated with symbol
    // xi. NOTE that if xi is a terminal, GETSYM(i) is undefined ! (However,
    // see token_action below.)
    //
    // setSYM1(Object ast) is a function that allows us to assign an AST
    // tree to GETSYM(1).
    //
    public getSym(i: number): any {
        return this.parseStack[this.stateStackTop + (i - 1)];
    }
    public setSym1(ast: any): void {
        this.parseStack[this.stateStackTop] = ast;
    }

    //
    // Allocate or reallocate all the stacks. Their sizes should always be the same.
    //
    public reallocateStacks(): void {
        let old_stack_length: number = (this.stateStack == undefined ? 0 : this.stateStack.length),
            stack_length: number = old_stack_length + this.STACK_INCREMENT;

        if (!this.stateStack || this.stateStack.length === 0) {
            this.stateStack = new Int32Array(stack_length);
            this.locationStack = new Int32Array(stack_length);
            this.parseStack = new Array<any>(stack_length);
        } else {
            Lpg.Lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(stack_length), 0, old_stack_length);
            Lpg.Lang.System.arraycopy(this.parseStack, 0, this.parseStack = new Array<any>(stack_length), 0, old_stack_length);
        }
        return;
    }

    //
    // Allocate or reallocate the state stack only.
    //
    public reallocateStateStack(): void {
        let old_stack_length: number = (this.stateStack == undefined ? 0 : this.stateStack.length),
            stack_length: number = old_stack_length + this.STACK_INCREMENT;
        if (this.stateStack == undefined || this.stateStack.length === 0) {
            this.stateStack = new Int32Array(stack_length);
        } else {
            Lpg.Lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
        }
        return;
    }
    //
    // Allocate location and parse stacks using the size of the state stack.
    //
    public allocateOtherStacks(): void {
        this.locationStack = new Int32Array(this.stateStack.length);
        this.parseStack = new Array<any>(this.stateStack.length);
        return;
    }
}
;