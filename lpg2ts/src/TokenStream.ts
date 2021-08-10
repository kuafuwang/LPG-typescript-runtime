export interface TokenStream {
    getToken(): number;
    getToken(end_token: number): number;
    getKind(i: number): number;
    getNext(i: number): number;
    getPrevious(i: number): number;
    getName(i: number): string;
    peek(): number;
    reset(i: number): void;
    reset(): void;
    badToken(): number;
    getLine(i: number): number;
    getColumn(i: number): number;
    getEndLine(i: number): number;
    getEndColumn(i: number): number;
    afterEol(i: number): boolean;
    getFileName(): string;
    getStreamLength(): number;
    getFirstRealToken(i: number): number;
    getLastRealToken(i: number): number;
    reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string | string[], errorToken?: number): void;
    //reportError2(errorCode: number, leftToken: number,  rightToken: number, errorInfo: string | string[]): void;
    //reportError3(errorCode: number, leftToken: number, rightToken: number, errorInfo: string[]): void;
    //reportError4(errorCode: number, leftToken: number, errorToken: number, rightToken: number, errorInfo: string[]): void;
}

export  class EscapeStrictPropertyInitializationTokenStream implements TokenStream {
    getToken(): number;
    getToken(end_token: number): number;
    getToken(end_token?: any): number {
        throw new Error("Method not implemented.");
    }
    getKind(i: number): number {
        throw new Error("Method not implemented.");
    }
    getNext(i: number): number {
        throw new Error("Method not implemented.");
    }
    getPrevious(i: number): number {
        throw new Error("Method not implemented.");
    }
    getName(i: number): string {
        throw new Error("Method not implemented.");
    }
    peek(): number {
        throw new Error("Method not implemented.");
    }
    reset(i: number): void;
    reset(): void;
    reset(i?: any): void {
        throw new Error("Method not implemented.");
    }
    badToken(): number {
        throw new Error("Method not implemented.");
    }
    getLine(i: number): number {
        throw new Error("Method not implemented.");
    }
    getColumn(i: number): number {
        throw new Error("Method not implemented.");
    }
    getEndLine(i: number): number {
        throw new Error("Method not implemented.");
    }
    getEndColumn(i: number): number {
        throw new Error("Method not implemented.");
    }
    afterEol(i: number): boolean {
        throw new Error("Method not implemented.");
    }
    getFileName(): string {
        throw new Error("Method not implemented.");
    }
    getStreamLength(): number {
        throw new Error("Method not implemented.");
    }
    getFirstRealToken(i: number): number {
        throw new Error("Method not implemented.");
    }
    getLastRealToken(i: number): number {
        throw new Error("Method not implemented.");
    }
    reportError(errorCode: number, leftToken: number, rightToken: number, errorInfo: string | string[], errorToken?: number): void {
        throw new Error("Method not implemented.");
    }
}
