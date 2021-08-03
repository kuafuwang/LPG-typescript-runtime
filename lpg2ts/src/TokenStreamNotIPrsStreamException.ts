export class TokenStreamNotIPrsStreamException extends Error {
    
    private str: string;
 
    constructor(str?: string ) {
        super();
        if (!str) {
            this.str = "TokenStreamNotIPrsStreamException";
        } else {
            this.str = str;
        }

    }

    public toString(): string {
        return this.str;
    }
}
;