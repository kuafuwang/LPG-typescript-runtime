import { java as Java } from "./jre";

export class IntTuple {
    private array: Int32Array;
    private top: number;

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
        var i: number = this.top++;
        if (i >= this.array.length) {
            Java.lang.System.arraycopy(this.array, 0, this.array = new Int32Array(i * 2), 0, i);
        }
        return i;
    }
    public add(element: number): void {
        var i: number = this.nextIndex();
        this.array[i] = element;
    }

    constructor(estimate: number = 10) {
        this.array = new Int32Array(estimate);
    }
}
;