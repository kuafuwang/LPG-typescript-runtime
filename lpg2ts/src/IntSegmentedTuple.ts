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
export class IntSegmentedTuple {
    private top: number=0;
    private _size: number = 0;

    private log_blksize: number = 3;
    private base_size: number = 4;

    private base: Array<Int32Array>;

    //
    // Allocate another block of storage for the dynamic array.
    //
    private allocateMoreSpace(): void {
        //
        // The variable size always indicates the maximum number of
        // elements that has been allocated for the array.
        // Initially, it is set to 0 to indicate that the array is empty.
        // The pool of available elements is divided into segments of size
        // 2**log_blksize each. Each segment is pointed to by a slot in
        // the array base.
        //
        // By dividing size by the size of the segment we obtain the
        // index for the next segment in base. If base is full, it is
        // reallocated.
        //
        //
        let k: number = this._size >> this.log_blksize; /* which segment? */

        //
        // If the base is overflowed, reallocate it and initialize the new
        // elements to NULL.
        // Otherwise, allocate a new segment and place its adjusted address
        // in base[k]. The adjustment allows us to index the segment directly,
        // instead of having to perform a subtraction for each reference.
        // See operator[] below.
        //
        //
        if (k === this.base_size) {
            this.base_size *= 2;
            Lpg.Lang.System.arraycopy(this.base, 0, this.base = new Array<Int32Array>(this.base_size), 0, k);
        }
        this.base[k] = new Int32Array(1 << this.log_blksize);

        //
        // Finally, we update SIZE.
        //
        this._size += (1 << this.log_blksize);

        return;
    }

    //
    // This function is invoked with an integer argument n. It ensures
    // that enough space is allocated for n elements in the dynamic array.
    // I.e., that the array will be indexable in the range  (0..n-1)
    //
    // Note that this function can be used as a garbage collector.  When
    // invoked with no argument(or 0), it frees up all dynamic space that
    // was allocated for the array.
    //
    public resize(n: number = 0): void {
        //
        // If array did not previously contain enough space, allocate
        // the necessary additional space. Otherwise, if the array had
        // more blocks than are needed, release the extra blocks.
        //
        if (n > this._size) {
            do {
                this.allocateMoreSpace();
            } while (n > this._size)
        }
        this.top = n;
    }

    //
    // This function is used to reset the size of a dynamic array without
    // allocating or deallocting space. It may be invoked with an integer
    // argument n which indicates the new size or with no argument which
    // indicates that the size should be reset to 0.
    //
    public reset(n: number = 0): void {
        this.top = n;
    }

    public capacity(): number {
        return this.base.length;
    }

    //
    // Return size of the dynamic array.
    //
    public size(): number {
        return this.top;
    }

    //
    // Can the tuple be indexed with i?
    //
    public outOfRange(i: number): boolean {
        return (i < 0 || i >= this.top);
    }

    //
    // Return a reference to the ith element of the dynamic array.
    //
    // Note that no check is made here to ensure that 0 <= i < top.
    // Such a check might be useful for debugging and a range exception
    // should be thrown if it yields true.
    //
    public get(i: number): number {
        return this.base[i >> this.log_blksize][i % (1 << this.log_blksize)];
    }

    //
    // Insert an element in the dynamic array at the location indicated.
    //
    public set(i: number, element: number): void {
        this.base[i >> this.log_blksize][i % (1 << this.log_blksize)] = element;
    }

    //
    // Add an element to the dynamic array and return the top index.
    //
    public NextIndex(): number {
        let i: number = this.top++;
        if (i === this._size) {
            this.allocateMoreSpace();
        }
        return i;
    }

    //
    // Add an element to the dynamic array and return a reference to
    // that new element.
    //
    public add(element: number): void {
        let i: number = this.NextIndex();
        this.base[i >> this.log_blksize][i % (1 << this.log_blksize)] = element;
    }


    //
    // If array is sorted, this function will find the index location
    // of a given element if it is contained in the array. Otherwise, it
    // will return the negation of the index of the element prior to
    // which the new element would be inserted in the array.
    //
    public binarySearch(element: number): number {
        let low: number = 0,
            high: number = this.top;
        while (high > low) {
            let mid: number = (high + low) / 2,
                mid_element: number = this.get(mid);
            if (element === mid_element) {
                return mid;
            } else {
                if (element < mid_element) {
                    high = mid;
                } else {
                    low = mid + 1;
                }
            }
        }
        return -low;
    }

    constructor(log_blksize_?: number, base_size_?: number) {

        if(log_blksize_)
            this.log_blksize = log_blksize_;
        if (base_size_)
            this.base_size = (base_size_ <= 0 ? 4 : base_size_);

        this.base = new Array<Int32Array>(this.base_size);
    }
}
;