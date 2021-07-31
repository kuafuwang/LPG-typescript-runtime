import { IAst } from "./IAst";

export interface IAstVisitor {
    preVisit(element: IAst): boolean;
    postVisit(element: IAst): void;
}
;