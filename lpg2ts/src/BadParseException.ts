export class BadParseException extends Error
{
    
    public error_token: number;
    constructor(errorToken: number) {
        super();
        this.error_token = errorToken;
    }
};