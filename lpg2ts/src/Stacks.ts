
export class Stacks {
    public   readonly  STACK_INCREMENT: number = 1024;
    public stateStackTop: number;
    public stateStack: Int32Array;
    public locationStack: Int32Array;
    public parseStack: any[];
    public getToken(i: number): number {
        return this.locationStack[this.stateStackTop + (i - 1)];
    }
    public getSym(i: number): any {
        return this.parseStack[this.stateStackTop + (i - 1)];
    }
    public setSym1(ast: any): void {
        this.parseStack[this.stateStackTop] = ast;
    }
    public reallocateStacks(): void {
        var old_stack_length: number = (this.stateStack == null ? 0 : this.stateStack.length), stack_length: number = old_stack_length + this.STACK_INCREMENT;
        if (this.stateStack == null) {
            this.stateStack = new Int32Array(stack_length);
            this.locationStack = new Int32Array(stack_length);
            this.parseStack = new Array<any>(stack_length);
        } else {
            java.lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
            java.lang.System.arraycopy(this.locationStack, 0, this.locationStack = new Int32Array(stack_length), 0, old_stack_length);
            java.lang.System.arraycopy(this.parseStack, 0, this.parseStack = new Array<any>(stack_length), 0, old_stack_length);
        }
        return;
    }
    public reallocateStateStack(): void {
        var old_stack_length: number = (this.stateStack == null ? 0 : this.stateStack.length), stack_length: number = old_stack_length + this.STACK_INCREMENT;
        if (this.stateStack == null) {
            this.stateStack = new Int32Array(stack_length);
        } else {
            java.lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
        }
        return;
    }
    public allocateOtherStacks(): void {
        this.locationStack = new Int32Array(this.stateStack.length);
        this.parseStack = new Array<any>(this.stateStack.length);
        return;
    }
}
;