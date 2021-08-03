export class NullTerminalSymbolsException extends Error {
    
    private str: string;
 
    constructor(str?: string ) {
        super();
        if (!str) {
            this.str = "NullTerminalSymbolsException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;