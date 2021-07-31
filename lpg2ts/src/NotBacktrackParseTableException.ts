export class NotBacktrackParseTableException extends Error {
    private static serialVersionUID: number = 1;
    private str: string;

    constructor(str: string = null) {
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