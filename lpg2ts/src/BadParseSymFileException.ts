export class BadParseSymFileException extends Error {
    
    private str: string;
    
    constructor(str?: string) {
        super();
        
        if (!str) {
            this.str = "BadParseSymFileException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;