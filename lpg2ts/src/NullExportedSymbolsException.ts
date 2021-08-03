export class NullExportedSymbolsException extends Error {
    
    private str: string;

    constructor(str ?: string ) {
        super();
        if (!str) {
            this.str = "NullExportedSymbolsException";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
}
;