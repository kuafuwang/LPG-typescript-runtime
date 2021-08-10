import { StateElement } from "./StateElement";

export class ConfigurationElement {
    public next?: ConfigurationElement;
    public last_element?: StateElement;
    public stack_top: number=0;
    public action_length: number=0;
    public conflict_index: number=0;
    public curtok: number=0;
    public act: number=0;
    public retrieveStack(stack: Int32Array): void {

        let tail = this.last_element;
        for (let i: number = this.stack_top; i >= 0; i--) {
            if (!tail) return;
            stack[i] = tail.number;
            tail = tail.parent;
        }
        return;
    }
}
;