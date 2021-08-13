import { Lpg as Lpg } from "./Utils";
//
// This Tuple class can be used to construct a dynamic
// array of integers. The space for the array is allocated in
// blocks of size 2**LOG_BLKSIZE. In declaring a tuple the user
// may specify an estimate of how many elements he expects.
// Based on that estimate, suitable values will be calculated
// for log_blksize and base_increment. If these estimates are
// found to be off later, more space will be allocated.
//
export class ObjectTuple {

    public array: any[];
    public top: number;
    needInterger() : void{
        throw Error(" ObjectTuple  need interger index")
    }
    //
    // This function is used to reset the size of a dynamic array without
    // allocating or deallocting space. It may be invoked with an integer
    // argument n which indicates the new size or with no argument which
    // indicates that the size should be reset to 0.
    //
    public reset(n: number=0): void {
        if(!Number.isInteger(n)){
            this.needInterger();
        }
        this.top = n;
    }
    public capacity(): number {
        return this.array.length;
    }
    //
    // Return size of the dynamic array.
    //
    public size(): number {
        return this.top;
    }

    //
    // Return a reference to the ith element of the dynamic array.
    //
    // Note that no check is made here to ensure that 0 <= i < top.
    // Such a check might be useful for debugging and a range exception
    // should be thrown if it yields true.
    //
    public get(i: number): any {
        if(!Number.isInteger(i)){
            this.needInterger();
        }
        return this.array[i];
    }

    //
    // Insert an element in the dynamic array at the location indicated.
    //
    public set(i: number, element: any): void {
        if(!Number.isInteger(i)){
            this.needInterger();
        }
        this.array[i] = element;
    }

    //
    // Add an element to the dynamic array and return the top index.
    //
    public nextIndex(): number {
        let i: number = this.top++;
        if (i >= this.array.length) {
            Lpg.Lang.System.arraycopy(this.array, 0, this.array = new Array<any>(i * 2), 0, i);
        }
        return i;
    }

    //
    // Add an element to the dynamic array and return a reference to
    // that new element.
    //
    public add(element: any): void {
        let i: number = this.nextIndex();
        this.array[i] = element;
    }

    //
    // Constructor of a Tuple
    //
    constructor(estimate: number = 10) {
        this.top = 0;
        this.array = new Array<any>(estimate);
    }
}
;