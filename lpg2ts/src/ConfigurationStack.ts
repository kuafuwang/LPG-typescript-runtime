
import { ConfigurationElement } from "./ConfigurationElement";
import { StateElement } from "./StateElement";
import { ObjectTuple } from "./ObjectTuple";
import { ParseTable } from "./ParseTable";

export class ConfigurationStack {

    private static readonly  TABLE_SIZE: number = 1021;// 1021 is a prime
    private table: ConfigurationElement[] = new Array<ConfigurationElement>(ConfigurationStack.TABLE_SIZE);
    private configuration_stack: ObjectTuple = new ObjectTuple(1 << 12);
    private state_root: StateElement;

    private max_configuration_size: number=0;
    private stacks_size: number=0;
    private state_element_size: number = 0;

    public prs: ParseTable;

    constructor(prs: ParseTable) {
        this.prs = prs;
        this.state_element_size++;
        this.state_root = new StateElement();
        //this.state_root.parent = undefined;
        //this.state_root.siblings = undefined;
        //this.state_root.children = undefined;
        this.state_root.number = prs.getStartState();
    }
    public makeStateList(parent: StateElement, stack: Int32Array, index: number, stack_top: number): StateElement {
        for (let i: number = index; i <= stack_top; i++) {

            this.state_element_size++;

            let state: StateElement = new StateElement();

            state.number = stack[i];
            state.parent = parent;

            //state.children = undefined;
            //state.siblings = undefined;

            parent.children = state;
            parent = state;
        }
        return parent;
    }
    public findOrInsertStack(root: StateElement, stack: Int32Array, index: number, stack_top: number): StateElement {
        let state_number: number = stack[index];
        for (let p: StateElement | undefined = root; ; p = p.siblings) {
            if (!p)
                break;
            if (p.number == state_number) {
                return (index == stack_top ? p : p.children == undefined ? this.makeStateList(p, stack, index + 1, stack_top) : this.findOrInsertStack(p.children, stack, index + 1, stack_top));
            }
        }
        this.state_element_size++;

        let node: StateElement = new StateElement();
        node.number = state_number;
        node.parent = root.parent;
     /*   node.children = undefined;*/
        node.siblings = root.siblings;
        root.siblings = node;

        return (index == stack_top ? node : this.makeStateList(node, stack, index + 1, stack_top));
    }
    public findConfiguration(stack: Int32Array, stack_top: number, curtok: number): boolean {

        let last_element: StateElement = this.findOrInsertStack(this.state_root, stack, 0, stack_top);

        let hash_address: number = curtok % ConfigurationStack.TABLE_SIZE;

        for (let configuration: ConfigurationElement | undefined = this.table[hash_address]; ; ) {
            if (configuration) {
                if (configuration.curtok == curtok && last_element == configuration.last_element) {
                    return true;
                }
                configuration = configuration.next;
            } else {
                break;
            }
        }
        return false;
    }


    public push(stack: Int32Array, stack_top: number, conflict_index: number, curtok: number, action_length: number): void {

        let configuration: ConfigurationElement = new ConfigurationElement();
        let hash_address: number = curtok % ConfigurationStack.TABLE_SIZE;

        configuration.next = this.table[hash_address];

        this.table[hash_address] = configuration;
        this.max_configuration_size++;// keep track of number of configurations

        configuration.stack_top = stack_top;
        this.stacks_size += (stack_top + 1); // keep track of number of stack elements processed
        configuration.last_element = this.findOrInsertStack(this.state_root, stack, 0, stack_top);
        configuration.conflict_index = conflict_index;
        configuration.curtok = curtok;
        configuration.action_length = action_length;

        this.configuration_stack.add(configuration);
        return;
    }
    public pop(): ConfigurationElement  | undefined{
     
        if (this.configuration_stack.size() > 0) {
            let index: number = this.configuration_stack.size() - 1;
           let  configuration = <ConfigurationElement>this.configuration_stack.get(index);
            configuration.act = this.prs.baseAction(configuration.conflict_index++);
            if (this.prs.baseAction(configuration.conflict_index) == 0) {
                this.configuration_stack.reset(index);
            }
            return configuration;
        } else {
            return  undefined;
        }
    }
    public top(): ConfigurationElement  | undefined{
       
        if (this.configuration_stack.size() > 0) {
           
            let index: number = this.configuration_stack.size() - 1;
            let  configuration = <ConfigurationElement>this.configuration_stack.get(index);
            configuration.act = this.prs.baseAction(configuration.conflict_index);
            return configuration;
        } else {
            return undefined;
        }
       
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