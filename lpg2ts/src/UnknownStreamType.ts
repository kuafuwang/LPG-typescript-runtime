export class UnknownStreamType extends Error {
    
    private str: string;
   
    constructor(str?: string) {
        super();
        if (!str) {
            this.str = "UnknownStreamType";
        } else {
            this.str = str;
        }
    }
    public toString(): string {
        return this.str;
    }
};