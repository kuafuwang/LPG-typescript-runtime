export class UnimplementedTerminalsException extends Error {
    
    public symbols: java.util.ArrayList<any>;
    constructor(symbols: java.util.ArrayList<any>) {
        super();
        this.symbols = symbols;
    }
    public getSymbols(): java.util.ArrayList<any> {
        return this.symbols;
    }
}
;