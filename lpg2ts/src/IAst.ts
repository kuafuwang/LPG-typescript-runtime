import { IToken } from "./IToken";
import { IAstVisitor } from "./IAstVisitor";

export interface IAst {
    getNextAst(): IAst;
    getParent(): IAst;
    getLeftIToken(): IToken;
    getRightIToken(): IToken;
    getPrecedingAdjuncts(): IToken[];
    getFollowingAdjuncts(): IToken[];
    getChildren(): java.util.ArrayList<IAst>;
    getAllChildren(): java.util.ArrayList<IAst>;
    accept(v: IAstVisitor): void;
};