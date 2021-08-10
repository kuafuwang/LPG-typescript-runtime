import { Lpg as Lpg } from "./Utils";

export class ObjectTuple {
    public array: any[];
    public top: number;
  
    public reset(n: number=0): void {
        this.top = n;
    }
    public size(): number {
        return this.top;
    }
    public get(i: number): any {
        return this.array[i];
    }
    public set(i: number, element: any): void {
        this.array[i] = element;
    }
    public nextIndex(): number {
        let i: number = this.top++;
        if (i >= this.array.length) {
            Lpg.Lang.System.arraycopy(this.array, 0, this.array = new Array<any>(i * 2), 0, i);
        }
        return i;
    }
    public add(element: any): void {
        let i: number = this.nextIndex();
        this.array[i] = element;
    }
   
    constructor(estimate: number = 10) {
        this.top = 0;
        this.array = new Array<any>(estimate);
    }
}
;