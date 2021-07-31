export abstract class IMessageHandler {
    public static OFFSET_INDEX: number = 0;
    public static LENGTH_INDEX: number = 1;
    public static START_LINE_INDEX: number = 2;
    public static START_COLUMN_INDEX: number = 3;
    public static END_LINE_INDEX: number = 4;
    public static END_COLUMN_INDEX: number = 5;
    abstract handleMessage(errorCode: number, msgLocation: Int32Array, errorLocation: Int32Array, filename: string, errorInfo: string[]): void;
}
;