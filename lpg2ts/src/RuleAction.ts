export interface RuleAction {
    ruleAction(ruleNumber: number): void;
};
export  class EscapeStrictPropertyInitializationRuleAction implements RuleAction {
    ruleAction(ruleNumber: number): void {
        throw new Error("Method not implemented.");
    }

};

