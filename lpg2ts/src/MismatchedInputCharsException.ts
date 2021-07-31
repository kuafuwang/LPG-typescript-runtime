export class MismatchedInputCharsException extends Error {
    private static serialVersionUID: number = 1;
    private str: string;
  
    constructor(str: string = null) {
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