import { IToken } from "./IToken";
import { IAstVisitor } from "./IAstVisitor";
import { java as Java } from "./jre";

export interface IAst {
    getNextAst(): IAst;
    getParent(): IAst;
    getLeftIToken(): IToken;
    getRightIToken(): IToken;
    getPrecedingAdjuncts(): IToken[];
    getFollowingAdjuncts(): IToken[];
    getChildren(): Java.util.ArrayList<IAst>;
    getAllChildren(): Java.util.ArrayList<IAst>;
    accept(v: IAstVisitor): void;
};