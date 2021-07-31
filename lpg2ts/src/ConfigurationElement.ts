import { StateElement } from "./StateElement";

export class ConfigurationElement {
    public next: ConfigurationElement;
    public last_element: StateElement;
    public stack_top: number;
    public action_length: number;
    public conflict_index: number;
    public curtok: number;
    public act: number;
    public retrieveStack(stack: Int32Array): void {
        var tail: StateElement = this.last_element;
        for (var i: number = this.stack_top; i >= 0; i--) {
            stack[i] = tail.number;
            tail = tail.parent;
        }
        return;
    }
}
;