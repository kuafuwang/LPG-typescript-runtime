
import { ConfigurationElement } from "./ConfigurationElement";
import { StateElement } from "./StateElement";
import { ObjectTuple } from "./ObjectTuple";
import { ParseTable } from "./ParseTable";

export class ConfigurationStack {
    private static TABLE_SIZE: number = 1021;
    private table: ConfigurationElement[] = new Array<ConfigurationElement>(ConfigurationStack.TABLE_SIZE);
    private configuration_stack: ObjectTuple = new ObjectTuple(1 << 12);
    private state_root: StateElement;
    private max_configuration_size: number;
    private stacks_size: number;
    private state_element_size: number;
    public prs: ParseTable;
    constructor(prs: ParseTable) {
        this.prs = prs;
        this.state_element_size++;
        this.state_root = new StateElement();
        this.state_root.parent = null;
        this.state_root.siblings = null;
        this.state_root.children = null;
        this.state_root.number = prs.getStartState();
    }
    public makeStateList(parent: StateElement, stack: Int32Array, index: number, stack_top: number): StateElement {
        for (var i: number = index; i <= stack_top; i++) {
            this.state_element_size++;
            var state: StateElement = new StateElement();
            state.number = stack[i];
            state.parent = parent;
            state.children = null;
            state.siblings = null;
            parent.children = state;
            parent = state;
        }
        return parent;
    }
    public findOrInsertStack(root: StateElement, stack: Int32Array, index: number, stack_top: number): StateElement {
        var state_number: number = stack[index];
        for (var p: StateElement = root; p != null; p = p.siblings) {
            if (p.number == state_number) {
                return (index == stack_top ? p : p.children == null ? this.makeStateList(p, stack, index + 1, stack_top) : this.findOrInsertStack(p.children, stack, index + 1, stack_top));
            }
        }
        this.state_element_size++;
        var node: StateElement = new StateElement();
        node.number = state_number;
        node.parent = root.parent;
        node.children = null;
        node.siblings = root.siblings;
        root.siblings = node;
        return (index == stack_top ? node : this.makeStateList(node, stack, index + 1, stack_top));
    }
    public findConfiguration(stack: Int32Array, stack_top: number, curtok: number): boolean {
        var last_element: StateElement = this.findOrInsertStack(this.state_root, stack, 0, stack_top);
        var hash_address: number = curtok % ConfigurationStack.TABLE_SIZE;
        for (var configuration: ConfigurationElement = this.table[hash_address]; configuration != null; configuration = configuration.next) {
            if (configuration.curtok == curtok && last_element == configuration.last_element) {
                return true;
            }
        }
        return false;
    }
    public push(stack: Int32Array, stack_top: number, conflict_index: number, curtok: number, action_length: number): void {
        var configuration: ConfigurationElement = new ConfigurationElement();
        var hash_address: number = curtok % ConfigurationStack.TABLE_SIZE;
        configuration.next = this.table[hash_address];
        this.table[hash_address] = configuration;
        this.max_configuration_size++;
        configuration.stack_top = stack_top;
        this.stacks_size += (stack_top + 1);
        configuration.last_element = this.findOrInsertStack(this.state_root, stack, 0, stack_top);
        configuration.conflict_index = conflict_index;
        configuration.curtok = curtok;
        configuration.action_length = action_length;
        this.configuration_stack.add(configuration);
        return;
    }
    public pop(): ConfigurationElement {
        var configuration: ConfigurationElement = null;
        if (this.configuration_stack.size() > 0) {
            var index: number = this.configuration_stack.size() - 1;
            configuration = <ConfigurationElement>this.configuration_stack.get(index);
            configuration.act = this.prs.baseAction(configuration.conflict_index++);
            if (this.prs.baseAction(configuration.conflict_index) == 0) {
                this.configuration_stack.reset(index);
            }
        }
        return configuration;
    }
    public top(): ConfigurationElement {
        var configuration: ConfigurationElement = null;
        if (this.configuration_stack.size() > 0) {
            var index: number = this.configuration_stack.size() - 1;
            configuration = <ConfigurationElement>this.configuration_stack.get(index);
            configuration.act = this.prs.baseAction(configuration.conflict_index);
        }
        return configuration;
    }
    public size(): number {
        return this.configuration_stack.size();
    }
    public maxConfigurationSize(): number {
        return this.max_configuration_size;
    }
    public numStateElements(): number {
        return this.state_element_size;
    }
    public stacksSize(): number {
        return this.stacks_size;
    }
}
;