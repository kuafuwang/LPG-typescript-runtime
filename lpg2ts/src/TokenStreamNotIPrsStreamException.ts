export class TokenStreamNotIPrsStreamException extends Error {
    private static serialVersionUID: number = 1;
    private str: string;
    constructor() {
        this.str = "TokenStreamNotIPrsStreamException";
    }
    constructor(str: string) {
        this.str = str;
    }
    public toString(): string {
        return this.str;
    }
}
;