import { Lpg as Lpg } from "./Utils";

export class IntTuple {
    private array: Int32Array;
    private top: number=0;

    public reset(n: number = 0): void {
        this.top = n;
    }
    public size(): number {
        return this.top;
    }
    public get(i: number): number {
        return this.array[i];
    }
    public set(i: number, element: number): void {
        this.array[i] = element;
    }
    public nextIndex(): number {
        let i: number = this.top++;
        if (i >= this.array.length) {
            Lpg.Lang.System.arraycopy(this.array, 0, this.array = new Int32Array(i * 2), 0, i);
        }
        return i;
    }
    public add(element: number): void {
        let i: number = this.nextIndex();
        this.array[i] = element;
    }
    public capacity(): number {
        return this.array.length;
    }
    constructor(estimate: number = 10) {
        this.array = new Int32Array(estimate);
    }
}
;