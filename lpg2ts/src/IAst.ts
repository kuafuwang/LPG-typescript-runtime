
import { IAstVisitor } from "./IAstVisitor";
import { Lpg as Lpg } from "./Utils";
import { IToken } from "./Protocol";

export interface IAst {
    getNextAst(): IAst;
    getParent(): IAst;

    getLeftIToken(): IToken;
    getRightIToken(): IToken;

    getPrecedingAdjuncts(): IToken[];
    getFollowingAdjuncts(): IToken[];

    getChildren(): Lpg.Util.ArrayList<IAst>;
    getAllChildren(): Lpg.Util.ArrayList<IAst>;

    accept(v: IAstVisitor): void;
};