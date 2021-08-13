//
// This is the grammar specification from the Final Draft of the generic spec.
//
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

export namespace  JavaParsersym {
     export const TK_ClassBodyDeclarationsoptMarker :number  = 102;
  export const TK_LPGUserActionMarker :number  = 103;
  export const TK_IntegerLiteral :number  = 32;
  export const TK_LongLiteral :number  = 33;
  export const TK_FloatingPointLiteral :number  = 34;
  export const TK_DoubleLiteral :number  = 35;
  export const TK_CharacterLiteral :number  = 36;
  export const TK_StringLiteral :number  = 37;
  export const TK_MINUS_MINUS :number  = 26;
  export const TK_OR :number  = 86;
  export const TK_MINUS :number  = 46;
  export const TK_MINUS_EQUAL :number  = 72;
  export const TK_NOT :number  = 48;
  export const TK_NOT_EQUAL :number  = 87;
  export const TK_REMAINDER :number  = 88;
  export const TK_REMAINDER_EQUAL :number  = 73;
  export const TK_AND :number  = 68;
  export const TK_AND_AND :number  = 89;
  export const TK_AND_EQUAL :number  = 74;
  export const TK_LPAREN :number  = 3;
  export const TK_RPAREN :number  = 20;
  export const TK_MULTIPLY :number  = 69;
  export const TK_MULTIPLY_EQUAL :number  = 75;
  export const TK_COMMA :number  = 43;
  export const TK_DOT :number  = 42;
  export const TK_DIVIDE :number  = 90;
  export const TK_DIVIDE_EQUAL :number  = 76;
  export const TK_COLON :number  = 50;
  export const TK_SEMICOLON :number  = 4;
  export const TK_QUESTION :number  = 91;
  export const TK_AT :number  = 1;
  export const TK_LBRACKET :number  = 23;
  export const TK_RBRACKET :number  = 53;
  export const TK_XOR :number  = 92;
  export const TK_XOR_EQUAL :number  = 77;
  export const TK_LBRACE :number  = 27;
  export const TK_OR_OR :number  = 95;
  export const TK_OR_EQUAL :number  = 78;
  export const TK_RBRACE :number  = 45;
  export const TK_TWIDDLE :number  = 49;
  export const TK_PLUS :number  = 47;
  export const TK_PLUS_PLUS :number  = 28;
  export const TK_PLUS_EQUAL :number  = 79;
  export const TK_LESS :number  = 24;
  export const TK_LEFT_SHIFT :number  = 70;
  export const TK_LEFT_SHIFT_EQUAL :number  = 80;
  export const TK_LESS_EQUAL :number  = 81;
  export const TK_EQUAL :number  = 51;
  export const TK_EQUAL_EQUAL :number  = 93;
  export const TK_GREATER :number  = 44;
  export const TK_GREATER_EQUAL :number  = 112;
  export const TK_RIGHT_SHIFT :number  = 113;
  export const TK_RIGHT_SHIFT_EQUAL :number  = 114;
  export const TK_UNSIGNED_RIGHT_SHIFT :number  = 115;
  export const TK_UNSIGNED_RIGHT_SHIFT_EQUAL :number  = 116;
  export const TK_ELLIPSIS :number  = 96;
  export const TK_BeginAction :number  = 104;
  export const TK_EndAction :number  = 105;
  export const TK_BeginJava :number  = 106;
  export const TK_EndJava :number  = 107;
  export const TK_NoAction :number  = 108;
  export const TK_NullAction :number  = 109;
  export const TK_BadAction :number  = 110;
  export const TK_abstract :number  = 17;
  export const TK_assert :number  = 57;
  export const TK_boolean :number  = 5;
  export const TK_break :number  = 58;
  export const TK_byte :number  = 6;
  export const TK_case :number  = 71;
  export const TK_catch :number  = 97;
  export const TK_char :number  = 7;
  export const TK_class :number  = 31;
  export const TK_const :number  = 117;
  export const TK_continue :number  = 59;
  export const TK_default :number  = 67;
  export const TK_do :number  = 60;
  export const TK_double :number  = 8;
  export const TK_enum :number  = 41;
  export const TK_else :number  = 94;
  export const TK_extends :number  = 82;
  export const TK_false :number  = 38;
  export const TK_final :number  = 19;
  export const TK_finally :number  = 98;
  export const TK_float :number  = 9;
  export const TK_for :number  = 61;
  export const TK_goto :number  = 118;
  export const TK_if :number  = 62;
  export const TK_implements :number  = 111;
  export const TK_import :number  = 99;
  export const TK_instanceof :number  = 83;
  export const TK_int :number  = 10;
  export const TK_interface :number  = 21;
  export const TK_long :number  = 11;
  export const TK_native :number  = 84;
  export const TK_new :number  = 29;
  export const TK_null :number  = 39;
  export const TK_package :number  = 100;
  export const TK_private :number  = 14;
  export const TK_protected :number  = 15;
  export const TK_public :number  = 12;
  export const TK_return :number  = 63;
  export const TK_short :number  = 13;
  export const TK_static :number  = 16;
  export const TK_strictfp :number  = 18;
  export const TK_super :number  = 25;
  export const TK_switch :number  = 64;
  export const TK_synchronized :number  = 52;
  export const TK_this :number  = 30;
  export const TK_throw :number  = 65;
  export const TK_throws :number  = 101;
  export const TK_transient :number  = 54;
  export const TK_true :number  = 40;
  export const TK_try :number  = 66;
  export const TK_void :number  = 22;
  export const TK_volatile :number  = 55;
  export const TK_while :number  = 56;
  export const TK_EOF_TOKEN :number  = 85;
  export const TK_IDENTIFIER :number  = 2;
  export const TK_ERROR_TOKEN :number  = 119;

    export const  orderedTerminalSymbols  : string[]= [
                 "",
                 "AT",
                 "IDENTIFIER",
                 "LPAREN",
                 "SEMICOLON",
                 "boolean",
                 "byte",
                 "char",
                 "double",
                 "float",
                 "int",
                 "long",
                 "public",
                 "short",
                 "private",
                 "protected",
                 "static",
                 "abstract",
                 "strictfp",
                 "final",
                 "RPAREN",
                 "interface",
                 "void",
                 "LBRACKET",
                 "LESS",
                 "super",
                 "MINUS_MINUS",
                 "LBRACE",
                 "PLUS_PLUS",
                 "new",
                 "this",
                 "class",
                 "IntegerLiteral",
                 "LongLiteral",
                 "FloatingPointLiteral",
                 "DoubleLiteral",
                 "CharacterLiteral",
                 "StringLiteral",
                 "false",
                 "null",
                 "true",
                 "enum",
                 "DOT",
                 "COMMA",
                 "GREATER",
                 "RBRACE",
                 "MINUS",
                 "PLUS",
                 "NOT",
                 "TWIDDLE",
                 "COLON",
                 "EQUAL",
                 "synchronized",
                 "RBRACKET",
                 "transient",
                 "volatile",
                 "while",
                 "assert",
                 "break",
                 "continue",
                 "do",
                 "for",
                 "if",
                 "return",
                 "switch",
                 "throw",
                 "try",
                 "default",
                 "AND",
                 "MULTIPLY",
                 "LEFT_SHIFT",
                 "case",
                 "MINUS_EQUAL",
                 "REMAINDER_EQUAL",
                 "AND_EQUAL",
                 "MULTIPLY_EQUAL",
                 "DIVIDE_EQUAL",
                 "XOR_EQUAL",
                 "OR_EQUAL",
                 "PLUS_EQUAL",
                 "LEFT_SHIFT_EQUAL",
                 "LESS_EQUAL",
                 "extends",
                 "instanceof",
                 "native",
                 "EOF_TOKEN",
                 "OR",
                 "NOT_EQUAL",
                 "REMAINDER",
                 "AND_AND",
                 "DIVIDE",
                 "QUESTION",
                 "XOR",
                 "EQUAL_EQUAL",
                 "else",
                 "OR_OR",
                 "ELLIPSIS",
                 "catch",
                 "finally",
                 "import",
                 "package",
                 "throws",
                 "ClassBodyDeclarationsoptMarker",
                 "LPGUserActionMarker",
                 "BeginAction",
                 "EndAction",
                 "BeginJava",
                 "EndJava",
                 "NoAction",
                 "NullAction",
                 "BadAction",
                 "implements",
                 "GREATER_EQUAL",
                 "RIGHT_SHIFT",
                 "RIGHT_SHIFT_EQUAL",
                 "UNSIGNED_RIGHT_SHIFT",
                 "UNSIGNED_RIGHT_SHIFT_EQUAL",
                 "const",
                 "goto",
                 "ERROR_TOKEN"
             ];

    export const  numTokenKinds : number  = 120;
    export const  isValidForParser : boolean = true;
}
