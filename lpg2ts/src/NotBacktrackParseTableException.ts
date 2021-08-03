export class NotBacktrackParseTableException extends Error {
  
    private str: string;

    constructor(str?:string) {
        super();
        if (!str) {
            this.str = "NotBacktrackParseTableException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;