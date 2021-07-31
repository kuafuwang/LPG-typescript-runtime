import { IAst } from "./IAst";

export interface IAbstractArrayList<T extends IAst> {
    size(): number;
    getElementAt(i: number): T;
    getList(): java.util.List<T>;
    add(elt: T): void;
    getAllChildren(): java.util.List<T>;
}
;