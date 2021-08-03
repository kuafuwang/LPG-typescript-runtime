export class UndefinedEofSymbolException extends Error {
    
    private str: string;

    constructor(str?: string) {
        super();
        if (!str) {
            this.str = "UndefinedEofSymbolException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;