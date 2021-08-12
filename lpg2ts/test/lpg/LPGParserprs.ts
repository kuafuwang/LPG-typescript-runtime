import { ParseTable } from "../../src";
import { LPGParsersym } from "./LPGParsersym";
export class LPGParserprs implements ParseTable {
    public   readonly ERROR_SYMBOL : number = 47;
    public   getErrorSymbol() : number { return this.ERROR_SYMBOL; }

    public   readonly SCOPE_UBOUND : number = -1;
    public   getScopeUbound() : number { return this.SCOPE_UBOUND; }

    public   readonly SCOPE_SIZE : number = 0;
    public   getScopeSize() : number { return this.SCOPE_SIZE; }

    public   readonly MAX_NAME_LENGTH : number = 27;
    public   getMaxNameLength() : number { return this.MAX_NAME_LENGTH; }

    public   readonly NUM_STATES : number = 106;
    public   getNumStates() : number { return this.NUM_STATES; }

    public   readonly NT_OFFSET : number = 47;
    public   getNtOffset() : number { return this.NT_OFFSET; }

    public   readonly LA_STATE_OFFSET : number = 601;
    public   getLaStateOffset() : number { return this.LA_STATE_OFFSET; }

    public   readonly MAX_LA : number = 3;
    public   getMaxLa() : number { return this.MAX_LA; }

    public   readonly NUM_RULES : number = 147;
    public   getNumRules() : number { return this.NUM_RULES; }

    public   readonly NUM_NONTERMINALS : number = 68;
    public   getNumNonterminals() : number { return this.NUM_NONTERMINALS; }

    public   readonly NUM_SYMBOLS : number = 115;
    public   getNumSymbols() : number { return this.NUM_SYMBOLS; }

    public   readonly START_STATE : number = 208;
    public   getStartState() : number { return this.START_STATE; }

    public   readonly IDENTIFIER_SYMBOL : number = 0;
    public   getIdentifier_SYMBOL() : number { return this.IDENTIFIER_SYMBOL; }

    public   readonly EOFT_SYMBOL : number = 36;
    public   getEoftSymbol() : number { return this.EOFT_SYMBOL; }

    public   readonly EOLT_SYMBOL : number = 36;
    public   getEoltSymbol() : number { return this.EOLT_SYMBOL; }

    public   readonly ACCEPT_ACTION : number = 453;
    public   getAcceptAction() : number { return this.ACCEPT_ACTION; }

    public   readonly ERROR_ACTION : number = 454;
    public   getErrorAction() : number { return this.ERROR_ACTION; }

    public readonly  BACKTRACK : boolean = true;
    public  getBacktrack() :boolean { return this.BACKTRACK; }

    public    getStartSymbol() : number { return this.lhs(0); }
    public   isValidForParser() : boolean { return LPGParsersym.isValidForParser; }


    public static  _isNullable : number[] = [0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,0,0,
            0,0,1,0,0,1,1,0,0,0,
            0,0,0,0,1,0,0,0,0,1,
            1,1,0,0,1,0,0,0,0,0,
            0,1,0,0,0,0,0,1,0,0,
            1,0,1,1,0,0,1,0,0,1,
            0,0,0,1,1,0,0,0,1,1,
            1,0,0,0,0
        ];
    public   isNullable(index : number) : boolean { return  LPGParserprs._isNullable[index] != 0; }

    public static  _prosthesesIndex : number[] = [0,
            7,35,42,43,36,38,52,51,57,58,
            19,31,34,37,39,40,48,50,53,62,
            63,65,2,3,4,5,6,8,9,10,
            11,12,13,14,15,16,17,18,20,21,
            22,23,24,25,26,27,28,29,30,32,
            33,41,44,45,46,47,49,54,55,56,
            59,60,61,64,66,67,68,1
        ];
    public   prosthesesIndex(index : number) : number { return  LPGParserprs._prosthesesIndex[index]; }

    public static  _isKeyword : number[] = [0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0
        ];
    public   isKeyword(index : number) : boolean { return  LPGParserprs._isKeyword[index] != 0; }

    public static  _baseCheck : number[] = [0,
            2,0,2,3,3,3,3,3,3,3,
            3,3,3,3,3,3,3,3,3,3,
            3,3,3,3,3,3,0,2,2,1,
            3,2,0,2,4,1,3,1,2,3,
            3,3,3,3,3,1,1,1,1,1,
            1,1,1,1,1,2,2,1,1,1,
            1,1,1,1,2,1,2,1,1,2,
            0,2,2,2,1,2,1,2,4,0,
            1,1,1,2,1,3,1,2,3,1,
            1,1,1,1,1,1,2,2,0,2,
            3,1,2,3,1,3,1,1,1,1,
            2,0,2,1,2,0,1,0,1,1,
            1,2,1,1,1,2,2,0,2,1,
            1,1,1,2,4,1,3,0,2,2,
            0,2,1,0,1,0,2,-10,-12,-18,
            3,3,-9,-15,-16,-26,8,3,6,11,
            7,-28,8,-35,1,11,-37,1,21,3,
            15,16,19,-2,13,14,-7,-40,1,-5,
            3,-29,-45,1,29,8,37,21,27,7,
            43,12,39,-8,-47,1,44,3,-59,1,
            -93,19,8,-63,1,-11,-20,-1,-3,9,
            10,-105,6,15,16,22,13,14,18,-14,
            9,10,46,4,-19,20,-13,3,49,18,
            23,24,6,25,-38,-21,2,-22,45,4,
            3,35,-23,-76,-27,3,-24,42,-25,3,
            6,3,-31,1,-32,1,48,-33,1,40,
            36,-39,1,-89,-43,-6,-17,41,4,34,
            33,-86,28,-4,32,4,-30,31,30,22,
            17,20,-44,1,-54,1,4,-100,4,-55,
            1,-102,3,6,-34,-41,2,2,64,26,
            9,10,59,60,38,-36,-42,1,-46,4,
            2,-50,47,-48,1,-49,1,-60,66,56,
            -73,67,58,-51,1,-53,50,-52,1,4,
            -56,1,-57,1,63,-58,1,-61,1,-62,
            -64,-78,2,4,-65,-66,2,2,61,-67,
            -68,2,2,-69,-70,2,-74,-79,-75,-85,
            -77,-90,5,7,53,7,12,7,-80,52,
            -81,-82,-83,5,-84,5,5,5,-87,5,
            2,-95,-96,-103,-101,65,2,4,-104,-71,
            -72,-88,-91,-92,-94,54,-97,-98,17,-99,
            -106,0,0,0,0,0,0,0,0,0,
            51,0,0,0,0,0,55,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,57,
            0,0,0,0,0,0,0,0,0,0,
            62,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0
        ];
    public   baseCheck(index : number) : number { return  LPGParserprs._baseCheck[index]; }
    public static  _rhs : number [] = LPGParserprs._baseCheck;
    public    rhs(index : number)  : number { return LPGParserprs._rhs[index]; }

    public static  _baseAction : number[] = [
            23,23,25,25,26,26,26,26,26,26,
            26,26,26,26,26,26,26,26,26,26,
            26,26,26,26,26,26,26,24,24,48,
            49,49,12,50,50,50,51,51,27,27,
            13,13,13,13,13,13,14,5,5,5,
            5,5,5,5,28,29,29,15,16,16,
            52,31,30,32,33,33,34,34,35,36,
            37,53,53,54,54,55,55,56,56,17,
            57,57,38,11,11,8,8,39,39,19,
            7,7,7,7,7,7,40,40,41,58,
            58,59,60,60,60,18,18,2,2,2,
            2,9,10,10,61,61,62,62,63,63,
            4,42,42,20,20,43,43,21,64,64,
            3,3,44,45,45,22,65,65,47,47,
            66,46,46,67,1,1,6,6,80,80,
            247,235,296,137,134,80,153,83,296,306,
            178,309,147,83,251,23,195,6,22,125,
            235,55,318,87,83,38,341,132,6,20,
            174,296,230,111,17,199,84,316,126,204,
            309,167,30,183,186,6,16,164,296,76,
            6,266,88,84,115,4,150,137,40,200,
            105,288,266,326,56,318,133,39,341,400,
            239,105,288,255,96,80,121,137,69,182,
            401,174,209,265,274,163,239,357,80,258,
            66,64,328,80,270,137,63,80,262,80,
            61,340,62,224,26,228,25,28,232,24,
            283,324,43,21,274,255,87,213,307,147,
            285,290,236,338,75,331,119,89,333,336,
            134,77,122,234,18,234,11,97,161,67,
            6,10,266,65,384,159,172,321,359,127,
            3,106,288,100,379,314,253,251,19,159,
            147,361,188,253,251,15,251,14,258,139,
            382,268,142,244,251,13,256,32,251,12,
            147,251,9,251,8,135,251,7,251,5,
            261,159,226,358,147,159,159,369,371,113,
            159,159,372,373,159,174,375,134,129,134,
            272,134,276,45,129,342,86,31,89,129,
            57,129,129,129,44,129,43,42,41,159,
            40,201,280,282,289,159,272,212,147,290,
            94,263,199,212,278,242,72,285,287,78,
            283,291,454,454,454,454,454,454,454,454,
            454,393,454,454,454,454,454,397,454,454,
            454,454,454,454,454,454,454,454,454,454,
            454,454,454,454,454,454,454,454,454,454,
            385,454,454,454,454,454,454,454,454,454,
            454,115,454,0
        ];
    public   baseAction(index : number) : number { return  LPGParserprs._baseAction[index]; }
    public static   _lhs : number []  = LPGParserprs._baseAction;
    public   lhs(index : number)  : number { return LPGParserprs._lhs[index]; }

    public static  _termCheck : number[] = [0,
            0,1,2,3,4,0,1,2,3,9,
            10,11,12,13,14,15,16,17,18,19,
            20,21,22,23,24,25,26,27,28,29,
            30,31,32,33,34,35,36,0,1,0,
            3,4,0,1,2,3,9,10,11,12,
            13,14,15,16,17,18,19,20,21,22,
            23,24,25,26,27,28,29,30,31,32,
            33,34,35,36,0,0,1,2,3,0,
            1,2,0,9,10,11,0,13,0,15,
            16,17,18,0,1,21,22,23,24,25,
            26,27,28,29,30,31,32,33,34,35,
            0,1,2,3,0,1,2,3,36,9,
            10,11,12,9,10,11,38,13,0,1,
            2,0,39,0,1,2,0,9,10,11,
            12,13,9,10,11,12,0,1,2,0,
            1,2,0,1,2,9,10,11,0,13,
            0,1,0,5,6,7,8,5,6,7,
            8,0,12,0,1,0,5,6,7,8,
            5,6,7,8,0,0,1,0,0,5,
            6,7,8,5,6,7,8,0,0,0,
            2,0,5,6,7,8,5,6,7,8,
            0,0,0,1,0,5,6,7,8,5,
            6,7,8,0,1,0,3,0,1,0,
            3,0,1,0,3,0,3,4,0,4,
            41,0,4,2,19,20,0,1,37,14,
            0,40,0,3,0,0,4,0,4,4,
            0,4,0,1,4,0,37,0,1,0,
            1,0,1,0,1,0,1,0,1,0,
            1,0,0,2,0,1,0,1,0,0,
            0,2,4,0,0,0,14,0,0,0,
            0,0,0,0,14,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];
    public   termCheck(index : number) : number { return  LPGParserprs._termCheck[index]; }

    public static  _termAction : number[] = [0,
            146,389,639,389,389,144,584,585,599,389,
            389,389,389,389,389,389,389,389,389,389,
            389,389,389,389,389,389,389,389,389,389,
            389,389,389,389,389,389,389,146,389,27,
            389,389,144,577,578,599,389,389,389,389,
            389,389,389,389,389,389,389,389,389,389,
            389,389,389,389,389,389,389,389,389,389,
            389,389,389,389,1,144,513,512,599,454,
            584,585,454,243,247,225,138,249,33,162,
            245,156,266,454,488,238,236,207,150,267,
            155,154,220,177,227,149,206,148,153,194,
            144,544,545,599,144,345,500,599,453,790,
            786,777,546,816,812,799,390,803,454,501,
            502,141,360,454,544,545,146,503,504,507,
            506,505,547,548,549,546,454,345,500,454,
            577,578,454,513,512,354,351,346,454,350,
            146,602,128,561,562,563,564,561,562,563,
            564,85,568,454,277,144,561,562,563,564,
            549,549,549,549,144,454,295,71,144,548,
            548,548,548,547,547,547,547,144,102,2,
            395,144,346,346,346,346,350,350,350,350,
            144,454,454,536,144,351,351,351,351,354,
            354,354,354,144,391,70,599,144,597,29,
            599,144,295,144,599,118,599,574,454,574,
            180,103,574,558,264,362,454,312,398,394,
            144,489,132,599,99,68,574,454,574,574,
            54,514,454,594,574,112,355,454,590,98,
            392,454,490,454,383,454,529,454,591,74,
            383,80,101,535,73,530,454,491,111,116,
            79,571,574,454,454,454,292,454,454,454,
            454,454,454,454,292
        ];
    public   termAction(index : number) : number { return  LPGParserprs._termAction[index]; }

    public static  _asb : number[] = [0,
            129,186,129,163,125,100,100,125,68,34,
            34,34,67,93,1,34,125,125,34,68,
            93,34,34,34,34,34,68,30,128,127,
            100,100,100,192,162,68,99,95,99,99,
            95,162,67,68,8,192,99,162,162,160,
            162,162,68,68,99,162,162,162,99,93,
            162,68,99,192,192,192,192,192,192,125,
            188,125,125,1,1,100,1,160,29,29,
            29,29,29,29,125,38,192,191,125,125,
            197,125,37,191,159,191,159,125,39,156,
            192,156,157,155,156,158
        ];
    public   asb(index : number) : number { return  LPGParserprs._asb[index]; }

    public static  _asr : number[] = [0,
            1,2,12,9,10,11,0,15,16,17,
            18,21,22,23,24,25,26,27,28,29,
            30,31,32,33,34,35,36,3,12,9,
            10,13,11,1,2,0,12,4,15,16,
            17,18,3,9,10,13,21,22,23,11,
            24,25,26,27,28,29,30,31,32,33,
            34,35,36,1,14,0,1,15,16,17,
            18,3,9,10,13,21,22,23,11,24,
            25,26,27,28,29,30,31,32,33,34,
            35,36,4,0,5,6,7,8,2,15,
            16,17,18,3,9,10,13,21,22,23,
            11,24,25,26,27,28,29,30,31,32,
            33,34,35,36,1,0,38,37,15,16,
            17,18,9,10,13,21,22,23,11,24,
            25,26,27,28,41,29,30,31,32,33,
            34,35,36,0,2,12,4,14,1,19,
            20,3,15,16,17,13,10,9,21,22,
            23,11,24,25,26,27,28,30,31,32,
            33,34,35,29,18,36,0,1,39,0,
            2,5,6,7,8,0,40,37,0
        ];
    public   asr(index : number) : number { return  LPGParserprs._asr[index]; }

    public static  _nasb : number[] = [0,
            37,34,39,85,17,79,15,23,93,13,
            35,13,93,42,3,13,81,1,44,93,
            49,51,53,58,60,6,93,9,34,87,
            62,65,68,47,33,90,12,46,71,12,
            47,33,76,89,19,47,12,33,33,95,
            33,33,90,89,12,33,33,33,25,97,
            33,90,31,47,47,47,47,47,47,103,
            34,34,99,21,21,55,21,101,105,105,
            105,105,105,105,107,83,47,34,74,109,
            34,34,29,34,111,113,34,34,34,92,
            47,29,90,115,29,34
        ];
    public   nasb(index : number) : number { return  LPGParserprs._nasb[index]; }

    public static  _nasr : number[] = [0,
            37,0,7,39,0,16,29,0,14,27,
            0,1,3,0,46,0,49,0,1,19,
            7,0,45,0,16,1,15,0,10,0,
            14,13,1,0,42,0,24,0,25,48,
            0,40,0,36,0,64,2,0,34,0,
            33,0,32,0,60,59,0,31,0,30,
            0,1,66,0,1,67,0,1,22,0,
            1,20,0,56,0,58,4,0,47,0,
            38,0,63,0,26,0,50,0,1,4,
            0,61,6,0,53,0,52,0,65,0,
            54,0,12,0,5,0,51,0,55,0,
            17,0,57,0,62,0
        ];
    public   nasr(index : number) : number { return  LPGParserprs._nasr[index]; }

    public static  _terminalIndex : number[] = [0,
            45,44,21,46,1,2,3,4,22,23,
            28,20,24,5,14,15,16,17,18,19,
            25,26,27,29,30,31,32,33,35,36,
            37,38,39,40,41,42,7,6,8,9,
            34,10,11,12,43,47,48
        ];
    public   terminalIndex(index : number) : number { return  LPGParserprs._terminalIndex[index]; }

    public static  _nonterminalIndex : number[] = [0,
            0,71,77,78,72,0,84,83,0,0,
            60,68,70,73,74,75,82,0,85,89,
            90,91,0,0,0,49,50,0,51,52,
            53,54,55,56,0,57,58,59,61,62,
            0,63,64,0,65,0,0,66,67,0,
            69,76,0,79,80,81,0,0,86,87,
            88,0,0,0,92,93,94,0
        ];
    public   nonterminalIndex(index : number) : number { return  LPGParserprs._nonterminalIndex[index]; }
    public static _scopePrefix : number[];
    public    scopePrefix(index : number) : number { return 0;}

    public static _scopeSuffix : number[];
    public    scopeSuffix(index : number): number { return 0;}

    public static _scopeLhs : number[];
    public    scopeLhs(index : number): number { return 0;}

    public static _scopeLa : number[];
    public    scopeLa(index : number): number { return 0;}

    public static  _scopeStateSet: number[] ;
    public    scopeStateSet(index : number) : number{ return 0;}

    public static  _scopeRhs: number[] ;
    public    scopeRhs(index : number): number { return 0;}

    public static _scopeState : number[];
    public    scopeState(index : number): number { return 0;}

    public static _inSymb : number[];
    public    inSymb(index : number) : number{ return 0;}


    public static  _name : string[] = [
            "",
            "::=",
            "::=?",
            "->",
            "->?",
            "|",
            "=",
            ",",
            "(",
            ")",
            "[",
            "]",
            "#",
            "%empty",
            "ALIAS_KEY",
            "AST_KEY",
            "DEFINE_KEY",
            "DISJOINTPREDECESSORSETS_KEY",
            "DROPRULES_KEY",
            "DROPSYMBOLS_KEY",
            "EMPTY_KEY",
            "END_KEY",
            "ERROR_KEY",
            "EOL_KEY",
            "EOF_KEY",
            "EXPORT_KEY",
            "GLOBALS_KEY",
            "HEADERS_KEY",
            "IDENTIFIER_KEY",
            "IMPORT_KEY",
            "INCLUDE_KEY",
            "KEYWORDS_KEY",
            "NAMES_KEY",
            "NOTICE_KEY",
            "OPTIONS_KEY",
            "RECOVER_KEY",
            "RULES_KEY",
            "SOFT_KEYWORDS_KEY",
            "START_KEY",
            "TERMINALS_KEY",
            "TRAILERS_KEY",
            "TYPES_KEY",
            "EOF_TOKEN",
            "SINGLE_LINE_COMMENT",
            "MACRO_NAME",
            "SYMBOL",
            "BLOCK",
            "VBAR",
            "ERROR_TOKEN",
            "LPG_item",
            "alias_segment",
            "define_segment",
            "eof_segment",
            "eol_segment",
            "error_segment",
            "export_segment",
            "globals_segment",
            "identifier_segment",
            "import_segment",
            "include_segment",
            "keywords_segment",
            "names_segment",
            "notice_segment",
            "start_segment",
            "terminals_segment",
            "types_segment",
            "option_spec",
            "option_list",
            "option",
            "symbol_list",
            "aliasSpec",
            "produces",
            "alias_rhs",
            "alias_lhs_macro_name",
            "defineSpec",
            "macro_name_symbol",
            "macro_segment",
            "terminal_symbol",
            "action_segment",
            "drop_command",
            "drop_symbols",
            "drop_rules",
            "drop_rule",
            "keywordSpec",
            "name",
            "nameSpec",
            "nonTerm",
            "ruleNameWithAttributes",
            "symWithAttrs",
            "start_symbol",
            "terminal",
            "type_declarations",
            "barSymbolList",
            "symbol_pair",
            "recover_symbol"
        ];
    public   name(index : number):string { return LPGParserprs._name[index]; }

    public   originalState(state : number): number {
        return - LPGParserprs._baseCheck[state];
    }
    public    asi(state : number ): number {
        return LPGParserprs._asb[this.originalState(state)];
    }
    public   nasi(state : number ) : number {
        return LPGParserprs._nasb[this.originalState(state)];
    }
    public   inSymbol(state : number)  : number {
        return LPGParserprs._inSymb[this.originalState(state)];
    }

    /**
     * assert(! goto_default);
     */
    public    ntAction(state : number,  sym : number) : number {
        return LPGParserprs._baseAction[state + sym];
    }

    /**
     * assert(! shift_default);
     */
    public    tAction(state : number,  sym : number): number {
        let i = LPGParserprs._baseAction[state],
            k = i + sym;
        return LPGParserprs._termAction[ LPGParserprs._termCheck[k] == sym ? k : i];
    }
    public    lookAhead( la_state : number ,  sym : number): number {
        let k = la_state + sym;
        return LPGParserprs._termAction[ LPGParserprs._termCheck[k] == sym ? k : la_state];
    }
}
