import { Lpg as Lpg } from "./Utils";

export class UnimplementedTerminalsException extends Error {
    
    public symbols: Lpg.Util.ArrayList<any>;
    constructor(symbols: Lpg.Util.ArrayList<any>) {
        super();
        this.symbols = symbols;
    }
    public getSymbols(): Lpg.Util.ArrayList<any> {
        return this.symbols;
    }
}
;