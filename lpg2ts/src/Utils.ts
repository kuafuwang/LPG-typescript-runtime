export namespace Lpg {
    export namespace Lang {
 
        export namespace System{

            export    function arraycopy(src: any[] | Float64Array | Int32Array, srcPos: number, dest: any[] | Float64Array | Int32Array, destPos: number, numElements: number): void {
                    if((dest instanceof Float64Array || dest instanceof Int32Array)
                && (src instanceof Float64Array || src instanceof Int32Array)) {
                    if (numElements == src.length) {
                        dest.set(src, destPos);
                    } else {
                        dest.set(src.subarray(srcPos, srcPos + numElements), destPos);
                    }
                } else {
                    for (let i = 0; i < numElements; i++) {
                        dest[destPos + i] = src[srcPos + i];
                    }
                }
            }
            export class Out {
                public static print(message?: any, ...optionalParams: any[]): void {
                   console.log(message,optionalParams);
               }
                public static  println(message?: any, ...optionalParams: any[]): void {
                    console.log(message, optionalParams);
                    console.log("\n");
               }
            }
        };
    }

    export namespace Util {
   
  
        export interface Iterator<E> {
            hasNext(): boolean;
            next(): E;
        }


        export class Collections {

            public static swap(list: List<any>, i: number, j: number) {
                const l = list;
                l.set(i, l.set(j, l.get(i)));
            }

        }

        export interface Collection<E> {
            add(val: E): void;
            addAll(vals: Collection<E>): void;
            get(index: number): E;
            remove(o: any): any;
            clear(): void;
            isEmpty(): boolean;
            size(): number;
            contains(o: E): boolean;
            toArray<E1>(a: Array<E1>): E[];
            iterator(): Iterator<E>;
            containsAll(c: Collection<any>): boolean;
            addAll(c: Collection<any>): boolean;
            removeAll(c: Collection<any>): boolean;

        }

        export interface List<E> extends Collection<E> {
            add(elem: E): void;
            add(index: number, elem: E): void;
            poll(): E | undefined;
            addAll(c: Collection<E>): boolean;
            addAll(index: number, c: Collection<E>): boolean;
            get(index: number): E;
            set(index: number, element: E): E;
            indexOf(o: E): number;
            lastIndexOf(o: E): number;
            remove(index: number): E;
        }


        export class Itr<E> implements Iterator<E> {
            public cursor: number = 0;
            public lastRet: number = -1;
            protected list: Collection<E>;

            constructor(list: Collection<E>) {
                this.list = list;
            }

            public hasNext(): boolean {
                return this.cursor != this.list.size();
            }

            public next(): E {
                try {
                    let i: number = this.cursor;
                    let next: E = this.list.get(i);
                    this.lastRet = i;
                    this.cursor = i + 1;
                    return next;
                } catch ($ex$) {
                    if ($ex$ instanceof Error) {
                        let e: Error = <Error>$ex$;
                        throw new Error("no such element exception");
                    } else {
                        throw $ex$;
                    }
                }
            }
        }

  
        export class AbstractList<E> implements List<E> {
            public   content: E[] = [];

            addAll(index: any, vals?: any): boolean {
                let tempArray = vals.toArray(null);
                for (let i = 0; i < tempArray.length; i++) {
                    this.content.push(tempArray[i]);
                }
                return false;
            }

            clear() {
                this.content = [];
            }

            poll(): E | undefined{
                return this.content.shift();
            }

            remove(indexOrElem: any): any {
                this.content.splice(indexOrElem, 1);
                return true;
            }

            removeAll(): boolean {
                this.content = [];
                return true;
            }

            toArray<E1>(a: Array<E1>): E[] {
               
                return this.content;;
            }

            size(): number {
                return this.content.length;
            }

            add(index: any, elem?: E) {
                if (typeof elem !== 'undefined') {
                    this.content.splice(index, 0, elem);
                } else {
                    this.content.push(index);
                }
            }

            get(index: number): E {
                return this.content[index];
            }

            contains(val: E): boolean {
                return this.content.indexOf(val) != -1;
            }

            containsAll(elems: Collection<E>): boolean {
                return false;
            }

            isEmpty(): boolean {
                return this.content.length == 0;
            }

            set(index: number, element: E): E {
                this.content[index] = element;
                return element;
            }

            indexOf(element: E): number {
                return this.content.indexOf(element);
            }

            lastIndexOf(element: E): number {
                return this.content.lastIndexOf(element);
            }

            iterator(): Iterator<E> {
                return new Itr(this);
            }

        }

    
        export class ArrayList<E> extends AbstractList<E> {
        }

    }
}

function arrayInstanceOf(arr: any, arg: Function): boolean {
    if (!(arr instanceof Array)) {
        return false;
    } else {
        if (arr.length === 0) {
            return true;
        } else {
            return (arr[0] instanceof arg);
        }
    }
}

