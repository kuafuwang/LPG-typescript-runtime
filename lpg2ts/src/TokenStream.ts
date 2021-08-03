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