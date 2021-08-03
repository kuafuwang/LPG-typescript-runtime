export class MismatchedInputCharsException extends Error {
  
    private str: string;
  
    constructor(str ?: string) {
        super();
        if (!str) {
            this.str = "MismatchedInputCharsException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;