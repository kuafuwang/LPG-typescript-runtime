
////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2007 IBM Corporation.
// All rights reserved. This program and the accompanying materials
// are made available under the terms of the Eclipse Public License v1.0
// which accompanies this distribution, and is available at
// http://www.eclipse.org/legal/epl-v10.html
//
//Contributors:
//    Philippe Charles (pcharles@us.ibm.com) - initial API and implementation

////////////////////////////////////////////////////////////////////////////////

import { ParseTable } from "../../src";
import { JavaKWLexersym } from "./JavaKWLexersym";
export class JavaKWLexerprs implements ParseTable {
    public   readonly ERROR_SYMBOL : number = 0;
    public   getErrorSymbol() : number { return this.ERROR_SYMBOL; }

    public   readonly SCOPE_UBOUND : number = 0;
    public   getScopeUbound() : number { return this.SCOPE_UBOUND; }

    public   readonly SCOPE_SIZE : number = 0;
    public   getScopeSize() : number { return this.SCOPE_SIZE; }

    public   readonly MAX_NAME_LENGTH : number = 0;
    public   getMaxNameLength() : number { return this.MAX_NAME_LENGTH; }

    public   readonly NUM_STATES : number = 242;
    public   getNumStates() : number { return this.NUM_STATES; }

    public   readonly NT_OFFSET : number = 56;
    public   getNtOffset() : number { return this.NT_OFFSET; }

    public   readonly LA_STATE_OFFSET : number = 475;
    public   getLaStateOffset() : number { return this.LA_STATE_OFFSET; }

    public   readonly MAX_LA : number = 1;
    public   getMaxLa() : number { return this.MAX_LA; }

    public   readonly NUM_RULES : number = 88;
    public   getNumRules() : number { return this.NUM_RULES; }

    public   readonly NUM_NONTERMINALS : number = 16;
    public   getNumNonterminals() : number { return this.NUM_NONTERMINALS; }

    public   readonly NUM_SYMBOLS : number = 72;
    public   getNumSymbols() : number { return this.NUM_SYMBOLS; }

    public   readonly START_STATE : number = 95;
    public   getStartState() : number { return this.START_STATE; }

    public   readonly IDENTIFIER_SYMBOL : number = 0;
    public   getIdentifier_SYMBOL() : number { return this.IDENTIFIER_SYMBOL; }

    public   readonly EOFT_SYMBOL : number = 41;
    public   getEoftSymbol() : number { return this.EOFT_SYMBOL; }

    public   readonly EOLT_SYMBOL : number = 57;
    public   getEoltSymbol() : number { return this.EOLT_SYMBOL; }

    public   readonly ACCEPT_ACTION : number = 386;
    public   getAcceptAction() : number { return this.ACCEPT_ACTION; }

    public   readonly ERROR_ACTION : number = 387;
    public   getErrorAction() : number { return this.ERROR_ACTION; }

    public readonly  BACKTRACK : boolean = false;
    public  getBacktrack() :boolean { return this.BACKTRACK; }

    public    getStartSymbol() : number { return this.lhs(0); }
    public   isValidForParser() : boolean { return JavaKWLexersym.isValidForParser; }


    public static  _isNullable : number[] = [0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0
        ];
    public   isNullable(index : number) : boolean { return  JavaKWLexerprs._isNullable[index] != 0; }

    public static  _prosthesesIndex : number[] = [0,
            8,7,6,11,9,10,4,12,13,14,
            16,2,3,5,15,1
        ];
    public   prosthesesIndex(index : number) : number { return  JavaKWLexerprs._prosthesesIndex[index]; }

    public static  _isKeyword : number[] = [0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0
        ];
    public   isKeyword(index : number) : boolean { return  JavaKWLexerprs._isKeyword[index] != 0; }

    public static  _baseCheck : number[] = [0,
            8,6,7,5,4,4,5,4,5,5,
            8,7,2,6,4,4,7,5,5,7,
            5,3,4,2,10,6,10,3,9,4,
            6,3,4,7,7,9,6,6,5,6,
            8,5,6,12,4,5,6,9,4,3,
            4,8,5,12,10,10,8,9,11,10,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1
        ];
    public   baseCheck(index : number) : number { return  JavaKWLexerprs._baseCheck[index]; }
    public static  _rhs : number [] = JavaKWLexerprs._baseCheck;
    public    rhs(index : number)  : number { return JavaKWLexerprs._rhs[index]; }

    public static  _baseAction : number[] = [
            12,12,12,12,12,12,12,12,12,12,
            12,12,12,12,12,12,12,12,12,12,
            12,12,12,12,12,12,12,12,12,12,
            12,12,12,12,12,12,12,12,12,12,
            12,12,12,12,12,12,12,12,12,12,
            12,12,12,12,12,12,12,12,12,12,
            12,1,1,13,13,5,5,10,10,7,
            7,14,14,3,3,8,8,11,11,2,
            2,4,4,6,6,15,15,9,9,14,
            50,90,60,115,113,1,110,48,120,117,
            64,134,92,66,164,98,116,97,132,118,
            97,161,106,129,119,133,100,135,136,149,
            152,135,257,145,130,120,141,156,137,127,
            160,123,172,145,165,171,144,177,263,146,
            149,176,150,103,187,181,166,153,202,190,
            194,167,148,178,158,160,165,170,197,57,
            205,214,166,173,199,218,210,223,178,174,
            221,179,58,227,236,186,22,183,233,239,
            188,56,190,242,28,60,247,55,248,256,
            249,189,59,194,260,56,54,70,82,266,
            30,270,35,95,106,44,100,13,6,107,
            77,65,83,276,267,112,278,279,269,117,
            277,206,281,286,150,118,284,289,231,292,
            294,293,295,75,299,301,302,303,310,311,
            124,304,315,316,319,320,324,322,323,326,
            332,333,334,327,339,341,342,345,347,349,
            350,351,353,354,355,358,359,361,365,137,
            367,368,374,369,376,370,384,375,385,138,
            380,387,381,391,398,392,399,401,404,407,
            410,402,408,413,414,415,417,420,418,421,
            423,432,435,436,427,431,441,437,443,448,
            450,451,452,454,455,458,459,462,463,442,
            465,468,470,469,474,473,476,481,486,482,
            484,489,491,492,494,498,495,501,502,504,
            506,507,508,509,514,512,519,522,523,524,
            527,528,533,535,536,539,540,541,203,545,
            546,549,550,551,556,553,561,552,562,563,
            566,569,570,574,577,579,567,580,583,586,
            584,589,590,591,592,387,387
        ];
    public   baseAction(index : number) : number { return  JavaKWLexerprs._baseAction[index]; }
    public static   _lhs : number []  = JavaKWLexerprs._baseAction;
    public   lhs(index : number)  : number { return JavaKWLexerprs._lhs[index]; }

    public static  _termCheck : number[] = [0,
            0,1,2,3,4,0,6,7,8,9,
            10,6,0,0,14,2,16,4,0,19,
            20,0,10,23,24,25,13,0,1,0,
            9,19,19,4,0,35,15,3,11,5,
            6,7,15,0,31,16,3,0,5,0,
            7,38,25,26,5,0,27,2,15,0,
            11,2,3,0,0,0,3,18,3,0,
            6,12,3,9,0,12,0,12,9,3,
            11,0,0,2,3,11,4,11,41,40,
            31,28,11,28,0,32,0,32,4,0,
            4,7,26,0,5,0,0,2,9,13,
            5,0,6,7,3,0,0,0,1,0,
            9,5,6,0,1,26,7,10,0,14,
            36,3,0,10,0,0,0,0,1,0,
            12,5,7,7,0,30,14,10,0,0,
            6,0,33,4,3,0,8,23,3,0,
            1,17,30,12,0,0,1,12,33,21,
            0,0,8,39,3,0,0,0,8,4,
            0,22,5,12,8,21,0,22,13,0,
            1,21,6,0,1,18,0,21,0,3,
            20,0,0,17,0,0,8,6,12,0,
            6,22,7,0,34,22,3,0,17,21,
            0,17,0,6,4,12,0,5,26,20,
            0,5,0,13,17,0,1,5,0,9,
            18,0,4,34,18,4,0,0,0,3,
            18,13,4,6,13,0,0,22,12,0,
            5,13,0,4,17,0,0,5,0,0,
            5,15,13,18,5,0,0,0,0,1,
            0,6,5,0,8,0,1,19,0,1,
            24,0,0,0,0,1,5,4,0,7,
            0,0,0,0,1,25,4,24,10,0,
            0,11,3,3,0,0,2,16,0,0,
            5,0,0,0,3,0,0,2,10,10,
            7,0,0,0,8,4,14,5,0,1,
            0,0,2,10,0,1,0,6,0,0,
            0,1,0,0,0,9,7,0,0,11,
            0,7,2,6,0,1,0,0,0,0,
            3,5,20,0,0,0,3,2,10,0,
            0,23,29,0,0,2,0,3,8,10,
            0,0,2,19,3,9,27,0,0,2,
            0,0,2,0,1,7,0,0,2,0,
            1,10,0,0,0,0,0,0,1,0,
            0,8,0,9,8,6,0,15,6,9,
            0,0,25,2,0,0,0,3,3,9,
            0,0,0,3,2,9,20,0,1,0,
            0,0,2,0,0,4,7,0,0,1,
            7,0,0,6,0,11,2,0,0,0,
            29,10,0,0,6,0,9,15,9,6,
            0,0,10,0,9,0,1,4,0,8,
            0,0,1,0,0,15,8,0,8,2,
            0,0,1,0,4,0,0,0,0,2,
            16,0,7,0,3,7,23,4,0,1,
            14,0,0,0,3,2,0,0,0,7,
            27,5,0,1,0,0,2,2,0,0,
            0,3,2,16,0,0,1,8,0,0,
            0,0,0,4,10,0,4,2,8,11,
            0,0,0,2,4,0,0,2,0,0,
            8,2,4,0,1,24,0,1,0,0,
            14,2,0,0,6,0,1,5,0,0,
            0,0,2,0,0,0,0,0,0,10,
            0,0,0,0,16,14,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            37,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];
    public   termCheck(index : number) : number { return  JavaKWLexerprs._termCheck[index]; }

    public static  _termAction : number[] = [0,
            387,176,203,207,198,387,200,199,205,195,
            184,246,387,387,204,110,202,90,387,206,
            138,387,244,201,197,122,90,387,215,387,
            210,245,92,225,387,89,211,231,214,228,
            230,229,216,387,110,411,240,387,237,387,
            238,92,213,212,113,387,226,217,239,387,
            98,117,115,387,387,387,134,113,164,387,
            252,115,220,251,387,134,387,164,219,250,
            218,387,387,222,223,275,253,249,386,98,
            117,132,221,161,387,132,387,161,233,387,
            106,234,437,387,243,387,387,236,242,106,
            235,387,248,247,257,387,387,387,267,387,
            256,261,262,387,282,241,118,268,387,100,
            232,119,387,283,387,387,387,387,315,387,
            119,307,127,308,387,100,120,316,387,387,
            141,387,118,266,135,387,130,123,137,387,
            144,141,120,135,387,387,148,137,127,130,
            387,387,146,123,145,387,387,387,149,103,
            387,144,170,145,150,146,387,148,103,387,
            160,149,153,387,165,170,387,150,387,444,
            158,387,387,153,387,387,174,167,444,387,
            173,160,264,387,158,165,166,387,167,174,
            387,173,387,178,445,166,387,179,407,186,
            387,183,387,445,178,387,188,190,387,409,
            179,387,443,186,183,447,387,387,387,442,
            190,443,446,189,447,387,387,188,442,387,
            194,446,387,441,189,387,387,209,387,387,
            224,208,441,194,227,387,387,387,387,259,
            387,254,258,387,263,387,265,260,387,270,
            255,387,387,387,387,274,271,272,387,273,
            13,387,387,387,284,419,279,269,276,387,
            387,277,280,281,387,387,285,278,387,387,
            286,387,387,387,290,387,387,436,287,288,
            289,387,387,387,293,291,438,292,387,294,
            387,387,295,432,387,297,387,296,387,387,
            387,301,387,387,387,298,300,387,387,299,
            28,420,305,304,387,306,387,387,387,387,
            309,410,302,387,387,387,310,312,311,387,
            387,417,303,387,387,402,387,314,318,317,
            387,387,393,313,319,395,403,387,387,392,
            387,387,321,387,322,320,387,387,440,387,
            323,324,387,387,387,387,387,387,426,387,
            387,327,387,429,328,329,387,326,331,330,
            387,387,325,332,387,387,387,333,334,336,
            387,387,387,337,339,338,335,387,408,387,
            387,387,405,387,387,341,340,387,387,397,
            342,387,387,344,387,343,345,387,387,387,
            391,396,46,387,348,387,346,394,347,349,
            387,387,434,387,350,387,351,425,387,427,
            387,387,353,387,387,430,424,387,352,418,
            387,387,413,387,356,19,387,387,387,401,
            355,387,358,387,362,360,354,361,387,389,
            359,387,387,387,363,365,387,387,387,364,
            357,366,387,368,387,387,422,421,387,387,
            387,369,371,367,387,387,399,370,387,387,
            387,387,387,390,404,387,374,439,373,372,
            387,387,387,376,375,387,387,378,387,387,
            377,398,379,387,388,428,387,435,387,387,
            423,416,387,387,380,387,382,381,387,387,
            387,387,384,387,387,387,387,387,387,412,
            387,387,387,387,414,431,387,387,387,387,
            387,387,387,387,387,387,387,387,387,387,
            383
        ];
    public   termAction(index : number) : number { return  JavaKWLexerprs._termAction[index]; }
    public    asb(index : number) : number { return 0; }
    public    asr(index : number) : number { return 0; }
    public    nasb(index : number)  : number{ return 0; }
    public    nasr(index : number)  : number{ return 0; }
    public    terminalIndex(index : number) : number { return 0; }
    public    nonterminalIndex(index : number)  : number{ return 0; }
    public    scopePrefix(index : number)  : number{ return 0;}
    public    scopeSuffix(index : number) : number { return 0;}
    public    scopeLhs(index : number)  : number{ return 0;}
    public    scopeLa(index : number) : number { return 0;}
    public    scopeStateSet(index : number)  : number{ return 0;}
    public    scopeRhs(index : number)  : number{ return 0;}
    public    scopeState(index : number) : number { return 0;}
    public    inSymb(index : number)  : number{ return 0;}
    public    name(index : number)  : string{ return ""; }
    public   originalState(state : number): number { return 0; }
    public  asi(state : number ): number { return 0; }
    public    nasi(state : number ) : number { return 0; }
    public    inSymbol(state : number)  : number { return 0; }

    /**
     * assert(! goto_default);
     */
    public    ntAction(state : number,  sym : number) : number {
        return JavaKWLexerprs._baseAction[state + sym];
    }

    /**
     * assert(! shift_default);
     */
    public    tAction(state : number,  sym : number): number {
        let i = JavaKWLexerprs._baseAction[state],
            k = i + sym;
        return JavaKWLexerprs._termAction[ JavaKWLexerprs._termCheck[k] == sym ? k : i];
    }
    public    lookAhead( la_state : number ,  sym : number): number {
        let k = la_state + sym;
        return JavaKWLexerprs._termAction[ JavaKWLexerprs._termCheck[k] == sym ? k : la_state];
    }
}
