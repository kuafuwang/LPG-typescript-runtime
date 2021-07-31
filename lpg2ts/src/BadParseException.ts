export class BadParseException extends Error
{
    private static serialVersionUID: number = 1;
    public error_token: number;
    constructor(error_token: number) {
        super();
        this.error_token = error_token;
    }
};