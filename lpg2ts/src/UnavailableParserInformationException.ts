export class UnavailableParserInformationException extends Error {
    
    private str: string;

    constructor(str?: string ) {
        super();
        if (!str) {
            this.str = "Unavailable parser Information Exception";
        } else {
            this.str = str;
        }
       
    }
    public toString(): string {
        return this.str;
    }
}
;