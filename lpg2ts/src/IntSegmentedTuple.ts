import { Lpg as Lpg } from "./Utils";

export class IntSegmentedTuple {
    private top: number=0;
    private _size: number=0;
    private log_blksize: number = 3;
    private base_size: number = 4;
    private base: Array<Int32Array>;
    private allocateMoreSpace(): void {
        let k: number = this._size >> this.log_blksize;
        if (k == this.base_size) {
            this.base_size *= 2;
            Lpg.Lang.System.arraycopy(this.base, 0, this.base = new Array<Int32Array>(this.base_size), 0, k);
        }
        this.base[k] = new Int32Array(1 << this.log_blksize);
        this._size += (1 << this.log_blksize);
        return;
    }

    public resize(n: number = 0): void {
        if (n > this._size) {
            do {
                this.allocateMoreSpace();
            } while (n > this._size)
        }
        this.top = n;
    }

    public reset(n: number = 0): void {
        this.top = n;
    }
    public size(): number {
        return this.top;
    }
    public outOfRange(i: number): boolean {
        return (i < 0 || i >= this.top);
    }
    public get(i: number): number {
        return this.base[i >> this.log_blksize][i % (1 << this.log_blksize)];
    }
    public set(i: number, element: number): void {
        this.base[i >> this.log_blksize][i % (1 << this.log_blksize)] = element;
    }
    public NextIndex(): number {
        let i: number = this.top++;
        if (i == this._size) {
            this.allocateMoreSpace();
        }
        return i;
    }
    public add(element: number): void {
        let i: number = this.NextIndex();
        this.base[i >> this.log_blksize][i % (1 << this.log_blksize)] = element;
    }
    public binarySearch(element: number): number {
        let low: number = 0, high: number = this.top;
        while (high > low) {
            let mid: number = (high + low) / 2, mid_element: number = this.get(mid);
            if (element == mid_element) {
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

    constructor(log_blksize_: number = 0, base_size_: number = 0) {
        this.log_blksize = log_blksize_;
        this.base_size = (base_size_ <= 0 ? 4 : base_size_);
        this.base = new Array<Int32Array>(this.base_size);
    }
}
;