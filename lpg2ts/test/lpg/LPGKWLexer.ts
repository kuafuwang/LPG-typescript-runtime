
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


    //#line 58 "KeywordTemplateF.gi


    //#line 46 "LPGKWLexer.gi

import { LPGKWLexerprs }  from ".\/LPGKWLexerprs"
import { LPGKWLexersym } from ".\/LPGKWLexersym";
import { LPGParsersym } from "./LPGParsersym";


    //#line 63 "KeywordTemplateF.gi

export class LPGKWLexer extends LPGKWLexerprs
{
    private inputChars : string;
    private   keywordKind  : number[] = new Array(29 + 1);

    public  getKeywordKinds() : number[] { return this.keywordKind; }

    public  lexer(curtok : number, lasttok : number) : number
    {
        let current_kind = LPGKWLexer.getKind(this.inputChars.charCodeAt(curtok)),
            act;

        for (act = this.tAction(this.START_STATE, current_kind);
             act > this.NUM_RULES && act < this.ACCEPT_ACTION;
             act = this.tAction(act, current_kind))
        {
            curtok++;
            current_kind = (curtok > lasttok
                                   ? LPGKWLexersym.Char_EOF
                                   : LPGKWLexer.getKind(this.inputChars.charCodeAt(curtok)));
        }

        if (act > this.ERROR_ACTION)
        {
            curtok++;
            act -= this.ERROR_ACTION;
        }

        return this.keywordKind[act == this.ERROR_ACTION  || curtok <= lasttok ? 0 : act];
    }

    public setInputChars(inputChars : string ) : void  { this.inputChars = inputChars; }


    //#line 9 "KWLexerFoldedCaseMapF.gi

    //
    // Each upper case letter is mapped into its corresponding
    // lower case counterpart. For example, if an 'A' appears
    // in the input, it is mapped into LPGKWLexersym.Char_a just
    // like 'a'.
    //
   public  static   tokenKind : number[]=  new Array(128)  ; 
     static  __b_init : boolean = LPGKWLexer.init_block(LPGKWLexer.tokenKind);
    static  init_block(tokenKind : number[]) : boolean
    {
        for (let i = 0; i < tokenKind.length; ++i) {
            tokenKind[i] = 0;
        }
        tokenKind['$'.charCodeAt(0)] = LPGKWLexersym.Char_DollarSign;
        tokenKind['%'.charCodeAt(0)] = LPGKWLexersym.Char_Percent;
        tokenKind['_'.charCodeAt(0)] = LPGKWLexersym.Char__;

        tokenKind['a'.charCodeAt(0)] = LPGKWLexersym.Char_a;
        tokenKind['b'.charCodeAt(0)] = LPGKWLexersym.Char_b;
        tokenKind['c'.charCodeAt(0)] = LPGKWLexersym.Char_c;
        tokenKind['d'.charCodeAt(0)] = LPGKWLexersym.Char_d;
        tokenKind['e'.charCodeAt(0)] = LPGKWLexersym.Char_e;
        tokenKind['f'.charCodeAt(0)] = LPGKWLexersym.Char_f;
        tokenKind['g'.charCodeAt(0)] = LPGKWLexersym.Char_g;
        tokenKind['h'.charCodeAt(0)] = LPGKWLexersym.Char_h;
        tokenKind['i'.charCodeAt(0)] = LPGKWLexersym.Char_i;
        tokenKind['j'.charCodeAt(0)] = LPGKWLexersym.Char_j;
        tokenKind['k'.charCodeAt(0)] = LPGKWLexersym.Char_k;
        tokenKind['l'.charCodeAt(0)] = LPGKWLexersym.Char_l;
        tokenKind['m'.charCodeAt(0)] = LPGKWLexersym.Char_m;
        tokenKind['n'.charCodeAt(0)] = LPGKWLexersym.Char_n;
        tokenKind['o'.charCodeAt(0)] = LPGKWLexersym.Char_o;
        tokenKind['p'.charCodeAt(0)] = LPGKWLexersym.Char_p;
        tokenKind['q'.charCodeAt(0)] = LPGKWLexersym.Char_q;
        tokenKind['r'.charCodeAt(0)] = LPGKWLexersym.Char_r;
        tokenKind['s'.charCodeAt(0)] = LPGKWLexersym.Char_s;
        tokenKind['t'.charCodeAt(0)] = LPGKWLexersym.Char_t;
        tokenKind['u'.charCodeAt(0)] = LPGKWLexersym.Char_u;
        tokenKind['v'.charCodeAt(0)] = LPGKWLexersym.Char_v;
        tokenKind['w'.charCodeAt(0)] = LPGKWLexersym.Char_w;
        tokenKind['x'.charCodeAt(0)] = LPGKWLexersym.Char_x;
        tokenKind['y'.charCodeAt(0)] = LPGKWLexersym.Char_y;
        tokenKind['z'.charCodeAt(0)] = LPGKWLexersym.Char_z;

        tokenKind['A'.charCodeAt(0)] = LPGKWLexersym.Char_a;
        tokenKind['B'.charCodeAt(0)] = LPGKWLexersym.Char_b;
        tokenKind['C'.charCodeAt(0)] = LPGKWLexersym.Char_c;
        tokenKind['D'.charCodeAt(0)] = LPGKWLexersym.Char_d;
        tokenKind['E'.charCodeAt(0)] = LPGKWLexersym.Char_e;
        tokenKind['F'.charCodeAt(0)] = LPGKWLexersym.Char_f;
        tokenKind['G'.charCodeAt(0)] = LPGKWLexersym.Char_g;
        tokenKind['H'.charCodeAt(0)] = LPGKWLexersym.Char_h;
        tokenKind['I'.charCodeAt(0)] = LPGKWLexersym.Char_i;
        tokenKind['J'.charCodeAt(0)] = LPGKWLexersym.Char_j;
        tokenKind['K'.charCodeAt(0)] = LPGKWLexersym.Char_k;
        tokenKind['L'.charCodeAt(0)] = LPGKWLexersym.Char_l;
        tokenKind['M'.charCodeAt(0)] = LPGKWLexersym.Char_m;
        tokenKind['N'.charCodeAt(0)] = LPGKWLexersym.Char_n;
        tokenKind['O'.charCodeAt(0)] = LPGKWLexersym.Char_o;
        tokenKind['P'.charCodeAt(0)] = LPGKWLexersym.Char_p;
        tokenKind['Q'.charCodeAt(0)] = LPGKWLexersym.Char_q;
        tokenKind['R'.charCodeAt(0)] = LPGKWLexersym.Char_r;
        tokenKind['S'.charCodeAt(0)] = LPGKWLexersym.Char_s;
        tokenKind['T'.charCodeAt(0)] = LPGKWLexersym.Char_t;
        tokenKind['U'.charCodeAt(0)] = LPGKWLexersym.Char_u;
        tokenKind['V'.charCodeAt(0)] = LPGKWLexersym.Char_v;
        tokenKind['W'.charCodeAt(0)] = LPGKWLexersym.Char_w;
        tokenKind['X'.charCodeAt(0)] = LPGKWLexersym.Char_x;
        tokenKind['Y'.charCodeAt(0)] = LPGKWLexersym.Char_y;
        tokenKind['Z'.charCodeAt(0)] = LPGKWLexersym.Char_z;
        return true;
    }

   public  static    getKind(c :number ):number
    {
        return (c < 128 ? LPGKWLexer.tokenKind[c] : 0);
    }

    //#line 101 "KeywordTemplateF.gi


    constructor( inputChars : string,  identifierKind : number)
    {
        super();
        this.inputChars = inputChars;
        this.keywordKind[0] = identifierKind;

        //
        // Rule 1:  Keyword ::= KeyPrefix a l i a s
        //

        this.keywordKind[1] = (LPGParsersym.TK_ALIAS_KEY);
      
    
        //
        // Rule 2:  Keyword ::= KeyPrefix a s t
        //

        this.keywordKind[2] = (LPGParsersym.TK_AST_KEY);
      
    
        //
        // Rule 3:  Keyword ::= KeyPrefix d e f i n e
        //

        this.keywordKind[3] = (LPGParsersym.TK_DEFINE_KEY);
      
    
        //
        // Rule 4:  Keyword ::= KeyPrefix d i s j o i n t p r e d e c e s s o r s e t s
        //

        this.keywordKind[4] = (LPGParsersym.TK_DISJOINTPREDECESSORSETS_KEY);
      
    
        //
        // Rule 5:  Keyword ::= KeyPrefix d r o p r u l e s
        //

        this.keywordKind[5] = (LPGParsersym.TK_DROPRULES_KEY);
      
    
        //
        // Rule 6:  Keyword ::= KeyPrefix d r o p s y m b o l s
        //

        this.keywordKind[6] = (LPGParsersym.TK_DROPSYMBOLS_KEY);
      
    
        //
        // Rule 7:  Keyword ::= KeyPrefix e m p t y
        //

        this.keywordKind[7] = (LPGParsersym.TK_EMPTY_KEY);
      
    
        //
        // Rule 8:  Keyword ::= KeyPrefix e n d
        //

        this.keywordKind[8] = (LPGParsersym.TK_END_KEY);
      
    
        //
        // Rule 9:  Keyword ::= KeyPrefix e r r o r
        //

        this.keywordKind[9] = (LPGParsersym.TK_ERROR_KEY);
      
    
        //
        // Rule 10:  Keyword ::= KeyPrefix e o l
        //

        this.keywordKind[10] = (LPGParsersym.TK_EOL_KEY);
      
    
        //
        // Rule 11:  Keyword ::= KeyPrefix e o f
        //

        this.keywordKind[11] = (LPGParsersym.TK_EOF_KEY);
      
    
        //
        // Rule 12:  Keyword ::= KeyPrefix e x p o r t
        //

        this.keywordKind[12] = (LPGParsersym.TK_EXPORT_KEY);
      
    
        //
        // Rule 13:  Keyword ::= KeyPrefix g l o b a l s
        //

        this.keywordKind[13] = (LPGParsersym.TK_GLOBALS_KEY);
      
    
        //
        // Rule 14:  Keyword ::= KeyPrefix h e a d e r s
        //

        this.keywordKind[14] = (LPGParsersym.TK_HEADERS_KEY);
      
    
        //
        // Rule 15:  Keyword ::= KeyPrefix i d e n t i f i e r
        //

        this.keywordKind[15] = (LPGParsersym.TK_IDENTIFIER_KEY);
      
    
        //
        // Rule 16:  Keyword ::= KeyPrefix i m p o r t
        //

        this.keywordKind[16] = (LPGParsersym.TK_IMPORT_KEY);
      
    
        //
        // Rule 17:  Keyword ::= KeyPrefix i n c l u d e
        //

        this.keywordKind[17] = (LPGParsersym.TK_INCLUDE_KEY);
      
    
        //
        // Rule 18:  Keyword ::= KeyPrefix k e y w o r d s
        //

        this.keywordKind[18] = (LPGParsersym.TK_KEYWORDS_KEY);
      
    
        //
        // Rule 19:  Keyword ::= KeyPrefix s o f t k e y w o r d s
        //

        this.keywordKind[19] = (LPGParsersym.TK_SOFT_KEYWORDS_KEY);
      
    
        //
        // Rule 20:  Keyword ::= KeyPrefix n a m e s
        //

        this.keywordKind[20] = (LPGParsersym.TK_NAMES_KEY);
      
    
        //
        // Rule 21:  Keyword ::= KeyPrefix n o t i c e
        //

        this.keywordKind[21] = (LPGParsersym.TK_NOTICE_KEY);
      
    
        //
        // Rule 22:  Keyword ::= KeyPrefix t e r m i n a l s
        //

        this.keywordKind[22] = (LPGParsersym.TK_TERMINALS_KEY);
      
    
        //
        // Rule 23:  Keyword ::= KeyPrefix r e c o v e r
        //

        this.keywordKind[23] = (LPGParsersym.TK_RECOVER_KEY);
      
    
        //
        // Rule 24:  Keyword ::= KeyPrefix r u l e s
        //

        this.keywordKind[24] = (LPGParsersym.TK_RULES_KEY);
      
    
        //
        // Rule 25:  Keyword ::= KeyPrefix s t a r t
        //

        this.keywordKind[25] = (LPGParsersym.TK_START_KEY);
      
    
        //
        // Rule 26:  Keyword ::= KeyPrefix t r a i l e r s
        //

        this.keywordKind[26] = (LPGParsersym.TK_TRAILERS_KEY);
      
    
        //
        // Rule 27:  Keyword ::= KeyPrefix t y p e s
        //

        this.keywordKind[27] = (LPGParsersym.TK_TYPES_KEY);
      
    
    //#line 112 "KeywordTemplateF.gi

        for (let i : number = 0; i < this.keywordKind.length; i++)
        {
            if (this.keywordKind[i] == 0)
                this.keywordKind[i] = identifierKind;
        }
    }
}

