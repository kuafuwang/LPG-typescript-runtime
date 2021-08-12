export namespace  LPGParsersym {
     export const TK_EQUIVALENCE :number  = 5;
  export const TK_PRIORITY_EQUIVALENCE :number  = 6;
  export const TK_ARROW :number  = 7;
  export const TK_PRIORITY_ARROW :number  = 8;
  export const TK_OR_MARKER :number  = 14;
  export const TK_EQUAL :number  = 38;
  export const TK_COMMA :number  = 37;
  export const TK_LEFT_PAREN :number  = 39;
  export const TK_RIGHT_PAREN :number  = 40;
  export const TK_LEFT_BRACKET :number  = 42;
  export const TK_RIGHT_BRACKET :number  = 43;
  export const TK_SHARP :number  = 44;
  export const TK_ALIAS_KEY :number  = 15;
  export const TK_AST_KEY :number  = 16;
  export const TK_DEFINE_KEY :number  = 17;
  export const TK_DISJOINTPREDECESSORSETS_KEY :number  = 18;
  export const TK_DROPRULES_KEY :number  = 19;
  export const TK_DROPSYMBOLS_KEY :number  = 20;
  export const TK_EMPTY_KEY :number  = 12;
  export const TK_END_KEY :number  = 3;
  export const TK_ERROR_KEY :number  = 9;
  export const TK_EOL_KEY :number  = 10;
  export const TK_EOF_KEY :number  = 13;
  export const TK_EXPORT_KEY :number  = 21;
  export const TK_GLOBALS_KEY :number  = 22;
  export const TK_HEADERS_KEY :number  = 23;
  export const TK_IDENTIFIER_KEY :number  = 11;
  export const TK_IMPORT_KEY :number  = 24;
  export const TK_INCLUDE_KEY :number  = 25;
  export const TK_KEYWORDS_KEY :number  = 26;
  export const TK_NAMES_KEY :number  = 27;
  export const TK_NOTICE_KEY :number  = 28;
  export const TK_OPTIONS_KEY :number  = 41;
  export const TK_RECOVER_KEY :number  = 29;
  export const TK_RULES_KEY :number  = 30;
  export const TK_SOFT_KEYWORDS_KEY :number  = 31;
  export const TK_START_KEY :number  = 32;
  export const TK_TERMINALS_KEY :number  = 33;
  export const TK_TRAILERS_KEY :number  = 34;
  export const TK_TYPES_KEY :number  = 35;
  export const TK_EOF_TOKEN :number  = 36;
  export const TK_SINGLE_LINE_COMMENT :number  = 45;
  export const TK_MACRO_NAME :number  = 2;
  export const TK_SYMBOL :number  = 1;
  export const TK_BLOCK :number  = 4;
  export const TK_VBAR :number  = 46;
  export const TK_ERROR_TOKEN :number  = 47;

    export const  orderedTerminalSymbols  : string[]= [
                 "",
                 "SYMBOL",
                 "MACRO_NAME",
                 "END_KEY",
                 "BLOCK",
                 "EQUIVALENCE",
                 "PRIORITY_EQUIVALENCE",
                 "ARROW",
                 "PRIORITY_ARROW",
                 "ERROR_KEY",
                 "EOL_KEY",
                 "IDENTIFIER_KEY",
                 "EMPTY_KEY",
                 "EOF_KEY",
                 "OR_MARKER",
                 "ALIAS_KEY",
                 "AST_KEY",
                 "DEFINE_KEY",
                 "DISJOINTPREDECESSORSETS_KEY",
                 "DROPRULES_KEY",
                 "DROPSYMBOLS_KEY",
                 "EXPORT_KEY",
                 "GLOBALS_KEY",
                 "HEADERS_KEY",
                 "IMPORT_KEY",
                 "INCLUDE_KEY",
                 "KEYWORDS_KEY",
                 "NAMES_KEY",
                 "NOTICE_KEY",
                 "RECOVER_KEY",
                 "RULES_KEY",
                 "SOFT_KEYWORDS_KEY",
                 "START_KEY",
                 "TERMINALS_KEY",
                 "TRAILERS_KEY",
                 "TYPES_KEY",
                 "EOF_TOKEN",
                 "COMMA",
                 "EQUAL",
                 "LEFT_PAREN",
                 "RIGHT_PAREN",
                 "OPTIONS_KEY",
                 "LEFT_BRACKET",
                 "RIGHT_BRACKET",
                 "SHARP",
                 "SINGLE_LINE_COMMENT",
                 "VBAR",
                 "ERROR_TOKEN"
             ];

    export const  numTokenKinds : number  = 48;
    export const  isValidForParser : boolean = true;
}
