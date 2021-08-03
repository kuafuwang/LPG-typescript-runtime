import { java as Java } from "./jre";

export class UnimplementedTerminalsException extends Error {
    
    public symbols: Java.util.ArrayList<any>;
    constructor(symbols: Java.util.ArrayList<any>) {
        super();
        this.symbols = symbols;
    }
    public getSymbols(): Java.util.ArrayList<any> {
        return this.symbols;
    }
}
;