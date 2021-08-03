export class NotDeterministicParseTableException extends Error {
  
    private str: string;

    constructor(str?: string) {
        super();
        if (!str) {
            this.str = "NotDeterministicParseTableException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;