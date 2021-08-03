import { IAst } from "./IAst";
import { java as Java } from "./jre";

export interface IAbstractArrayList<T extends IAst> {
    size(): number;
    getElementAt(i: number): T;
    getList(): Java.util.List<T>;
    add(elt: T): void;
    getAllChildren(): Java.util.List<T>;
}
;