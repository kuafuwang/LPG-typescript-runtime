
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


    //#line 123 "LexerTemplateF.gi

import { RuleAction, ParseTable, LexParser, ILexStream, IPrsStream, Monitor, LpgLexStream } from "..\/..\/src";
import { JavaKWLexer } from "./JavaKWLexer";
import { JavaLexerprs } from "./JavaLexerprs";
import { JavaLexersym } from "./JavaLexersym";
import { JavaParsersym } from "./JavaParsersym";

    //#line 129 "LexerTemplateF.gi

export class JavaLexer extends Object implements RuleAction
{
    private lexStream: JavaLexerLpgLexStream ;
    
    private static  prs : ParseTable = new JavaLexerprs();
    public  getParseTable() : ParseTable{ return JavaLexer.prs; }

    private  lexParser  : LexParser= new LexParser();
    public  getParser()  : LexParser{ return this.lexParser; }

    public  getToken(i : number)  : number{ return this.lexParser.getToken(i); }
    public  getRhsFirstTokenIndex(i : number) : number{ return this.lexParser.getFirstToken(i); }
    public  getRhsLastTokenIndex(i : number)  : number{ return this.lexParser.getLastToken(i); }

    public getLeftSpan() : number{ return this.lexParser.getToken(1); }
    public getRightSpan() : number { return this.lexParser.getLastToken(); }

    public  resetKeywordLexer() : void
    {
        if (!this.kwLexer)
              this.kwLexer = new JavaKWLexer(this.lexStream.getInputChars(), JavaParsersym.TK_IDENTIFIER);
         this.kwLexer.setInputChars(this.lexStream.getInputChars());
    }

  
    
    public  reset( filename : string,  tab : number = 4, input_chars? : string) : void
    {
        this.lexStream = new JavaLexerLpgLexStream(filename,input_chars, tab);
        this.lexParser.reset(<ILexStream>  this.lexStream, JavaLexer.prs, <RuleAction> this);
        this.resetKeywordLexer();
    }
    
   

    constructor( filename : string,  tab : number =  4 ,input_chars? : string)
    {
        super();
        this.lexStream = new JavaLexerLpgLexStream(filename,input_chars, tab);
        this.lexParser.reset(<ILexStream>  this.lexStream, JavaLexer.prs, <RuleAction> this);
        this.resetKeywordLexer();
    }

   

    public  getILexStream()  : ILexStream{ return  this.lexStream; }

    /**
     * @deprecated replaced by {@link #getILexStream()}
     */
    public  getLexStream()  : ILexStream{ return  this.lexStream; }

    private initializeLexer(prsStream : IPrsStream ,  start_offset : number, end_offset : number) : void 
    {
        if (this.lexStream.getInputChars() == null)
            throw new ReferenceError("LexStream was not initialized");
        this.lexStream.setPrsStream(prsStream);
        prsStream.makeToken(start_offset, end_offset, 0); // Token list must start with a bad token
    }

    private  addEOF(prsStream : IPrsStream, end_offset : number ) : void
    {
        prsStream.makeToken(end_offset, end_offset, JavaParsersym.TK_EOF_TOKEN); // and end with the end of file token
        prsStream.setStreamLength(prsStream.getSize());
    }

    public  lexerWithPosition(prsStream: IPrsStream , start_offset : number , end_offset : number, monitor? : Monitor) : void
    {
        if (start_offset <= 1)
             this.initializeLexer(prsStream, 0, -1);
        else this.initializeLexer(prsStream, start_offset - 1, start_offset - 1);

        this.lexParser.parseCharacters(start_offset, end_offset,monitor);

        this.addEOF(prsStream, (end_offset >= this.lexStream.getStreamIndex() ? this.lexStream.getStreamIndex() : end_offset + 1));
    }

    public  lexer(prsStream: IPrsStream ,  monitor? : Monitor) : void
    {
       
        this.initializeLexer(prsStream, 0, -1);
        this.lexParser.parseCharactersWhitMonitor(monitor);
        this.addEOF(prsStream, this.lexStream.getStreamIndex());
    }
   

    /**
     * If a parse stream was not passed to this Lexical analyser then we
     * simply report a lexical error. Otherwise, we produce a bad token.
     */
    public  reportLexicalError( startLoc : number,  endLoc : number) : void {
        let prs_stream = this.lexStream.getIPrsStream();
        if (!prs_stream)
            this.lexStream.reportLexicalError(startLoc, endLoc);
        else {
            //
            // Remove any token that may have been processed that fall in the
            // range of the lexical error... then add one error token that spans
            // the error range.
            //
            for (let i : number = prs_stream.getSize() - 1; i > 0; i--) {
                if (prs_stream.getStartOffset(i) >= startLoc)
                     prs_stream.removeLastToken();
                else break;
            }
            prs_stream.makeToken(startLoc, endLoc, 0); // add an error token to the this.prsStream
        }        
    }

    //#line 163 "LexerBasicMapF.gi


    //
    // The Lexer contains an array of characters as the input stream to be parsed.
    // There are methods to retrieve and classify characters.
    // The lexparser "token" is implemented simply as the index of the next character in the array.
    // The Lexer : the abstract class LpgLexStream with an implementation of the abstract
    // method getKind.  The template defines the Lexer class and the lexer() method.
    // A driver creates the action class, "Lexer", passing an Option object to the constructor.
    //
   kwLexer? :  JavaKWLexer ;
   public   printTokens : boolean =false;
   private static  readonly   ECLIPSE_TAB_VALUE: number = 4;

    public  getKeywordKinds() : number [] { 
        if(!this.kwLexer){
            throw Error("please initilize kwLexer");
        }
        return this.kwLexer.getKeywordKinds(); 
    }



    /**
     * @deprecated function replaced by {@link %reset(content : string, filename : string)}
     */
    public  initialize(content : string, filename : string) : void
    {
        this.reset(filename,4,content);
    }
    
    makeToken1(left_token : number,right_token : number, kind : number) : void
    {
        this.lexStream.makeToken(left_token, right_token, kind);
    }
    
    makeToken( arg0 : number, arg1?: number, arg2? : number) : void
    {
        if(arg1 && arg2){
        
            this.makeToken1(arg0,arg1,arg2);
            return ;
        }
        let  startOffset  = this.getLeftSpan();
        let   endOffset = this.getRightSpan();
        this.lexStream.makeToken(startOffset, endOffset, arg0);
        if (this.printTokens)  this.printValue(startOffset, endOffset);
    }

    makeComment(kind : number) : void
    {
        let startOffset =  this.getLeftSpan(),
            endOffset =  this.getRightSpan();
        this.lexStream.getIPrsStream()?.makeAdjunct(startOffset, endOffset, kind);
    }

     skipToken() : void 
    {
        if (this.printTokens)  this.printValue( this.getLeftSpan(),  this.getRightSpan());
    }
    
     checkForKeyWord1() : void 
    {
        if(!this.kwLexer){
            throw Error("please initilize kwLexer");
        }
        let startOffset =  this.getLeftSpan(),
            endOffset =  this.getRightSpan();
         let   kwKind = this.kwLexer.lexer(startOffset, endOffset);
        this.lexStream.makeToken(startOffset, endOffset, kwKind);
        if ( this.printTokens)  this.printValue(startOffset, endOffset);
    }
    
    //
    // This flavor of checkForKeyWord is necessary when the default kind
    // (which is returned when the keyword filter doesn't match) is something
    // other than _IDENTIFIER.
    //
     checkForKeyWord(defaultKind? :number) : void 
    {
       if(!defaultKind){
          this.checkForKeyWord1();
          return;
       }
        if(!this.kwLexer){
            throw Error("please initilize kwLexer");
        }
        let startOffset =  this.getLeftSpan(),
            endOffset =  this.getRightSpan();
        let    kwKind =  this.kwLexer.lexer(startOffset, endOffset);
        if (kwKind == JavaParsersym.TK_IDENTIFIER)
            kwKind = defaultKind;
        this.lexStream.makeToken(startOffset, endOffset, kwKind);
        if ( this.printTokens)  this.printValue(startOffset, endOffset);
    }
    
     printValue(startOffset : number, endOffset : number) : void 
    {
         let s = this.lexStream.getInputChars().substr(startOffset, endOffset - startOffset + 1);
         console.log(s);
    }

  

    //#line 242 "LexerTemplateF.gi

    public  ruleAction(ruleNumber : number ) : void
    {
        switch(ruleNumber)
        {

            //
            // Rule 1:  Token ::= Identifier
            //
            case 1: { 
                this.checkForKeyWord();
                  break;
            }
    
            //
            // Rule 2:  Token ::= " SLBody "
            //
            case 2: { 
                this.makeToken(JavaParsersym.TK_StringLiteral);
                  break;
            }
    
            //
            // Rule 3:  Token ::= ' NotSQ '
            //
            case 3: { 
                this.makeToken(JavaParsersym.TK_CharacterLiteral);
                  break;
            }
    
            //
            // Rule 4:  Token ::= IntegerLiteral
            //
            case 4: { 
                this.makeToken(JavaParsersym.TK_IntegerLiteral);
                  break;
            }
    
            //
            // Rule 5:  Token ::= FloatingPointLiteral
            //
            case 5: { 
                this.makeToken(JavaParsersym.TK_FloatingPointLiteral);
                  break;
            }
    
            //
            // Rule 6:  Token ::= DoubleLiteral
            //
            case 6: { 
                this.makeToken(JavaParsersym.TK_DoubleLiteral);
                  break;
            }
    
            //
            // Rule 7:  Token ::= / * Inside Stars /
            //
            case 7: { 
                this.skipToken();
                  break;
            }
    
            //
            // Rule 8:  Token ::= SLC
            //
            case 8: { 
                this.skipToken();
                  break;
            }
    
            //
            // Rule 9:  Token ::= WS
            //
            case 9: { 
                this.skipToken();
                  break;
            }
    
            //
            // Rule 10:  Token ::= +
            //
            case 10: { 
                this.makeToken(JavaParsersym.TK_PLUS);
                  break;
            }
    
            //
            // Rule 11:  Token ::= -
            //
            case 11: { 
                this.makeToken(JavaParsersym.TK_MINUS);
                  break;
            }
    
            //
            // Rule 12:  Token ::= *
            //
            case 12: { 
                this.makeToken(JavaParsersym.TK_MULTIPLY);
                  break;
            }
    
            //
            // Rule 13:  Token ::= /
            //
            case 13: { 
                this.makeToken(JavaParsersym.TK_DIVIDE);
                  break;
            }
    
            //
            // Rule 14:  Token ::= (
            //
            case 14: { 
                this.makeToken(JavaParsersym.TK_LPAREN);
                  break;
            }
    
            //
            // Rule 15:  Token ::= )
            //
            case 15: { 
                this.makeToken(JavaParsersym.TK_RPAREN);
                  break;
            }
    
            //
            // Rule 16:  Token ::= =
            //
            case 16: { 
                this.makeToken(JavaParsersym.TK_EQUAL);
                  break;
            }
    
            //
            // Rule 17:  Token ::= ,
            //
            case 17: { 
                this.makeToken(JavaParsersym.TK_COMMA);
                  break;
            }
    
            //
            // Rule 18:  Token ::= :
            //
            case 18: { 
                this.makeToken(JavaParsersym.TK_COLON);
                  break;
            }
    
            //
            // Rule 19:  Token ::= ;
            //
            case 19: { 
                this.makeToken(JavaParsersym.TK_SEMICOLON);
                  break;
            }
    
            //
            // Rule 20:  Token ::= ^
            //
            case 20: { 
                this.makeToken(JavaParsersym.TK_XOR);
                  break;
            }
    
            //
            // Rule 21:  Token ::= %
            //
            case 21: { 
                this.makeToken(JavaParsersym.TK_REMAINDER);
                  break;
            }
    
            //
            // Rule 22:  Token ::= ~
            //
            case 22: { 
                this.makeToken(JavaParsersym.TK_TWIDDLE);
                  break;
            }
    
            //
            // Rule 23:  Token ::= |
            //
            case 23: { 
                this.makeToken(JavaParsersym.TK_OR);
                  break;
            }
    
            //
            // Rule 24:  Token ::= &
            //
            case 24: { 
                this.makeToken(JavaParsersym.TK_AND);
                  break;
            }
    
            //
            // Rule 25:  Token ::= <
            //
            case 25: { 
                this.makeToken(JavaParsersym.TK_LESS);
                  break;
            }
    
            //
            // Rule 26:  Token ::= >
            //
            case 26: { 
                this.makeToken(JavaParsersym.TK_GREATER);
                  break;
            }
    
            //
            // Rule 27:  Token ::= .
            //
            case 27: { 
                this.makeToken(JavaParsersym.TK_DOT);
                  break;
            }
    
            //
            // Rule 28:  Token ::= !
            //
            case 28: { 
                this.makeToken(JavaParsersym.TK_NOT);
                  break;
            }
    
            //
            // Rule 29:  Token ::= [
            //
            case 29: { 
                this.makeToken(JavaParsersym.TK_LBRACKET);
                  break;
            }
    
            //
            // Rule 30:  Token ::= ]
            //
            case 30: { 
                this.makeToken(JavaParsersym.TK_RBRACKET);
                  break;
            }
    
            //
            // Rule 31:  Token ::= {
            //
            case 31: { 
                this.makeToken(JavaParsersym.TK_LBRACE);
                  break;
            }
    
            //
            // Rule 32:  Token ::= }
            //
            case 32: { 
                this.makeToken(JavaParsersym.TK_RBRACE);
                  break;
            }
    
            //
            // Rule 33:  Token ::= ?
            //
            case 33: { 
                this.makeToken(JavaParsersym.TK_QUESTION);
                  break;
            }
    
            //
            // Rule 34:  Token ::= @
            //
            case 34: { 
                this.makeToken(JavaParsersym.TK_AT);
                  break;
            }
    
            //
            // Rule 35:  Token ::= + +
            //
            case 35: { 
                this.makeToken(JavaParsersym.TK_PLUS_PLUS);
                  break;
            }
    
            //
            // Rule 36:  Token ::= - -
            //
            case 36: { 
                this.makeToken(JavaParsersym.TK_MINUS_MINUS);
                  break;
            }
    
            //
            // Rule 37:  Token ::= = =
            //
            case 37: { 
                this.makeToken(JavaParsersym.TK_EQUAL_EQUAL);
                  break;
            }
    
            //
            // Rule 38:  Token ::= < =
            //
            case 38: { 
                this.makeToken(JavaParsersym.TK_LESS_EQUAL);
                  break;
            }
    
            //
            // Rule 39:  Token ::= ! =
            //
            case 39: { 
                this.makeToken(JavaParsersym.TK_NOT_EQUAL);
                  break;
            }
    
            //
            // Rule 40:  Token ::= < <
            //
            case 40: { 
                this.makeToken(JavaParsersym.TK_LEFT_SHIFT);
                  break;
            }
    
            //
            // Rule 41:  Token ::= + =
            //
            case 41: { 
                this.makeToken(JavaParsersym.TK_PLUS_EQUAL);
                  break;
            }
    
            //
            // Rule 42:  Token ::= - =
            //
            case 42: { 
                this.makeToken(JavaParsersym.TK_MINUS_EQUAL);
                  break;
            }
    
            //
            // Rule 43:  Token ::= * =
            //
            case 43: { 
                this.makeToken(JavaParsersym.TK_MULTIPLY_EQUAL);
                  break;
            }
    
            //
            // Rule 44:  Token ::= / =
            //
            case 44: { 
                this.makeToken(JavaParsersym.TK_DIVIDE_EQUAL);
                  break;
            }
    
            //
            // Rule 45:  Token ::= & =
            //
            case 45: { 
                this.makeToken(JavaParsersym.TK_AND_EQUAL);
                  break;
            }
    
            //
            // Rule 46:  Token ::= | =
            //
            case 46: { 
                this.makeToken(JavaParsersym.TK_OR_EQUAL);
                  break;
            }
    
            //
            // Rule 47:  Token ::= ^ =
            //
            case 47: { 
                this.makeToken(JavaParsersym.TK_XOR_EQUAL);
                  break;
            }
    
            //
            // Rule 48:  Token ::= % =
            //
            case 48: { 
                this.makeToken(JavaParsersym.TK_REMAINDER_EQUAL);
                  break;
            }
    
            //
            // Rule 49:  Token ::= < < =
            //
            case 49: { 
                this.makeToken(JavaParsersym.TK_LEFT_SHIFT_EQUAL);
                  break;
            }
    
            //
            // Rule 50:  Token ::= | |
            //
            case 50: { 
                this.makeToken(JavaParsersym.TK_OR_OR);
                  break;
            }
    
            //
            // Rule 51:  Token ::= & &
            //
            case 51: { 
                this.makeToken(JavaParsersym.TK_AND_AND);
                  break;
            }
    
            //
            // Rule 52:  Token ::= . . .
            //
            case 52: { 
                this.makeToken(JavaParsersym.TK_ELLIPSIS);
                  break;
            }
    
    //#line 246 "LexerTemplateF.gi

    
            default:
                break;
        }
        return;
    }
}

    //#line 2 "LexerBasicMapF.gi
 
  export  class  JavaLexerLpgLexStream  extends LpgLexStream
    {
    public static tokenKind  : number[] =
    [
        JavaLexersym.Char_CtlCharNotWS,    // 000    0x00
        JavaLexersym.Char_CtlCharNotWS,    // 001    0x01
        JavaLexersym.Char_CtlCharNotWS,    // 002    0x02
        JavaLexersym.Char_CtlCharNotWS,    // 003    0x03
        JavaLexersym.Char_CtlCharNotWS,    // 004    0x04
        JavaLexersym.Char_CtlCharNotWS,    // 005    0x05
        JavaLexersym.Char_CtlCharNotWS,    // 006    0x06
        JavaLexersym.Char_CtlCharNotWS,    // 007    0x07
        JavaLexersym.Char_CtlCharNotWS,    // 008    0x08
        JavaLexersym.Char_HT,              // 009    0x09
        JavaLexersym.Char_LF,              // 010    0x0A
        JavaLexersym.Char_CtlCharNotWS,    // 011    0x0B
        JavaLexersym.Char_FF,              // 012    0x0C
        JavaLexersym.Char_CR,              // 013    0x0D
        JavaLexersym.Char_CtlCharNotWS,    // 014    0x0E
        JavaLexersym.Char_CtlCharNotWS,    // 015    0x0F
        JavaLexersym.Char_CtlCharNotWS,    // 016    0x10
        JavaLexersym.Char_CtlCharNotWS,    // 017    0x11
        JavaLexersym.Char_CtlCharNotWS,    // 018    0x12
        JavaLexersym.Char_CtlCharNotWS,    // 019    0x13
        JavaLexersym.Char_CtlCharNotWS,    // 020    0x14
        JavaLexersym.Char_CtlCharNotWS,    // 021    0x15
        JavaLexersym.Char_CtlCharNotWS,    // 022    0x16
        JavaLexersym.Char_CtlCharNotWS,    // 023    0x17
        JavaLexersym.Char_CtlCharNotWS,    // 024    0x18
        JavaLexersym.Char_CtlCharNotWS,    // 025    0x19
        JavaLexersym.Char_CtlCharNotWS,    // 026    0x1A
        JavaLexersym.Char_CtlCharNotWS,    // 027    0x1B
        JavaLexersym.Char_CtlCharNotWS,    // 028    0x1C
        JavaLexersym.Char_CtlCharNotWS,    // 029    0x1D
        JavaLexersym.Char_CtlCharNotWS,    // 030    0x1E
        JavaLexersym.Char_CtlCharNotWS,    // 031    0x1F
        JavaLexersym.Char_Space,           // 032    0x20
        JavaLexersym.Char_Exclamation,     // 033    0x21
        JavaLexersym.Char_DoubleQuote,     // 034    0x22
        JavaLexersym.Char_Sharp,           // 035    0x23
        JavaLexersym.Char_DollarSign,      // 036    0x24
        JavaLexersym.Char_Percent,         // 037    0x25
        JavaLexersym.Char_Ampersand,       // 038    0x26
        JavaLexersym.Char_SingleQuote,     // 039    0x27
        JavaLexersym.Char_LeftParen,       // 040    0x28
        JavaLexersym.Char_RightParen,      // 041    0x29
        JavaLexersym.Char_Star,            // 042    0x2A
        JavaLexersym.Char_Plus,            // 043    0x2B
        JavaLexersym.Char_Comma,           // 044    0x2C
        JavaLexersym.Char_Minus,           // 045    0x2D
        JavaLexersym.Char_Dot,             // 046    0x2E
        JavaLexersym.Char_Slash,           // 047    0x2F
        JavaLexersym.Char_0,               // 048    0x30
        JavaLexersym.Char_1,               // 049    0x31
        JavaLexersym.Char_2,               // 050    0x32
        JavaLexersym.Char_3,               // 051    0x33
        JavaLexersym.Char_4,               // 052    0x34
        JavaLexersym.Char_5,               // 053    0x35
        JavaLexersym.Char_6,               // 054    0x36
        JavaLexersym.Char_7,               // 055    0x37
        JavaLexersym.Char_8,               // 056    0x38
        JavaLexersym.Char_9,               // 057    0x39
        JavaLexersym.Char_Colon,           // 058    0x3A
        JavaLexersym.Char_SemiColon,       // 059    0x3B
        JavaLexersym.Char_LessThan,        // 060    0x3C
        JavaLexersym.Char_Equal,           // 061    0x3D
        JavaLexersym.Char_GreaterThan,     // 062    0x3E
        JavaLexersym.Char_QuestionMark,    // 063    0x3F
        JavaLexersym.Char_AtSign,          // 064    0x40
        JavaLexersym.Char_A,               // 065    0x41
        JavaLexersym.Char_B,               // 066    0x42
        JavaLexersym.Char_C,               // 067    0x43
        JavaLexersym.Char_D,               // 068    0x44
        JavaLexersym.Char_E,               // 069    0x45
        JavaLexersym.Char_F,               // 070    0x46
        JavaLexersym.Char_G,               // 071    0x47
        JavaLexersym.Char_H,               // 072    0x48
        JavaLexersym.Char_I,               // 073    0x49
        JavaLexersym.Char_J,               // 074    0x4A
        JavaLexersym.Char_K,               // 075    0x4B
        JavaLexersym.Char_L,               // 076    0x4C
        JavaLexersym.Char_M,               // 077    0x4D
        JavaLexersym.Char_N,               // 078    0x4E
        JavaLexersym.Char_O,               // 079    0x4F
        JavaLexersym.Char_P,               // 080    0x50
        JavaLexersym.Char_Q,               // 081    0x51
        JavaLexersym.Char_R,               // 082    0x52
        JavaLexersym.Char_S,               // 083    0x53
        JavaLexersym.Char_T,               // 084    0x54
        JavaLexersym.Char_U,               // 085    0x55
        JavaLexersym.Char_V,               // 086    0x56
        JavaLexersym.Char_W,               // 087    0x57
        JavaLexersym.Char_X,               // 088    0x58
        JavaLexersym.Char_Y,               // 089    0x59
        JavaLexersym.Char_Z,               // 090    0x5A
        JavaLexersym.Char_LeftBracket,     // 091    0x5B
        JavaLexersym.Char_BackSlash,       // 092    0x5C
        JavaLexersym.Char_RightBracket,    // 093    0x5D
        JavaLexersym.Char_Caret,           // 094    0x5E
        JavaLexersym.Char__,               // 095    0x5F
        JavaLexersym.Char_BackQuote,       // 096    0x60
        JavaLexersym.Char_a,               // 097    0x61
        JavaLexersym.Char_b,               // 098    0x62
        JavaLexersym.Char_c,               // 099    0x63
        JavaLexersym.Char_d,               // 100    0x64
        JavaLexersym.Char_e,               // 101    0x65
        JavaLexersym.Char_f,               // 102    0x66
        JavaLexersym.Char_g,               // 103    0x67
        JavaLexersym.Char_h,               // 104    0x68
        JavaLexersym.Char_i,               // 105    0x69
        JavaLexersym.Char_j,               // 106    0x6A
        JavaLexersym.Char_k,               // 107    0x6B
        JavaLexersym.Char_l,               // 108    0x6C
        JavaLexersym.Char_m,               // 109    0x6D
        JavaLexersym.Char_n,               // 110    0x6E
        JavaLexersym.Char_o,               // 111    0x6F
        JavaLexersym.Char_p,               // 112    0x70
        JavaLexersym.Char_q,               // 113    0x71
        JavaLexersym.Char_r,               // 114    0x72
        JavaLexersym.Char_s,               // 115    0x73
        JavaLexersym.Char_t,               // 116    0x74
        JavaLexersym.Char_u,               // 117    0x75
        JavaLexersym.Char_v,               // 118    0x76
        JavaLexersym.Char_w,               // 119    0x77
        JavaLexersym.Char_x,               // 120    0x78
        JavaLexersym.Char_y,               // 121    0x79
        JavaLexersym.Char_z,               // 122    0x7A
        JavaLexersym.Char_LeftBrace,       // 123    0x7B
        JavaLexersym.Char_VerticalBar,     // 124    0x7C
        JavaLexersym.Char_RightBrace,      // 125    0x7D
        JavaLexersym.Char_Tilde,           // 126    0x7E

        JavaLexersym.Char_AfterASCII,      // for all chars in range 128..65534
        JavaLexersym.Char_EOF              // for '\uffff' or 65535 
    ];
            
    public    getKind(i :number)  : number // Classify character at ith location
    {
        let c = (i >= this.getStreamLength() ? 0xffff : this.getIntValue(i));
        return (c < 128 // ASCII Character
                  ? JavaLexerLpgLexStream.tokenKind[c]
                  : c == 0xffff 
                       ? JavaLexersym.Char_EOF
                       : JavaLexersym.Char_AfterASCII);
    }

    public  orderedExportedSymbols(): string[]  { return JavaParsersym.orderedTerminalSymbols; }

  
     constructor(fileName: string, inputChars?: string, tab?: number) {
         super(fileName, inputChars, tab);
     }
    }

