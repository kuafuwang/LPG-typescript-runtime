import { Lpg as Lpg } from "./Utils";

export class Stacks {
    public    readonly  STACK_INCREMENT: number = 1024;
    public stateStackTop: number=0;
    public stateStack: Int32Array = new Int32Array(0);
    public locationStack: Int32Array = new Int32Array(0);
    public parseStack: any[]= new Array<any>();
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
        let old_stack_length: number = (this.stateStack == undefined ? 0 : this.stateStack.length), stack_length: number = old_stack_length + this.STACK_INCREMENT;
        if (this.stateStack == undefined) {
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
    public reallocateStateStack(): void {
        let old_stack_length: number = (this.stateStack == undefined ? 0 : this.stateStack.length), stack_length: number = old_stack_length + this.STACK_INCREMENT;
        if (this.stateStack == undefined) {
            this.stateStack = new Int32Array(stack_length);
        } else {
            Lpg.Lang.System.arraycopy(this.stateStack, 0, this.stateStack = new Int32Array(stack_length), 0, old_stack_length);
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