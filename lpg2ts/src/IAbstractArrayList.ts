import { IAst } from "./IAst";
import { Lpg as Lpg } from "./Utils";

export interface IAbstractArrayList<T extends IAst> {
    size(): number;
    getElementAt(i: number): T;
    getList(): Lpg.Util.List<T>;
    add(elt: T): void;
    getAllChildren(): Lpg.Util.List<T>;
}
;