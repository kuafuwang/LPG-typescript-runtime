
////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2007 IBM Corporation.
// All rights reserved. This program and the accompanying materials
// are made available under the terms of the Eclipse Public License v1.0
// which accompanies this distribution, and is available at
// http://www.eclipse.org/legal/epl-v10.html
//
//Contributors:
//    Philippe Charles (pcharles@us.ibm.com) - initial API and implementation

import { JavaKWLexerprs } from "./JavaKWLexerprs";
import { JavaKWLexersym } from "./JavaKWLexersym";
import { JavaParsersym } from "./JavaParsersym";

////////////////////////////////////////////////////////////////////////////////


    //#line 58 "KeywordTemplateF.gi


    //#line 63 "KeywordTemplateF.gi

export class JavaKWLexer extends JavaKWLexerprs
{
    private inputChars : string;
    private   keywordKind  : number[] = new Array(88 + 1);

    public  getKeywordKinds() : number[] { return this.keywordKind; }

    public  lexer(curtok : number, lasttok : number) : number
    {
        let current_kind = JavaKWLexer.getKind(this.inputChars.charCodeAt(curtok)),
            act;

        for (act = this.tAction(this.START_STATE, current_kind);
             act > this.NUM_RULES && act < this.ACCEPT_ACTION;
             act = this.tAction(act, current_kind))
        {
            curtok++;
            current_kind = (curtok > lasttok
                                   ? JavaKWLexersym.Char_EOF
                                   : JavaKWLexer.getKind(this.inputChars.charCodeAt(curtok)));
        }

        if (act > this.ERROR_ACTION)
        {
            curtok++;
            act -= this.ERROR_ACTION;
        }

        return this.keywordKind[act == this.ERROR_ACTION  || curtok <= lasttok ? 0 : act];
    }

    public setInputChars(inputChars : string ) : void  { this.inputChars = inputChars; }


    //#line 10 "KWLexerMapF.gi

    static   tokenKind : number[]=  new Array(128)  ; 
    static  __b_init : boolean = JavaKWLexer.init_block(JavaKWLexer.tokenKind);
    static  init_block(tokenKind : number[]) : boolean
    {
        for (let i = 0; i < tokenKind.length; ++i) {
            tokenKind[i] = i;
        }
        tokenKind['$'.charCodeAt(0)] = JavaKWLexersym.Char_DollarSign;
        tokenKind['%'.charCodeAt(0)] = JavaKWLexersym.Char_Percent;
        tokenKind['_'.charCodeAt(0)] = JavaKWLexersym.Char__;

        tokenKind['a'.charCodeAt(0)] = JavaKWLexersym.Char_a;
        tokenKind['b'.charCodeAt(0)] = JavaKWLexersym.Char_b;
        tokenKind['c'.charCodeAt(0)] = JavaKWLexersym.Char_c;
        tokenKind['d'.charCodeAt(0)] = JavaKWLexersym.Char_d;
        tokenKind['e'.charCodeAt(0)] = JavaKWLexersym.Char_e;
        tokenKind['f'.charCodeAt(0)] = JavaKWLexersym.Char_f;
        tokenKind['g'.charCodeAt(0)] = JavaKWLexersym.Char_g;
        tokenKind['h'.charCodeAt(0)] = JavaKWLexersym.Char_h;
        tokenKind['i'.charCodeAt(0)] = JavaKWLexersym.Char_i;
        tokenKind['j'.charCodeAt(0)] = JavaKWLexersym.Char_j;
        tokenKind['k'.charCodeAt(0)] = JavaKWLexersym.Char_k;
        tokenKind['l'.charCodeAt(0)] = JavaKWLexersym.Char_l;
        tokenKind['m'.charCodeAt(0)] = JavaKWLexersym.Char_m;
        tokenKind['n'.charCodeAt(0)] = JavaKWLexersym.Char_n;
        tokenKind['o'.charCodeAt(0)] = JavaKWLexersym.Char_o;
        tokenKind['p'.charCodeAt(0)] = JavaKWLexersym.Char_p;
        tokenKind['q'.charCodeAt(0)] = JavaKWLexersym.Char_q;
        tokenKind['r'.charCodeAt(0)] = JavaKWLexersym.Char_r;
        tokenKind['s'.charCodeAt(0)] = JavaKWLexersym.Char_s;
        tokenKind['t'.charCodeAt(0)] = JavaKWLexersym.Char_t;
        tokenKind['u'.charCodeAt(0)] = JavaKWLexersym.Char_u;
        tokenKind['v'.charCodeAt(0)] = JavaKWLexersym.Char_v;
        tokenKind['w'.charCodeAt(0)] = JavaKWLexersym.Char_w;
        tokenKind['x'.charCodeAt(0)] = JavaKWLexersym.Char_x;
        tokenKind['y'.charCodeAt(0)] = JavaKWLexersym.Char_y;
        tokenKind['z'.charCodeAt(0)] = JavaKWLexersym.Char_z;

        tokenKind['A'.charCodeAt(0)] = JavaKWLexersym.Char_A;
        tokenKind['B'.charCodeAt(0)] = JavaKWLexersym.Char_B;
        tokenKind['C'.charCodeAt(0)] = JavaKWLexersym.Char_C;
        tokenKind['D'.charCodeAt(0)] = JavaKWLexersym.Char_D;
        tokenKind['E'.charCodeAt(0)] = JavaKWLexersym.Char_E;
        tokenKind['F'.charCodeAt(0)] = JavaKWLexersym.Char_F;
        tokenKind['G'.charCodeAt(0)] = JavaKWLexersym.Char_G;
        tokenKind['H'.charCodeAt(0)] = JavaKWLexersym.Char_H;
        tokenKind['I'.charCodeAt(0)] = JavaKWLexersym.Char_I;
        tokenKind['J'.charCodeAt(0)] = JavaKWLexersym.Char_J;
        tokenKind['K'.charCodeAt(0)] = JavaKWLexersym.Char_K;
        tokenKind['L'.charCodeAt(0)] = JavaKWLexersym.Char_L;
        tokenKind['M'.charCodeAt(0)] = JavaKWLexersym.Char_M;
        tokenKind['N'.charCodeAt(0)] = JavaKWLexersym.Char_N;
        tokenKind['O'.charCodeAt(0)] = JavaKWLexersym.Char_O;
        tokenKind['P'.charCodeAt(0)] = JavaKWLexersym.Char_P;
        tokenKind['Q'.charCodeAt(0)] = JavaKWLexersym.Char_Q;
        tokenKind['R'.charCodeAt(0)] = JavaKWLexersym.Char_R;
        tokenKind['S'.charCodeAt(0)] = JavaKWLexersym.Char_S;
        tokenKind['T'.charCodeAt(0)] = JavaKWLexersym.Char_T;
        tokenKind['U'.charCodeAt(0)] = JavaKWLexersym.Char_U;
        tokenKind['V'.charCodeAt(0)] = JavaKWLexersym.Char_V;
        tokenKind['W'.charCodeAt(0)] = JavaKWLexersym.Char_W;
        tokenKind['X'.charCodeAt(0)] = JavaKWLexersym.Char_X;
        tokenKind['Y'.charCodeAt(0)] = JavaKWLexersym.Char_Y;
        tokenKind['Z'.charCodeAt(0)] = JavaKWLexersym.Char_Z;
        return true;
    }

    public  static    getKind(c : number ) : number
    {
        return (((c & 0xFFFFFF80) == 0) /* 0 <= c < 128? */ ? JavaKWLexer.tokenKind[c] : 0);
    }

    //#line 101 "KeywordTemplateF.gi


    constructor( inputChars : string,  identifierKind : number)
    {
        super();
        this.inputChars = inputChars;
        this.keywordKind[0] = identifierKind;

        //
        // Rule 1:  KeyWord ::= a b s t r a c t
        //

        this.keywordKind[1] = (JavaParsersym.TK_abstract);
      
    
        //
        // Rule 2:  KeyWord ::= a s s e r t
        //

        this.keywordKind[2] = (JavaParsersym.TK_assert);
      
    
        //
        // Rule 3:  KeyWord ::= b o o l e a n
        //

        this.keywordKind[3] = (JavaParsersym.TK_boolean);
      
    
        //
        // Rule 4:  KeyWord ::= b r e a k
        //

        this.keywordKind[4] = (JavaParsersym.TK_break);
      
    
        //
        // Rule 5:  KeyWord ::= b y t e
        //

        this.keywordKind[5] = (JavaParsersym.TK_byte);
      
    
        //
        // Rule 6:  KeyWord ::= c a s e
        //

        this.keywordKind[6] = (JavaParsersym.TK_case);
      
    
        //
        // Rule 7:  KeyWord ::= c a t c h
        //

        this.keywordKind[7] = (JavaParsersym.TK_catch);
      
    
        //
        // Rule 8:  KeyWord ::= c h a r
        //

        this.keywordKind[8] = (JavaParsersym.TK_char);
      
    
        //
        // Rule 9:  KeyWord ::= c l a s s
        //

        this.keywordKind[9] = (JavaParsersym.TK_class);
      
    
        //
        // Rule 10:  KeyWord ::= c o n s t
        //

        this.keywordKind[10] = (JavaParsersym.TK_const);
      
    
        //
        // Rule 11:  KeyWord ::= c o n t i n u e
        //

        this.keywordKind[11] = (JavaParsersym.TK_continue);
      
    
        //
        // Rule 12:  KeyWord ::= d e f a u l t
        //

        this.keywordKind[12] = (JavaParsersym.TK_default);
      
    
        //
        // Rule 13:  KeyWord ::= d o
        //

        this.keywordKind[13] = (JavaParsersym.TK_do);
      
    
        //
        // Rule 14:  KeyWord ::= d o u b l e
        //

        this.keywordKind[14] = (JavaParsersym.TK_double);
      
    
        //
        // Rule 15:  KeyWord ::= e l s e
        //

        this.keywordKind[15] = (JavaParsersym.TK_else);
      
    
        //
        // Rule 16:  KeyWord ::= e n u m
        //

        this.keywordKind[16] = (JavaParsersym.TK_enum);
      
    
        //
        // Rule 17:  KeyWord ::= e x t e n d s
        //

        this.keywordKind[17] = (JavaParsersym.TK_extends);
      
    
        //
        // Rule 18:  KeyWord ::= f a l s e
        //

        this.keywordKind[18] = (JavaParsersym.TK_false);
      
    
        //
        // Rule 19:  KeyWord ::= f i n a l
        //

        this.keywordKind[19] = (JavaParsersym.TK_final);
      
    
        //
        // Rule 20:  KeyWord ::= f i n a l l y
        //

        this.keywordKind[20] = (JavaParsersym.TK_finally);
      
    
        //
        // Rule 21:  KeyWord ::= f l o a t
        //

        this.keywordKind[21] = (JavaParsersym.TK_float);
      
    
        //
        // Rule 22:  KeyWord ::= f o r
        //

        this.keywordKind[22] = (JavaParsersym.TK_for);
      
    
        //
        // Rule 23:  KeyWord ::= g o t o
        //

        this.keywordKind[23] = (JavaParsersym.TK_goto);
      
    
        //
        // Rule 24:  KeyWord ::= i f
        //

        this.keywordKind[24] = (JavaParsersym.TK_if);
      
    
        //
        // Rule 25:  KeyWord ::= i m p l e m e n t s
        //

        this.keywordKind[25] = (JavaParsersym.TK_implements);
      
    
        //
        // Rule 26:  KeyWord ::= i m p o r t
        //

        this.keywordKind[26] = (JavaParsersym.TK_import);
      
    
        //
        // Rule 27:  KeyWord ::= i n s t a n c e o f
        //

        this.keywordKind[27] = (JavaParsersym.TK_instanceof);
      
    
        //
        // Rule 28:  KeyWord ::= i n t
        //

        this.keywordKind[28] = (JavaParsersym.TK_int);
      
    
        //
        // Rule 29:  KeyWord ::= i n t e r f a c e
        //

        this.keywordKind[29] = (JavaParsersym.TK_interface);
      
    
        //
        // Rule 30:  KeyWord ::= l o n g
        //

        this.keywordKind[30] = (JavaParsersym.TK_long);
      
    
        //
        // Rule 31:  KeyWord ::= n a t i v e
        //

        this.keywordKind[31] = (JavaParsersym.TK_native);
      
    
        //
        // Rule 32:  KeyWord ::= n e w
        //

        this.keywordKind[32] = (JavaParsersym.TK_new);
      
    
        //
        // Rule 33:  KeyWord ::= n u l l
        //

        this.keywordKind[33] = (JavaParsersym.TK_null);
      
    
        //
        // Rule 34:  KeyWord ::= p a c k a g e
        //

        this.keywordKind[34] = (JavaParsersym.TK_package);
      
    
        //
        // Rule 35:  KeyWord ::= p r i v a t e
        //

        this.keywordKind[35] = (JavaParsersym.TK_private);
      
    
        //
        // Rule 36:  KeyWord ::= p r o t e c t e d
        //

        this.keywordKind[36] = (JavaParsersym.TK_protected);
      
    
        //
        // Rule 37:  KeyWord ::= p u b l i c
        //

        this.keywordKind[37] = (JavaParsersym.TK_public);
      
    
        //
        // Rule 38:  KeyWord ::= r e t u r n
        //

        this.keywordKind[38] = (JavaParsersym.TK_return);
      
    
        //
        // Rule 39:  KeyWord ::= s h o r t
        //

        this.keywordKind[39] = (JavaParsersym.TK_short);
      
    
        //
        // Rule 40:  KeyWord ::= s t a t i c
        //

        this.keywordKind[40] = (JavaParsersym.TK_static);
      
    
        //
        // Rule 41:  KeyWord ::= s t r i c t f p
        //

        this.keywordKind[41] = (JavaParsersym.TK_strictfp);
      
    
        //
        // Rule 42:  KeyWord ::= s u p e r
        //

        this.keywordKind[42] = (JavaParsersym.TK_super);
      
    
        //
        // Rule 43:  KeyWord ::= s w i t c h
        //

        this.keywordKind[43] = (JavaParsersym.TK_switch);
      
    
        //
        // Rule 44:  KeyWord ::= s y n c h r o n i z e d
        //

        this.keywordKind[44] = (JavaParsersym.TK_synchronized);
      
    
        //
        // Rule 45:  KeyWord ::= t h i s
        //

        this.keywordKind[45] = (JavaParsersym.TK_this);
      
    
        //
        // Rule 46:  KeyWord ::= t h r o w
        //

        this.keywordKind[46] = (JavaParsersym.TK_throw);
      
    
        //
        // Rule 47:  KeyWord ::= t h r o w s
        //

        this.keywordKind[47] = (JavaParsersym.TK_throws);
      
    
        //
        // Rule 48:  KeyWord ::= t r a n s i e n t
        //

        this.keywordKind[48] = (JavaParsersym.TK_transient);
      
    
        //
        // Rule 49:  KeyWord ::= t r u e
        //

        this.keywordKind[49] = (JavaParsersym.TK_true);
      
    
        //
        // Rule 50:  KeyWord ::= t r y
        //

        this.keywordKind[50] = (JavaParsersym.TK_try);
      
    
        //
        // Rule 51:  KeyWord ::= v o i d
        //

        this.keywordKind[51] = (JavaParsersym.TK_void);
      
    
        //
        // Rule 52:  KeyWord ::= v o l a t i l e
        //

        this.keywordKind[52] = (JavaParsersym.TK_volatile);
      
    
        //
        // Rule 53:  KeyWord ::= w h i l e
        //

        this.keywordKind[53] = (JavaParsersym.TK_while);
      
    
        //
        // Rule 54:  KeyWord ::= $ bB eE gG iI nN aA cC tT iI oO nN
        //

        this.keywordKind[54] = (JavaParsersym.TK_BeginAction);
      
    
        //
        // Rule 55:  KeyWord ::= $ bB eE gG iI nN jJ aA vV aA
        //

        this.keywordKind[55] = (JavaParsersym.TK_BeginJava);
      
    
        //
        // Rule 56:  KeyWord ::= $ eE nN dD aA cC tT iI oO nN
        //

        this.keywordKind[56] = (JavaParsersym.TK_EndAction);
      
    
        //
        // Rule 57:  KeyWord ::= $ eE nN dD jJ aA vV aA
        //

        this.keywordKind[57] = (JavaParsersym.TK_EndJava);
      
    
        //
        // Rule 58:  KeyWord ::= $ nN oO aA cC tT iI oO nN
        //

        this.keywordKind[58] = (JavaParsersym.TK_NoAction);
      
    
        //
        // Rule 59:  KeyWord ::= $ nN uU lL lL aA cC tT iI oO nN
        //

        this.keywordKind[59] = (JavaParsersym.TK_NullAction);
      
    
        //
        // Rule 60:  KeyWord ::= $ bB aA dD aA cC tT iI oO nN
        //

        this.keywordKind[60] = (JavaParsersym.TK_BadAction);
      
    
    //#line 112 "KeywordTemplateF.gi

        for (let i : number = 0; i < this.keywordKind.length; i++)
        {
            if (this.keywordKind[i] == 0)
                this.keywordKind[i] = identifierKind;
        }
    }
}

