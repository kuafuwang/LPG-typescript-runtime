export class BadParseException extends Error
{
    
    public errorToken: number;
    constructor(errorToken: number) {
        super();
        this.errorToken = errorToken;
    }
};