
    //#line 153 "btParserTemplateF.gi



    //#line 8 "LPGParser.g

  
import {BadParseException, RuleAction, PrsStream, ParseTable, BacktrackingParser, IToken, ErrorToken, ILexStream, NullExportedSymbolsException, 
UnimplementedTerminalsException, Lpg, UndefinedEofSymbolException, NotBacktrackParseTableException, BadParseSymFileException, 
IPrsStream, Monitor, DiagnoseParser, IAst, IAstVisitor, IAbstractArrayList, NotDeterministicParseTableException,
 DeterministicParser, NullTerminalSymbolsException } from "..\/..\/src";

import { LPGParserprs } from ".\/LPGParserprs";
import { LPGParsersym } from ".\/LPGParsersym";
 
    //#line 159 "btParserTemplateF.gi

export class LPGParser extends Object implements RuleAction
{
    private  prsStream  : PrsStream = new PrsStream();
    
    private  unimplementedSymbolsWarning : boolean = false;

    private static  prsTable : ParseTable = new LPGParserprs();
    public  getParseTable() : ParseTable { return LPGParser.prsTable; }

    private  btParser : BacktrackingParser ;
    public  getParser() : BacktrackingParser{ return this.btParser; }

    private  setResult(object1 : any) : void{ this.btParser.setSym1(object1); }
    public  getRhsSym(i : number) : any{ return this.btParser.getSym(i); }

    public  getRhsTokenIndex(i : number) : number{ return this.btParser.getToken(i); }
    public  getRhsIToken(i : number) : IToken { return this.prsStream.getIToken(this.getRhsTokenIndex(i)); }
    
    public  getRhsFirstTokenIndex(i : number) : number { return this.btParser.getFirstToken(i); }
    public  getRhsFirstIToken(i : number) : IToken{ return this.prsStream.getIToken(this.getRhsFirstTokenIndex(i)); }

    public  getRhsLastTokenIndex(i : number):number { return this.btParser.getLastToken(i); }
    public  getRhsLastIToken(i : number):IToken { return this.prsStream.getIToken(this.getRhsLastTokenIndex(i)); }

    public getLeftSpan() :number { return this.btParser.getFirstToken(); }
    public  getLeftIToken() :IToken { return this.prsStream.getIToken(this.getLeftSpan()); }

    public getRightSpan() : number { return this.btParser.getLastToken(); }
    public  getRightIToken() : IToken { return this.prsStream.getIToken(this.getRightSpan()); }

    public  getRhsErrorTokenIndex(i : number) : number
    {
        let index = this.btParser.getToken(i);
        let err = this.prsStream.getIToken(index);
        return (err instanceof ErrorToken ? index : 0);
    }
    public  getRhsErrorIToken(i : number) : ErrorToken
    {
        let index = this.btParser.getToken(i);
        let err = this.prsStream.getIToken(index);
        return <ErrorToken> (err instanceof ErrorToken ? err : null);
    }

    public  reset(lexStream : ILexStream) : void
    {
        this.prsStream.resetLexStream(lexStream);
        this.btParser.reset(this.prsStream);

        try
        {
            this.prsStream.remapTerminalSymbols(this.orderedTerminalSymbols(), LPGParser.prsTable.getEoftSymbol());
        } 
        catch (e)
        {     
            if( e instanceof NullExportedSymbolsException){
                
            }
            else if( e instanceof UnimplementedTerminalsException){
                if (this.unimplementedSymbolsWarning) {
                    let unimplemented_symbols = e.getSymbols();
                    Lpg.Lang.System.Out.println("The Lexer will not scan the following token(s):");
                    for (let i : number = 0; i < unimplemented_symbols.size(); i++)
                    {
                        let id = <number>unimplemented_symbols.get(i);
                        Lpg.Lang.System.Out.println("    " + LPGParsersym.orderedTerminalSymbols[id]);               
                    }
                    Lpg.Lang.System.Out.println();
                }
            }
            else if( e instanceof UndefinedEofSymbolException){
                throw  (new UndefinedEofSymbolException
                    ("The Lexer does not implement the Eof symbol " +
                    LPGParsersym.orderedTerminalSymbols[LPGParser.prsTable.getEoftSymbol()]));
            }

        }
    }
    
    constructor(lexStream? :ILexStream)
    {
        super();
        try
        {
            this.btParser = new BacktrackingParser(null, LPGParser.prsTable, <RuleAction> this);
        }
        catch (e)
        {
            if(e instanceof NotBacktrackParseTableException)
            throw (new NotBacktrackParseTableException
                                ("Regenerate LPGParserprs.ts with -BACKTRACK option"));
            else if(e instanceof BadParseSymFileException){
                throw (new BadParseSymFileException("Bad Parser Symbol File -- LPGParsersym.ts"));
            }
            else{
                throw e;
            }
        }
        if(lexStream){
          this.reset(lexStream);
        }
    }
    
   
    
    public  numTokenKinds() :number { return LPGParsersym.numTokenKinds; }
    public  orderedTerminalSymbols()  : string[] { return LPGParsersym.orderedTerminalSymbols; }
    public  getTokenKindName(kind : number ) : string { return LPGParsersym.orderedTerminalSymbols[kind]; }
    public  getEOFTokenKind() : number{ return LPGParser.prsTable.getEoftSymbol(); }
    public  getIPrsStream()  : IPrsStream{ return this.prsStream; }

    /**
     * @deprecated replaced by {@link #getIPrsStream()}
     *
     */
    public  getPrsStream()  : PrsStream{ return this.prsStream; }

    /**
     * @deprecated replaced by {@link #getIPrsStream()}
     *
     */
    public  getParseStream() : PrsStream { return this.prsStream; }

 

    public parser(error_repair_count : number = 0 ,  monitor? : Monitor) :  any | null
    {
        this.btParser.setMonitor(monitor);
        
        try
        {
            return <any> this.btParser.fuzzyParse(error_repair_count);
        }
        catch (ex)
        {
           if( ex instanceof BadParseException ){
                 let e = <BadParseException>(ex);
                this.prsStream.reset(e.error_token); // point to error token

                let diagnoseParser = new DiagnoseParser(this.prsStream, LPGParser.prsTable);
                diagnoseParser.diagnose(e.error_token);
            }
            else{
                throw ex;
            }
        }

        return null;
    }

    //
    // Additional entry points, if any
    //
    

    //#line 236 "LPGParser.g



    //#line 318 "btParserTemplateF.gi

    
    public  ruleAction(ruleNumber : number) : void
    {
        switch (ruleNumber)
        {

            //
            // Rule 1:  LPG ::= options_segment LPG_INPUT
            //
            case 1: {
               //#line 49 "LPGParser.g"
                this.setResult(
                    //#line 49 LPGParser.g
                    new LPG(this.getLeftIToken(), this.getRightIToken(),
                            //#line 49 LPGParser.g
                            <option_specList>this.getRhsSym(1),
                            //#line 49 LPGParser.g
                            <LPG_itemList>this.getRhsSym(2))
                //#line 49 LPGParser.g
                );
            break;
            }
            //
            // Rule 2:  LPG_INPUT ::= %Empty
            //
            case 2: {
               //#line 52 "LPGParser.g"
                this.setResult(
                    //#line 52 LPGParser.g
                    new LPG_itemList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 52 LPGParser.g
                );
            break;
            }
            //
            // Rule 3:  LPG_INPUT ::= LPG_INPUT LPG_item
            //
            case 3: {
               //#line 53 "LPGParser.g"
                (<LPG_itemList>this.getRhsSym(1)).addElement(<ILPG_item>this.getRhsSym(2));
            break;
            }
            //
            // Rule 4:  LPG_item ::= ALIAS_KEY$ alias_segment END_KEY_OPT$
            //
            case 4: {
               //#line 56 "LPGParser.g"
                this.setResult(
                    //#line 56 LPGParser.g
                    new AliasSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 56 LPGParser.g
                                 <aliasSpecList>this.getRhsSym(2))
                //#line 56 LPGParser.g
                );
            break;
            }
            //
            // Rule 5:  LPG_item ::= AST_KEY$ ast_segment END_KEY_OPT$
            //
            case 5: {
               //#line 57 "LPGParser.g"
                this.setResult(
                    //#line 57 LPGParser.g
                    new AstSeg(this.getLeftIToken(), this.getRightIToken(),
                               //#line 57 LPGParser.g
                               <action_segmentList>this.getRhsSym(2))
                //#line 57 LPGParser.g
                );
            break;
            }
            //
            // Rule 6:  LPG_item ::= DEFINE_KEY$ define_segment END_KEY_OPT$
            //
            case 6: {
               //#line 58 "LPGParser.g"
                this.setResult(
                    //#line 58 LPGParser.g
                    new DefineSeg(this.getLeftIToken(), this.getRightIToken(),
                                  //#line 58 LPGParser.g
                                  <defineSpecList>this.getRhsSym(2))
                //#line 58 LPGParser.g
                );
            break;
            }
            //
            // Rule 7:  LPG_item ::= EOF_KEY$ eof_segment END_KEY_OPT$
            //
            case 7: {
               //#line 59 "LPGParser.g"
                this.setResult(
                    //#line 59 LPGParser.g
                    new EofSeg(this.getLeftIToken(), this.getRightIToken(),
                               //#line 59 LPGParser.g
                               <Ieof_segment>this.getRhsSym(2))
                //#line 59 LPGParser.g
                );
            break;
            }
            //
            // Rule 8:  LPG_item ::= EOL_KEY$ eol_segment END_KEY_OPT$
            //
            case 8: {
               //#line 60 "LPGParser.g"
                this.setResult(
                    //#line 60 LPGParser.g
                    new EolSeg(this.getLeftIToken(), this.getRightIToken(),
                               //#line 60 LPGParser.g
                               <Ieol_segment>this.getRhsSym(2))
                //#line 60 LPGParser.g
                );
            break;
            }
            //
            // Rule 9:  LPG_item ::= ERROR_KEY$ error_segment END_KEY_OPT$
            //
            case 9: {
               //#line 61 "LPGParser.g"
                this.setResult(
                    //#line 61 LPGParser.g
                    new ErrorSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 61 LPGParser.g
                                 <Ierror_segment>this.getRhsSym(2))
                //#line 61 LPGParser.g
                );
            break;
            }
            //
            // Rule 10:  LPG_item ::= EXPORT_KEY$ export_segment END_KEY_OPT$
            //
            case 10: {
               //#line 62 "LPGParser.g"
                this.setResult(
                    //#line 62 LPGParser.g
                    new ExportSeg(this.getLeftIToken(), this.getRightIToken(),
                                  //#line 62 LPGParser.g
                                  <terminal_symbolList>this.getRhsSym(2))
                //#line 62 LPGParser.g
                );
            break;
            }
            //
            // Rule 11:  LPG_item ::= GLOBALS_KEY$ globals_segment END_KEY_OPT$
            //
            case 11: {
               //#line 63 "LPGParser.g"
                this.setResult(
                    //#line 63 LPGParser.g
                    new GlobalsSeg(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 63 LPGParser.g
                                   <action_segmentList>this.getRhsSym(2))
                //#line 63 LPGParser.g
                );
            break;
            }
            //
            // Rule 12:  LPG_item ::= HEADERS_KEY$ headers_segment END_KEY_OPT$
            //
            case 12: {
               //#line 64 "LPGParser.g"
                this.setResult(
                    //#line 64 LPGParser.g
                    new HeadersSeg(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 64 LPGParser.g
                                   <action_segmentList>this.getRhsSym(2))
                //#line 64 LPGParser.g
                );
            break;
            }
            //
            // Rule 13:  LPG_item ::= IDENTIFIER_KEY$ identifier_segment END_KEY_OPT$
            //
            case 13: {
               //#line 65 "LPGParser.g"
                this.setResult(
                    //#line 65 LPGParser.g
                    new IdentifierSeg(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 65 LPGParser.g
                                      <Iidentifier_segment>this.getRhsSym(2))
                //#line 65 LPGParser.g
                );
            break;
            }
            //
            // Rule 14:  LPG_item ::= IMPORT_KEY$ import_segment END_KEY_OPT$
            //
            case 14: {
               //#line 66 "LPGParser.g"
                this.setResult(
                    //#line 66 LPGParser.g
                    new ImportSeg(this.getLeftIToken(), this.getRightIToken(),
                                  //#line 66 LPGParser.g
                                  <import_segment>this.getRhsSym(2))
                //#line 66 LPGParser.g
                );
            break;
            }
            //
            // Rule 15:  LPG_item ::= INCLUDE_KEY$ include_segment END_KEY_OPT$
            //
            case 15: {
               //#line 67 "LPGParser.g"
                this.setResult(
                    //#line 67 LPGParser.g
                    new IncludeSeg(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 67 LPGParser.g
                                   <include_segment>this.getRhsSym(2))
                //#line 67 LPGParser.g
                );
            break;
            }
            //
            // Rule 16:  LPG_item ::= KEYWORDS_KEY$ keywords_segment END_KEY_OPT$
            //
            case 16: {
               //#line 68 "LPGParser.g"
                this.setResult(
                    //#line 68 LPGParser.g
                    new KeywordsSeg(this.getLeftIToken(), this.getRightIToken(),
                                    //#line 68 LPGParser.g
                                    <keywordSpecList>this.getRhsSym(2))
                //#line 68 LPGParser.g
                );
            break;
            }
            //
            // Rule 17:  LPG_item ::= NAMES_KEY$ names_segment END_KEY_OPT$
            //
            case 17: {
               //#line 69 "LPGParser.g"
                this.setResult(
                    //#line 69 LPGParser.g
                    new NamesSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 69 LPGParser.g
                                 <nameSpecList>this.getRhsSym(2))
                //#line 69 LPGParser.g
                );
            break;
            }
            //
            // Rule 18:  LPG_item ::= NOTICE_KEY$ notice_segment END_KEY_OPT$
            //
            case 18: {
               //#line 70 "LPGParser.g"
                this.setResult(
                    //#line 70 LPGParser.g
                    new NoticeSeg(this.getLeftIToken(), this.getRightIToken(),
                                  //#line 70 LPGParser.g
                                  <action_segmentList>this.getRhsSym(2))
                //#line 70 LPGParser.g
                );
            break;
            }
            //
            // Rule 19:  LPG_item ::= RULES_KEY$ rules_segment END_KEY_OPT$
            //
            case 19: {
               //#line 71 "LPGParser.g"
                this.setResult(
                    //#line 71 LPGParser.g
                    new RulesSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 71 LPGParser.g
                                 <rules_segment>this.getRhsSym(2))
                //#line 71 LPGParser.g
                );
            break;
            }
            //
            // Rule 20:  LPG_item ::= SOFT_KEYWORDS_KEY$ keywords_segment END_KEY_OPT$
            //
            case 20: {
               //#line 72 "LPGParser.g"
                this.setResult(
                    //#line 72 LPGParser.g
                    new SoftKeywordsSeg(this.getLeftIToken(), this.getRightIToken(),
                                        //#line 72 LPGParser.g
                                        <keywordSpecList>this.getRhsSym(2))
                //#line 72 LPGParser.g
                );
            break;
            }
            //
            // Rule 21:  LPG_item ::= START_KEY$ start_segment END_KEY_OPT$
            //
            case 21: {
               //#line 73 "LPGParser.g"
                this.setResult(
                    //#line 73 LPGParser.g
                    new StartSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 73 LPGParser.g
                                 <start_symbolList>this.getRhsSym(2))
                //#line 73 LPGParser.g
                );
            break;
            }
            //
            // Rule 22:  LPG_item ::= TERMINALS_KEY$ terminals_segment END_KEY_OPT$
            //
            case 22: {
               //#line 74 "LPGParser.g"
                this.setResult(
                    //#line 74 LPGParser.g
                    new TerminalsSeg(this.getLeftIToken(), this.getRightIToken(),
                                     //#line 74 LPGParser.g
                                     <terminals_segment_terminalList>this.getRhsSym(2))
                //#line 74 LPGParser.g
                );
            break;
            }
            //
            // Rule 23:  LPG_item ::= TRAILERS_KEY$ trailers_segment END_KEY_OPT$
            //
            case 23: {
               //#line 75 "LPGParser.g"
                this.setResult(
                    //#line 75 LPGParser.g
                    new TrailersSeg(this.getLeftIToken(), this.getRightIToken(),
                                    //#line 75 LPGParser.g
                                    <action_segmentList>this.getRhsSym(2))
                //#line 75 LPGParser.g
                );
            break;
            }
            //
            // Rule 24:  LPG_item ::= TYPES_KEY$ types_segment END_KEY_OPT$
            //
            case 24: {
               //#line 76 "LPGParser.g"
                this.setResult(
                    //#line 76 LPGParser.g
                    new TypesSeg(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 76 LPGParser.g
                                 <type_declarationsList>this.getRhsSym(2))
                //#line 76 LPGParser.g
                );
            break;
            }
            //
            // Rule 25:  LPG_item ::= RECOVER_KEY$ recover_segment END_KEY_OPT$
            //
            case 25: {
               //#line 77 "LPGParser.g"
                this.setResult(
                    //#line 77 LPGParser.g
                    new RecoverSeg(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 77 LPGParser.g
                                   <SYMBOLList>this.getRhsSym(2))
                //#line 77 LPGParser.g
                );
            break;
            }
            //
            // Rule 26:  LPG_item ::= DISJOINTPREDECESSORSETS_KEY$ predecessor_segment END_KEY_OPT$
            //
            case 26: {
               //#line 78 "LPGParser.g"
                this.setResult(
                    //#line 78 LPGParser.g
                    new PredecessorSeg(this.getLeftIToken(), this.getRightIToken(),
                                       //#line 78 LPGParser.g
                                       <symbol_pairList>this.getRhsSym(2))
                //#line 78 LPGParser.g
                );
            break;
            }
            //
            // Rule 27:  options_segment ::= %Empty
            //
            case 27: {
               //#line 81 "LPGParser.g"
                this.setResult(
                    //#line 81 LPGParser.g
                    new option_specList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 81 LPGParser.g
                );
            break;
            }
            //
            // Rule 28:  options_segment ::= options_segment option_spec
            //
            case 28: {
               //#line 81 "LPGParser.g"
                (<option_specList>this.getRhsSym(1)).addElement(<option_spec>this.getRhsSym(2));
            break;
            }
            //
            // Rule 29:  option_spec ::= OPTIONS_KEY$ option_list
            //
            case 29: {
               //#line 82 "LPGParser.g"
                this.setResult(
                    //#line 82 LPGParser.g
                    new option_spec(this.getLeftIToken(), this.getRightIToken(),
                                    //#line 82 LPGParser.g
                                    <optionList>this.getRhsSym(2))
                //#line 82 LPGParser.g
                );
            break;
            }
            //
            // Rule 30:  option_list ::= option
            //
            case 30: {
               //#line 83 "LPGParser.g"
                this.setResult(
                    //#line 83 LPGParser.g
                    optionList.optionListfromElement(<option>this.getRhsSym(1), true /* left recursive */)
                //#line 83 LPGParser.g
                );
            break;
            }
            //
            // Rule 31:  option_list ::= option_list ,$ option
            //
            case 31: {
               //#line 83 "LPGParser.g"
                (<optionList>this.getRhsSym(1)).addElement(<option>this.getRhsSym(3));
            break;
            }
            //
            // Rule 32:  option ::= SYMBOL option_value
            //
            case 32: {
               //#line 84 "LPGParser.g"
                this.setResult(
                    //#line 84 LPGParser.g
                    new option(this.getLeftIToken(), this.getRightIToken(),
                               //#line 84 LPGParser.g
                               new ASTNodeToken(this.getRhsIToken(1)),
                               //#line 84 LPGParser.g
                               <Ioption_value>this.getRhsSym(2))
                //#line 84 LPGParser.g
                );
            break;
            }
            //
            // Rule 33:  option_value ::= %Empty
            //
            case 33: {
               //#line 85 "LPGParser.g"
                this.setResult(null);
            break;
            }
            //
            // Rule 34:  option_value ::= =$ SYMBOL
            //
            case 34: {
               //#line 85 "LPGParser.g"
                this.setResult(
                    //#line 85 LPGParser.g
                    new option_value0(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 85 LPGParser.g
                                      new ASTNodeToken(this.getRhsIToken(2)))
                //#line 85 LPGParser.g
                );
            break;
            }
            //
            // Rule 35:  option_value ::= =$ ($ symbol_list )$
            //
            case 35: {
               //#line 85 "LPGParser.g"
                this.setResult(
                    //#line 85 LPGParser.g
                    new option_value1(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 85 LPGParser.g
                                      <SYMBOLList>this.getRhsSym(3))
                //#line 85 LPGParser.g
                );
            break;
            }
            //
            // Rule 36:  symbol_list ::= SYMBOL
            //
            case 36: {
               //#line 87 "LPGParser.g"
                this.setResult(
                    //#line 87 LPGParser.g
                    SYMBOLList.SYMBOLListfromElement(new ASTNodeToken(this.getRhsIToken(1)), true /* left recursive */)
                //#line 87 LPGParser.g
                );
            break;
            }
            //
            // Rule 37:  symbol_list ::= symbol_list ,$ SYMBOL
            //
            case 37: {
               //#line 88 "LPGParser.g"
                (<SYMBOLList>this.getRhsSym(1)).addElement(new ASTNodeToken(this.getRhsIToken(3)));
            break;
            }
            //
            // Rule 38:  alias_segment ::= aliasSpec
            //
            case 38: {
               //#line 91 "LPGParser.g"
                this.setResult(
                    //#line 91 LPGParser.g
                    aliasSpecList.aliasSpecListfromElement(<IaliasSpec>this.getRhsSym(1), true /* left recursive */)
                //#line 91 LPGParser.g
                );
            break;
            }
            //
            // Rule 39:  alias_segment ::= alias_segment aliasSpec
            //
            case 39: {
               //#line 91 "LPGParser.g"
                (<aliasSpecList>this.getRhsSym(1)).addElement(<IaliasSpec>this.getRhsSym(2));
            break;
            }
            //
            // Rule 40:  aliasSpec ::= ERROR_KEY produces alias_rhs
            //
            case 40: {
               //#line 93 "LPGParser.g"
                this.setResult(
                    //#line 93 LPGParser.g
                    new aliasSpec0(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 93 LPGParser.g
                                   new ASTNodeToken(this.getRhsIToken(1)),
                                   //#line 93 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 93 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 93 LPGParser.g
                );
            break;
            }
            //
            // Rule 41:  aliasSpec ::= EOL_KEY produces alias_rhs
            //
            case 41: {
               //#line 94 "LPGParser.g"
                this.setResult(
                    //#line 94 LPGParser.g
                    new aliasSpec1(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 94 LPGParser.g
                                   new ASTNodeToken(this.getRhsIToken(1)),
                                   //#line 94 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 94 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 94 LPGParser.g
                );
            break;
            }
            //
            // Rule 42:  aliasSpec ::= EOF_KEY produces alias_rhs
            //
            case 42: {
               //#line 95 "LPGParser.g"
                this.setResult(
                    //#line 95 LPGParser.g
                    new aliasSpec2(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 95 LPGParser.g
                                   new ASTNodeToken(this.getRhsIToken(1)),
                                   //#line 95 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 95 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 95 LPGParser.g
                );
            break;
            }
            //
            // Rule 43:  aliasSpec ::= IDENTIFIER_KEY produces alias_rhs
            //
            case 43: {
               //#line 96 "LPGParser.g"
                this.setResult(
                    //#line 96 LPGParser.g
                    new aliasSpec3(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 96 LPGParser.g
                                   new ASTNodeToken(this.getRhsIToken(1)),
                                   //#line 96 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 96 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 96 LPGParser.g
                );
            break;
            }
            //
            // Rule 44:  aliasSpec ::= SYMBOL produces alias_rhs
            //
            case 44: {
               //#line 97 "LPGParser.g"
                this.setResult(
                    //#line 97 LPGParser.g
                    new aliasSpec4(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 97 LPGParser.g
                                   new ASTNodeToken(this.getRhsIToken(1)),
                                   //#line 97 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 97 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 97 LPGParser.g
                );
            break;
            }
            //
            // Rule 45:  aliasSpec ::= alias_lhs_macro_name produces alias_rhs
            //
            case 45: {
               //#line 98 "LPGParser.g"
                this.setResult(
                    //#line 98 LPGParser.g
                    new aliasSpec5(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 98 LPGParser.g
                                   <alias_lhs_macro_name>this.getRhsSym(1),
                                   //#line 98 LPGParser.g
                                   <Iproduces>this.getRhsSym(2),
                                   //#line 98 LPGParser.g
                                   <Ialias_rhs>this.getRhsSym(3))
                //#line 98 LPGParser.g
                );
            break;
            }
            //
            // Rule 46:  alias_lhs_macro_name ::= MACRO_NAME
            //
            case 46: {
               //#line 100 "LPGParser.g"
                this.setResult(
                    //#line 100 LPGParser.g
                    new alias_lhs_macro_name(this.getRhsIToken(1))
                //#line 100 LPGParser.g
                );
            break;
            }
            //
            // Rule 47:  alias_rhs ::= SYMBOL
            //
            case 47: {
               //#line 102 "LPGParser.g"
                this.setResult(
                    //#line 102 LPGParser.g
                    new alias_rhs0(this.getRhsIToken(1))
                //#line 102 LPGParser.g
                );
            break;
            }
            //
            // Rule 48:  alias_rhs ::= MACRO_NAME
            //
            case 48: {
               //#line 103 "LPGParser.g"
                this.setResult(
                    //#line 103 LPGParser.g
                    new alias_rhs1(this.getRhsIToken(1))
                //#line 103 LPGParser.g
                );
            break;
            }
            //
            // Rule 49:  alias_rhs ::= ERROR_KEY
            //
            case 49: {
               //#line 104 "LPGParser.g"
                this.setResult(
                    //#line 104 LPGParser.g
                    new alias_rhs2(this.getRhsIToken(1))
                //#line 104 LPGParser.g
                );
            break;
            }
            //
            // Rule 50:  alias_rhs ::= EOL_KEY
            //
            case 50: {
               //#line 105 "LPGParser.g"
                this.setResult(
                    //#line 105 LPGParser.g
                    new alias_rhs3(this.getRhsIToken(1))
                //#line 105 LPGParser.g
                );
            break;
            }
            //
            // Rule 51:  alias_rhs ::= EOF_KEY
            //
            case 51: {
               //#line 106 "LPGParser.g"
                this.setResult(
                    //#line 106 LPGParser.g
                    new alias_rhs4(this.getRhsIToken(1))
                //#line 106 LPGParser.g
                );
            break;
            }
            //
            // Rule 52:  alias_rhs ::= EMPTY_KEY
            //
            case 52: {
               //#line 107 "LPGParser.g"
                this.setResult(
                    //#line 107 LPGParser.g
                    new alias_rhs5(this.getRhsIToken(1))
                //#line 107 LPGParser.g
                );
            break;
            }
            //
            // Rule 53:  alias_rhs ::= IDENTIFIER_KEY
            //
            case 53: {
               //#line 108 "LPGParser.g"
                this.setResult(
                    //#line 108 LPGParser.g
                    new alias_rhs6(this.getRhsIToken(1))
                //#line 108 LPGParser.g
                );
            break;
            }
            //
            // Rule 54:  ast_segment ::= action_segment_list
            //
            case 54:
                break;
            //
            // Rule 55:  define_segment ::= defineSpec
            //
            case 55: {
               //#line 114 "LPGParser.g"
                this.setResult(
                    //#line 114 LPGParser.g
                    defineSpecList.defineSpecListfromElement(<defineSpec>this.getRhsSym(1), true /* left recursive */)
                //#line 114 LPGParser.g
                );
            break;
            }
            //
            // Rule 56:  define_segment ::= define_segment defineSpec
            //
            case 56: {
               //#line 114 "LPGParser.g"
                (<defineSpecList>this.getRhsSym(1)).addElement(<defineSpec>this.getRhsSym(2));
            break;
            }
            //
            // Rule 57:  defineSpec ::= macro_name_symbol macro_segment
            //
            case 57: {
               //#line 115 "LPGParser.g"
                this.setResult(
                    //#line 115 LPGParser.g
                    new defineSpec(this.getLeftIToken(), this.getRightIToken(),
                                   //#line 115 LPGParser.g
                                   <Imacro_name_symbol>this.getRhsSym(1),
                                   //#line 115 LPGParser.g
                                   <macro_segment>this.getRhsSym(2))
                //#line 115 LPGParser.g
                );
            break;
            }
            //
            // Rule 58:  macro_name_symbol ::= MACRO_NAME
            //
            case 58: {
               //#line 118 "LPGParser.g"
                this.setResult(
                    //#line 118 LPGParser.g
                    new macro_name_symbol0(this.getRhsIToken(1))
                //#line 118 LPGParser.g
                );
            break;
            }
            //
            // Rule 59:  macro_name_symbol ::= SYMBOL
            //
            case 59: {
               //#line 119 "LPGParser.g"
                this.setResult(
                    //#line 119 LPGParser.g
                    new macro_name_symbol1(this.getRhsIToken(1))
                //#line 119 LPGParser.g
                );
            break;
            }
            //
            // Rule 60:  macro_segment ::= BLOCK
            //
            case 60: {
               //#line 120 "LPGParser.g"
                this.setResult(
                    //#line 120 LPGParser.g
                    new macro_segment(this.getRhsIToken(1))
                //#line 120 LPGParser.g
                );
            break;
            }
            //
            // Rule 61:  eol_segment ::= terminal_symbol
            //
            case 61:
                break;
            //
            // Rule 62:  eof_segment ::= terminal_symbol
            //
            case 62:
                break;
            //
            // Rule 63:  error_segment ::= terminal_symbol
            //
            case 63:
                break;
            //
            // Rule 64:  export_segment ::= terminal_symbol
            //
            case 64: {
               //#line 130 "LPGParser.g"
                this.setResult(
                    //#line 130 LPGParser.g
                    terminal_symbolList.terminal_symbolListfromElement(<Iterminal_symbol>this.getRhsSym(1), true /* left recursive */)
                //#line 130 LPGParser.g
                );
            break;
            }
            //
            // Rule 65:  export_segment ::= export_segment terminal_symbol
            //
            case 65: {
               //#line 130 "LPGParser.g"
                (<terminal_symbolList>this.getRhsSym(1)).addElement(<Iterminal_symbol>this.getRhsSym(2));
            break;
            }
            //
            // Rule 66:  globals_segment ::= action_segment
            //
            case 66: {
               //#line 133 "LPGParser.g"
                this.setResult(
                    //#line 133 LPGParser.g
                    action_segmentList.action_segmentListfromElement(<action_segment>this.getRhsSym(1), true /* left recursive */)
                //#line 133 LPGParser.g
                );
            break;
            }
            //
            // Rule 67:  globals_segment ::= globals_segment action_segment
            //
            case 67: {
               //#line 133 "LPGParser.g"
                (<action_segmentList>this.getRhsSym(1)).addElement(<action_segment>this.getRhsSym(2));
            break;
            }
            //
            // Rule 68:  headers_segment ::= action_segment_list
            //
            case 68:
                break;
            //
            // Rule 69:  identifier_segment ::= terminal_symbol
            //
            case 69:
                break;
            //
            // Rule 70:  import_segment ::= SYMBOL drop_command_list
            //
            case 70: {
               //#line 142 "LPGParser.g"
                this.setResult(
                    //#line 142 LPGParser.g
                    new import_segment(this.getLeftIToken(), this.getRightIToken(),
                                       //#line 142 LPGParser.g
                                       new ASTNodeToken(this.getRhsIToken(1)),
                                       //#line 142 LPGParser.g
                                       <drop_commandList>this.getRhsSym(2))
                //#line 142 LPGParser.g
                );
            break;
            }
            //
            // Rule 71:  drop_command_list ::= %Empty
            //
            case 71: {
               //#line 144 "LPGParser.g"
                this.setResult(
                    //#line 144 LPGParser.g
                    new drop_commandList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 144 LPGParser.g
                );
            break;
            }
            //
            // Rule 72:  drop_command_list ::= drop_command_list drop_command
            //
            case 72: {
               //#line 144 "LPGParser.g"
                (<drop_commandList>this.getRhsSym(1)).addElement(<Idrop_command>this.getRhsSym(2));
            break;
            }
            //
            // Rule 73:  drop_command ::= DROPSYMBOLS_KEY drop_symbols
            //
            case 73: {
               //#line 146 "LPGParser.g"
                this.setResult(
                    //#line 146 LPGParser.g
                    new drop_command0(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 146 LPGParser.g
                                      new ASTNodeToken(this.getRhsIToken(1)),
                                      //#line 146 LPGParser.g
                                      <SYMBOLList>this.getRhsSym(2))
                //#line 146 LPGParser.g
                );
            break;
            }
            //
            // Rule 74:  drop_command ::= DROPRULES_KEY drop_rules
            //
            case 74: {
               //#line 147 "LPGParser.g"
                this.setResult(
                    //#line 147 LPGParser.g
                    new drop_command1(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 147 LPGParser.g
                                      new ASTNodeToken(this.getRhsIToken(1)),
                                      //#line 147 LPGParser.g
                                      <drop_ruleList>this.getRhsSym(2))
                //#line 147 LPGParser.g
                );
            break;
            }
            //
            // Rule 75:  drop_symbols ::= SYMBOL
            //
            case 75: {
               //#line 149 "LPGParser.g"
                this.setResult(
                    //#line 149 LPGParser.g
                    SYMBOLList.SYMBOLListfromElement(new ASTNodeToken(this.getRhsIToken(1)), true /* left recursive */)
                //#line 149 LPGParser.g
                );
            break;
            }
            //
            // Rule 76:  drop_symbols ::= drop_symbols SYMBOL
            //
            case 76: {
               //#line 150 "LPGParser.g"
                (<SYMBOLList>this.getRhsSym(1)).addElement(new ASTNodeToken(this.getRhsIToken(2)));
            break;
            }
            //
            // Rule 77:  drop_rules ::= drop_rule
            //
            case 77: {
               //#line 151 "LPGParser.g"
                this.setResult(
                    //#line 151 LPGParser.g
                    drop_ruleList.drop_ruleListfromElement(<drop_rule>this.getRhsSym(1), true /* left recursive */)
                //#line 151 LPGParser.g
                );
            break;
            }
            //
            // Rule 78:  drop_rules ::= drop_rules drop_rule
            //
            case 78: {
               //#line 152 "LPGParser.g"
                (<drop_ruleList>this.getRhsSym(1)).addElement(<drop_rule>this.getRhsSym(2));
            break;
            }
            //
            // Rule 79:  drop_rule ::= SYMBOL optMacroName produces ruleList
            //
            case 79: {
               //#line 154 "LPGParser.g"
                this.setResult(
                    //#line 154 LPGParser.g
                    new drop_rule(this.getLeftIToken(), this.getRightIToken(),
                                  //#line 154 LPGParser.g
                                  new ASTNodeToken(this.getRhsIToken(1)),
                                  //#line 154 LPGParser.g
                                  <optMacroName>this.getRhsSym(2),
                                  //#line 154 LPGParser.g
                                  <Iproduces>this.getRhsSym(3),
                                  //#line 154 LPGParser.g
                                  <ruleList>this.getRhsSym(4))
                //#line 154 LPGParser.g
                );
            break;
            }
            //
            // Rule 80:  optMacroName ::= %Empty
            //
            case 80: {
               //#line 156 "LPGParser.g"
                this.setResult(null);
            break;
            }
            //
            // Rule 81:  optMacroName ::= MACRO_NAME
            //
            case 81: {
               //#line 156 "LPGParser.g"
                this.setResult(
                    //#line 156 LPGParser.g
                    new optMacroName(this.getRhsIToken(1))
                //#line 156 LPGParser.g
                );
            break;
            }
            //
            // Rule 82:  include_segment ::= SYMBOL
            //
            case 82: {
               //#line 159 "LPGParser.g"
                this.setResult(
                    //#line 159 LPGParser.g
                    new include_segment(this.getRhsIToken(1))
                //#line 159 LPGParser.g
                );
            break;
            }
            //
            // Rule 83:  keywords_segment ::= keywordSpec
            //
            case 83: {
               //#line 162 "LPGParser.g"
                this.setResult(
                    //#line 162 LPGParser.g
                    keywordSpecList.keywordSpecListfromElement(<IkeywordSpec>this.getRhsSym(1), true /* left recursive */)
                //#line 162 LPGParser.g
                );
            break;
            }
            //
            // Rule 84:  keywords_segment ::= keywords_segment keywordSpec
            //
            case 84: {
               //#line 162 "LPGParser.g"
                (<keywordSpecList>this.getRhsSym(1)).addElement(<IkeywordSpec>this.getRhsSym(2));
            break;
            }
            //
            // Rule 85:  keywordSpec ::= terminal_symbol
            //
            case 85:
                break;
            //
            // Rule 86:  keywordSpec ::= terminal_symbol produces name
            //
            case 86: {
               //#line 164 "LPGParser.g"
                this.setResult(
                    //#line 164 LPGParser.g
                    new keywordSpec(this.getLeftIToken(), this.getRightIToken(),
                                    //#line 164 LPGParser.g
                                    <Iterminal_symbol>this.getRhsSym(1),
                                    //#line 164 LPGParser.g
                                    <Iproduces>this.getRhsSym(2),
                                    //#line 164 LPGParser.g
                                    <Iname>this.getRhsSym(3))
                //#line 164 LPGParser.g
                );
            break;
            }
            //
            // Rule 87:  names_segment ::= nameSpec
            //
            case 87: {
               //#line 167 "LPGParser.g"
                this.setResult(
                    //#line 167 LPGParser.g
                    nameSpecList.nameSpecListfromElement(<nameSpec>this.getRhsSym(1), true /* left recursive */)
                //#line 167 LPGParser.g
                );
            break;
            }
            //
            // Rule 88:  names_segment ::= names_segment nameSpec
            //
            case 88: {
               //#line 167 "LPGParser.g"
                (<nameSpecList>this.getRhsSym(1)).addElement(<nameSpec>this.getRhsSym(2));
            break;
            }
            //
            // Rule 89:  nameSpec ::= name produces name
            //
            case 89: {
               //#line 168 "LPGParser.g"
                this.setResult(
                    //#line 168 LPGParser.g
                    new nameSpec(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 168 LPGParser.g
                                 <Iname>this.getRhsSym(1),
                                 //#line 168 LPGParser.g
                                 <Iproduces>this.getRhsSym(2),
                                 //#line 168 LPGParser.g
                                 <Iname>this.getRhsSym(3))
                //#line 168 LPGParser.g
                );
            break;
            }
            //
            // Rule 90:  name ::= SYMBOL
            //
            case 90: {
               //#line 170 "LPGParser.g"
                this.setResult(
                    //#line 170 LPGParser.g
                    new name0(this.getRhsIToken(1))
                //#line 170 LPGParser.g
                );
            break;
            }
            //
            // Rule 91:  name ::= MACRO_NAME
            //
            case 91: {
               //#line 171 "LPGParser.g"
                this.setResult(
                    //#line 171 LPGParser.g
                    new name1(this.getRhsIToken(1))
                //#line 171 LPGParser.g
                );
            break;
            }
            //
            // Rule 92:  name ::= EMPTY_KEY
            //
            case 92: {
               //#line 172 "LPGParser.g"
                this.setResult(
                    //#line 172 LPGParser.g
                    new name2(this.getRhsIToken(1))
                //#line 172 LPGParser.g
                );
            break;
            }
            //
            // Rule 93:  name ::= ERROR_KEY
            //
            case 93: {
               //#line 173 "LPGParser.g"
                this.setResult(
                    //#line 173 LPGParser.g
                    new name3(this.getRhsIToken(1))
                //#line 173 LPGParser.g
                );
            break;
            }
            //
            // Rule 94:  name ::= EOL_KEY
            //
            case 94: {
               //#line 174 "LPGParser.g"
                this.setResult(
                    //#line 174 LPGParser.g
                    new name4(this.getRhsIToken(1))
                //#line 174 LPGParser.g
                );
            break;
            }
            //
            // Rule 95:  name ::= IDENTIFIER_KEY
            //
            case 95: {
               //#line 175 "LPGParser.g"
                this.setResult(
                    //#line 175 LPGParser.g
                    new name5(this.getRhsIToken(1))
                //#line 175 LPGParser.g
                );
            break;
            }
            //
            // Rule 96:  notice_segment ::= action_segment
            //
            case 96: {
               //#line 178 "LPGParser.g"
                this.setResult(
                    //#line 178 LPGParser.g
                    action_segmentList.action_segmentListfromElement(<action_segment>this.getRhsSym(1), true /* left recursive */)
                //#line 178 LPGParser.g
                );
            break;
            }
            //
            // Rule 97:  notice_segment ::= notice_segment action_segment
            //
            case 97: {
               //#line 178 "LPGParser.g"
                (<action_segmentList>this.getRhsSym(1)).addElement(<action_segment>this.getRhsSym(2));
            break;
            }
            //
            // Rule 98:  rules_segment ::= action_segment_list nonTermList
            //
            case 98: {
               //#line 181 "LPGParser.g"
                this.setResult(
                    //#line 181 LPGParser.g
                    new rules_segment(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 181 LPGParser.g
                                      <action_segmentList>this.getRhsSym(1),
                                      //#line 181 LPGParser.g
                                      <nonTermList>this.getRhsSym(2))
                //#line 181 LPGParser.g
                );
            break;
            }
            //
            // Rule 99:  nonTermList ::= %Empty
            //
            case 99: {
               //#line 183 "LPGParser.g"
                this.setResult(
                    //#line 183 LPGParser.g
                    new nonTermList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 183 LPGParser.g
                );
            break;
            }
            //
            // Rule 100:  nonTermList ::= nonTermList nonTerm
            //
            case 100: {
               //#line 183 "LPGParser.g"
                (<nonTermList>this.getRhsSym(1)).addElement(<nonTerm>this.getRhsSym(2));
            break;
            }
            //
            // Rule 101:  nonTerm ::= ruleNameWithAttributes produces ruleList
            //
            case 101: {
               //#line 185 "LPGParser.g"
                this.setResult(
                    //#line 185 LPGParser.g
                    new nonTerm(this.getLeftIToken(), this.getRightIToken(),
                                //#line 185 LPGParser.g
                                <RuleName>this.getRhsSym(1),
                                //#line 185 LPGParser.g
                                <Iproduces>this.getRhsSym(2),
                                //#line 185 LPGParser.g
                                <ruleList>this.getRhsSym(3))
                //#line 185 LPGParser.g
                );
            break;
            }
            //
            // Rule 102:  ruleNameWithAttributes ::= SYMBOL
            //
            case 102: {
               //#line 189 "LPGParser.g"
                this.setResult(
                    //#line 189 LPGParser.g
                    new RuleName(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 189 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(1)),
                                 //#line 189 LPGParser.g
                                 null,
                                 //#line 189 LPGParser.g
                                 null)
                //#line 189 LPGParser.g
                );
            break;
            }
            //
            // Rule 103:  ruleNameWithAttributes ::= SYMBOL MACRO_NAME$className
            //
            case 103: {
               //#line 190 "LPGParser.g"
                this.setResult(
                    //#line 190 LPGParser.g
                    new RuleName(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 190 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(1)),
                                 //#line 190 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(2)),
                                 //#line 190 LPGParser.g
                                 null)
                //#line 190 LPGParser.g
                );
            break;
            }
            //
            // Rule 104:  ruleNameWithAttributes ::= SYMBOL MACRO_NAME$className MACRO_NAME$arrayElement
            //
            case 104: {
               //#line 191 "LPGParser.g"
                this.setResult(
                    //#line 191 LPGParser.g
                    new RuleName(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 191 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(1)),
                                 //#line 191 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(2)),
                                 //#line 191 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(3)))
                //#line 191 LPGParser.g
                );
            break;
            }
            //
            // Rule 105:  ruleList ::= rule
            //
            case 105: {
               //#line 205 "LPGParser.g"
                this.setResult(
                    //#line 205 LPGParser.g
                    ruleList.ruleListfromElement(<rule>this.getRhsSym(1), true /* left recursive */)
                //#line 205 LPGParser.g
                );
            break;
            }
            //
            // Rule 106:  ruleList ::= ruleList |$ rule
            //
            case 106: {
               //#line 205 "LPGParser.g"
                (<ruleList>this.getRhsSym(1)).addElement(<rule>this.getRhsSym(3));
            break;
            }
            //
            // Rule 107:  produces ::= ::=
            //
            case 107: {
               //#line 207 "LPGParser.g"
                this.setResult(
                    //#line 207 LPGParser.g
                    new produces0(this.getRhsIToken(1))
                //#line 207 LPGParser.g
                );
            break;
            }
            //
            // Rule 108:  produces ::= ::=?
            //
            case 108: {
               //#line 208 "LPGParser.g"
                this.setResult(
                    //#line 208 LPGParser.g
                    new produces1(this.getRhsIToken(1))
                //#line 208 LPGParser.g
                );
            break;
            }
            //
            // Rule 109:  produces ::= ->
            //
            case 109: {
               //#line 209 "LPGParser.g"
                this.setResult(
                    //#line 209 LPGParser.g
                    new produces2(this.getRhsIToken(1))
                //#line 209 LPGParser.g
                );
            break;
            }
            //
            // Rule 110:  produces ::= ->?
            //
            case 110: {
               //#line 210 "LPGParser.g"
                this.setResult(
                    //#line 210 LPGParser.g
                    new produces3(this.getRhsIToken(1))
                //#line 210 LPGParser.g
                );
            break;
            }
            //
            // Rule 111:  rule ::= symWithAttrsList action_segment_list
            //
            case 111: {
               //#line 212 "LPGParser.g"
                this.setResult(
                    //#line 212 LPGParser.g
                    new rule(this.getLeftIToken(), this.getRightIToken(),
                             //#line 212 LPGParser.g
                             <symWithAttrsList>this.getRhsSym(1),
                             //#line 212 LPGParser.g
                             <action_segmentList>this.getRhsSym(2))
                //#line 212 LPGParser.g
                );
            break;
            }
            //
            // Rule 112:  symWithAttrsList ::= %Empty
            //
            case 112: {
               //#line 214 "LPGParser.g"
                this.setResult(
                    //#line 214 LPGParser.g
                    new symWithAttrsList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 214 LPGParser.g
                );
            break;
            }
            //
            // Rule 113:  symWithAttrsList ::= symWithAttrsList symWithAttrs
            //
            case 113: {
               //#line 214 "LPGParser.g"
                (<symWithAttrsList>this.getRhsSym(1)).addElement(<IsymWithAttrs>this.getRhsSym(2));
            break;
            }
            //
            // Rule 114:  symWithAttrs ::= EMPTY_KEY
            //
            case 114: {
               //#line 216 "LPGParser.g"
                this.setResult(
                    //#line 216 LPGParser.g
                    new symWithAttrs0(this.getRhsIToken(1))
                //#line 216 LPGParser.g
                );
            break;
            }
            //
            // Rule 115:  symWithAttrs ::= SYMBOL optAttrList
            //
            case 115: {
               //#line 217 "LPGParser.g"
                this.setResult(
                    //#line 217 LPGParser.g
                    new symWithAttrs1(this.getLeftIToken(), this.getRightIToken(),
                                      //#line 217 LPGParser.g
                                      new ASTNodeToken(this.getRhsIToken(1)),
                                      //#line 217 LPGParser.g
                                      <symAttrs>this.getRhsSym(2))
                //#line 217 LPGParser.g
                );
            break;
            }
            //
            // Rule 116:  optAttrList ::= %Empty
            //
            case 116: {
               //#line 220 "LPGParser.g"
                this.setResult(
                    //#line 220 LPGParser.g
                    new symAttrs(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 220 LPGParser.g
                                 null)
                //#line 220 LPGParser.g
                );
            break;
            }
            //
            // Rule 117:  optAttrList ::= MACRO_NAME
            //
            case 117: {
               //#line 221 "LPGParser.g"
                this.setResult(
                    //#line 221 LPGParser.g
                    new symAttrs(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 221 LPGParser.g
                                 new ASTNodeToken(this.getRhsIToken(1)))
                //#line 221 LPGParser.g
                );
            break;
            }
            //
            // Rule 118:  opt_action_segment ::= %Empty
            //
            case 118: {
               //#line 223 "LPGParser.g"
                this.setResult(null);
            break;
            }
            //
            // Rule 119:  opt_action_segment ::= action_segment
            //
            case 119:
                break;
            //
            // Rule 120:  action_segment ::= BLOCK
            //
            case 120: {
               //#line 225 "LPGParser.g"
                this.setResult(
                    //#line 225 LPGParser.g
                    new action_segment(this.getRhsIToken(1))
                //#line 225 LPGParser.g
                );
            break;
            }
            //
            // Rule 121:  start_segment ::= start_symbol
            //
            case 121: {
               //#line 229 "LPGParser.g"
                this.setResult(
                    //#line 229 LPGParser.g
                    start_symbolList.start_symbolListfromElement(<Istart_symbol>this.getRhsSym(1), true /* left recursive */)
                //#line 229 LPGParser.g
                );
            break;
            }
            //
            // Rule 122:  start_segment ::= start_segment start_symbol
            //
            case 122: {
               //#line 229 "LPGParser.g"
                (<start_symbolList>this.getRhsSym(1)).addElement(<Istart_symbol>this.getRhsSym(2));
            break;
            }
            //
            // Rule 123:  start_symbol ::= SYMBOL
            //
            case 123: {
               //#line 230 "LPGParser.g"
                this.setResult(
                    //#line 230 LPGParser.g
                    new start_symbol0(this.getRhsIToken(1))
                //#line 230 LPGParser.g
                );
            break;
            }
            //
            // Rule 124:  start_symbol ::= MACRO_NAME
            //
            case 124: {
               //#line 231 "LPGParser.g"
                this.setResult(
                    //#line 231 LPGParser.g
                    new start_symbol1(this.getRhsIToken(1))
                //#line 231 LPGParser.g
                );
            break;
            }
            //
            // Rule 125:  terminals_segment ::= terminal
            //
            case 125: {
               //#line 234 "LPGParser.g"
                this.setResult(
                    //#line 234 LPGParser.g
                    terminals_segment_terminalList.terminals_segment_terminalListfromElement(this, <terminal>this.getRhsSym(1), true /* left recursive */)
                //#line 234 LPGParser.g
                );
            break;
            }
            //
            // Rule 126:  terminals_segment ::= terminals_segment terminal
            //
            case 126: {
               //#line 234 "LPGParser.g"
                (<terminals_segment_terminalList>this.getRhsSym(1)).addElement(<terminal>this.getRhsSym(2));
            break;
            }
            //
            // Rule 127:  terminal ::= terminal_symbol optTerminalAlias
            //
            case 127: {
               //#line 239 "LPGParser.g"
                this.setResult(
                    //#line 239 LPGParser.g
                    new terminal(this.getLeftIToken(), this.getRightIToken(),
                                 //#line 239 LPGParser.g
                                 <Iterminal_symbol>this.getRhsSym(1),
                                 //#line 239 LPGParser.g
                                 <optTerminalAlias>this.getRhsSym(2))
                //#line 239 LPGParser.g
                );
            break;
            }
            //
            // Rule 128:  optTerminalAlias ::= %Empty
            //
            case 128: {
               //#line 241 "LPGParser.g"
                this.setResult(null);
            break;
            }
            //
            // Rule 129:  optTerminalAlias ::= produces name
            //
            case 129: {
               //#line 241 "LPGParser.g"
                this.setResult(
                    //#line 241 LPGParser.g
                    new optTerminalAlias(this.getLeftIToken(), this.getRightIToken(),
                                         //#line 241 LPGParser.g
                                         <Iproduces>this.getRhsSym(1),
                                         //#line 241 LPGParser.g
                                         <Iname>this.getRhsSym(2))
                //#line 241 LPGParser.g
                );
            break;
            }
            //
            // Rule 130:  terminal_symbol ::= SYMBOL
            //
            case 130: {
               //#line 243 "LPGParser.g"
                this.setResult(
                    //#line 243 LPGParser.g
                    new terminal_symbol0(this.getRhsIToken(1))
                //#line 243 LPGParser.g
                );
            break;
            }
            //
            // Rule 131:  terminal_symbol ::= MACRO_NAME
            //
            case 131: {
               //#line 245 "LPGParser.g"
                this.setResult(
                    //#line 245 LPGParser.g
                    new terminal_symbol1(this.getRhsIToken(1))
                //#line 245 LPGParser.g
                );
            break;
            }
            //
            // Rule 132:  trailers_segment ::= action_segment_list
            //
            case 132:
                break;
            //
            // Rule 133:  types_segment ::= type_declarations
            //
            case 133: {
               //#line 251 "LPGParser.g"
                this.setResult(
                    //#line 251 LPGParser.g
                    type_declarationsList.type_declarationsListfromElement(<type_declarations>this.getRhsSym(1), true /* left recursive */)
                //#line 251 LPGParser.g
                );
            break;
            }
            //
            // Rule 134:  types_segment ::= types_segment type_declarations
            //
            case 134: {
               //#line 251 "LPGParser.g"
                (<type_declarationsList>this.getRhsSym(1)).addElement(<type_declarations>this.getRhsSym(2));
            break;
            }
            //
            // Rule 135:  type_declarations ::= SYMBOL produces barSymbolList opt_action_segment
            //
            case 135: {
               //#line 253 "LPGParser.g"
                this.setResult(
                    //#line 253 LPGParser.g
                    new type_declarations(this.getLeftIToken(), this.getRightIToken(),
                                          //#line 253 LPGParser.g
                                          new ASTNodeToken(this.getRhsIToken(1)),
                                          //#line 253 LPGParser.g
                                          <Iproduces>this.getRhsSym(2),
                                          //#line 253 LPGParser.g
                                          <SYMBOLList>this.getRhsSym(3),
                                          //#line 253 LPGParser.g
                                          <action_segment>this.getRhsSym(4))
                //#line 253 LPGParser.g
                );
            break;
            }
            //
            // Rule 136:  barSymbolList ::= SYMBOL
            //
            case 136: {
               //#line 254 "LPGParser.g"
                this.setResult(
                    //#line 254 LPGParser.g
                    SYMBOLList.SYMBOLListfromElement(new ASTNodeToken(this.getRhsIToken(1)), true /* left recursive */)
                //#line 254 LPGParser.g
                );
            break;
            }
            //
            // Rule 137:  barSymbolList ::= barSymbolList |$ SYMBOL
            //
            case 137: {
               //#line 254 "LPGParser.g"
                (<SYMBOLList>this.getRhsSym(1)).addElement(new ASTNodeToken(this.getRhsIToken(3)));
            break;
            }
            //
            // Rule 138:  predecessor_segment ::= %Empty
            //
            case 138: {
               //#line 257 "LPGParser.g"
                this.setResult(
                    //#line 257 LPGParser.g
                    new symbol_pairList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 257 LPGParser.g
                );
            break;
            }
            //
            // Rule 139:  predecessor_segment ::= predecessor_segment symbol_pair
            //
            case 139: {
               //#line 257 "LPGParser.g"
                (<symbol_pairList>this.getRhsSym(1)).addElement(<symbol_pair>this.getRhsSym(2));
            break;
            }
            //
            // Rule 140:  symbol_pair ::= SYMBOL SYMBOL
            //
            case 140: {
               //#line 259 "LPGParser.g"
                this.setResult(
                    //#line 259 LPGParser.g
                    new symbol_pair(this.getLeftIToken(), this.getRightIToken(),
                                    //#line 259 LPGParser.g
                                    new ASTNodeToken(this.getRhsIToken(1)),
                                    //#line 259 LPGParser.g
                                    new ASTNodeToken(this.getRhsIToken(2)))
                //#line 259 LPGParser.g
                );
            break;
            }
            //
            // Rule 141:  recover_segment ::= %Empty
            //
            case 141: {
               //#line 262 "LPGParser.g"
                this.setResult(
                    //#line 262 LPGParser.g
                    new SYMBOLList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 262 LPGParser.g
                );
            break;
            }
            //
            // Rule 142:  recover_segment ::= recover_segment recover_symbol
            //
            case 142: {
               //#line 262 "LPGParser.g"
                this.setResult(<SYMBOLList>this.getRhsSym(1));
            break;
            }
            //
            // Rule 143:  recover_symbol ::= SYMBOL
            //
            case 143: {
               //#line 264 "LPGParser.g"
                this.setResult(
                    //#line 264 LPGParser.g
                    new recover_symbol(this.getRhsIToken(1))
                //#line 264 LPGParser.g
                );
            break;
            }
            //
            // Rule 144:  END_KEY_OPT ::= %Empty
            //
            case 144: {
               //#line 267 "LPGParser.g"
                this.setResult(null);
            break;
            }
            //
            // Rule 145:  END_KEY_OPT ::= END_KEY
            //
            case 145: {
               //#line 268 "LPGParser.g"
                this.setResult(
                    //#line 268 LPGParser.g
                    new END_KEY_OPT(this.getRhsIToken(1))
                //#line 268 LPGParser.g
                );
            break;
            }
            //
            // Rule 146:  action_segment_list ::= %Empty
            //
            case 146: {
               //#line 270 "LPGParser.g"
                this.setResult(
                    //#line 270 LPGParser.g
                    new action_segmentList(this.getLeftIToken(), this.getRightIToken(), true /* left recursive */)
                //#line 270 LPGParser.g
                );
            break;
            }
            //
            // Rule 147:  action_segment_list ::= action_segment_list action_segment
            //
            case 147: {
               //#line 271 "LPGParser.g"
                (<action_segmentList>this.getRhsSym(1)).addElement(<action_segment>this.getRhsSym(2));
            break;
            }
    //#line 322 "btParserTemplateF.gi

    
            default:
                break;
        }
        return;
    }
}
    export abstract class ASTNode implements IAst
    {
        public getNextAst() : IAst | null { return null; }
        protected leftIToken : IToken ;
        protected rightIToken: IToken ;
        protected parent : IAst | null = null ;
        public  setParent(parent : IAst ) : void { this.parent = parent; }
        public  getParent() : IAst | null{ return this.parent; }

        public getLeftIToken() : IToken { return this.leftIToken; }
        public getRightIToken() : IToken { return this.rightIToken; }
        public getPrecedingAdjuncts() : IToken[] { return this.leftIToken.getPrecedingAdjuncts(); }
        public getFollowingAdjuncts() : IToken[] { return this.rightIToken.getFollowingAdjuncts(); }

        public  toString() : string 
        {
            let str = this.leftIToken.getILexStream()?.toString(this.leftIToken.getStartOffset(), this.rightIToken.getEndOffset());
            return str? str : "";
        }

    constructor(leftIToken : IToken , rightIToken? : IToken )
        {
            this.leftIToken = leftIToken;
            if(rightIToken) this.rightIToken = rightIToken;
            else            this.rightIToken = leftIToken;
        }

      public   initialize() : void {}

        /**
         * A list of all children of this node, excluding the null ones.
         */
        public  getChildren() : Lpg.Util.ArrayList<IAst>
        {
             let list = this.getAllChildren() ;
            let k = -1;
            for (let i = 0; i < list.size(); i++)
            {
                let element = list.get(i);
                if (element)
                {
                    if (++k != i)
                        list.set(k, element);
                }
            }
            for (let i = list.size() - 1; i > k; i--) // remove extraneous elements
                list.remove(i);
            return list;
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
        public abstract  getAllChildren() : Lpg.Util.ArrayList<IAst>;

        public abstract acceptWithVisitor(v : Visitor) : void;
        public abstract  acceptWithArg(v : ArgumentVisitor, o : any) : void;
        public abstract acceptWithResult(v : ResultVisitor) : any;
        public abstract acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any;
        public  accept(v : IAstVisitor ) : void {}
    }

    export abstract class AbstractASTNodeList extends ASTNode implements IAbstractArrayList<ASTNode>
    {
        private leftRecursive : boolean ;
        public  list  = new Lpg.Util.ArrayList<ASTNode>();
        public  size() : number { return this.list.size(); }
        public   getList() : Lpg.Util.ArrayList<ASTNode    > { return this.list; }
        public  getElementAt(i : number ) : ASTNode { return <ASTNode> this.list.get(this.leftRecursive ? i : this.list.size() - 1 - i); }
        public  getArrayList() : Lpg.Util.ArrayList<ASTNode>
        {
            if (! this.leftRecursive) // reverse the list 
            {
                for (let i = 0, n = this.list.size() - 1; i < n; i++, n--)
                {
                    let ith = this.list.get(i),
                           nth = this.list.get(n);
                    this.list.set(i, nth);
                    this.list.set(n, ith);
                }
                this.leftRecursive = true;
            }
            return this.list;
        }
        /**
         * @deprecated replaced by {@link #addElement()}
         *
         */
        public  add(element : ASTNode) : boolean
        {
            this.addElement(element);
            return true;
        }

        public  addElement(element : ASTNode) : void
        {
            this.list.add(element);
            if (this.leftRecursive)
                 this.rightIToken = element.getRightIToken();
            else this.leftIToken = element.getLeftIToken();
        }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )        {
              super(leftToken, rightToken);
              this.leftRecursive = leftRecursive;
        }

        /**
         * Make a copy of the list and return it. Note that we obtain the local list by
         * invoking getArrayList so as to make sure that the list we return is in proper order.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            return this.getArrayList().clone();
        }

    }

    export class ASTNodeToken extends ASTNode implements IASTNodeToken
    {
        constructor(token : IToken ) { super(token); }
        public  getIToken() : IToken{ return this.leftIToken; }
        public  toString() : string  { return this.leftIToken.toString(); }

        /**
         * A token class has no children. So, we return the empty list.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst> { return new Lpg.Util.ArrayList<IAst>(); }


        public  acceptWithVisitor(v : Visitor) : void{ v.visitASTNodeToken(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitASTNodeToken(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitASTNodeToken(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitASTNodeToken(this, o); }
    }

    export interface IRootForLPGParser
    {
         getLeftIToken() : IToken;
         getRightIToken() : IToken;

        acceptWithVisitor(v : Visitor) : void;
         acceptWithArg(v : ArgumentVisitor, o : any) : void;
        acceptWithResult(v : ResultVisitor) : any;
        acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any;
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>alias_lhs_macro_name
     *<li>macro_segment
     *<li>optMacroName
     *<li>include_segment
     *<li>RuleName
     *<li>symAttrs
     *<li>action_segment
     *<li>recover_symbol
     *<li>END_KEY_OPT
     *<li>alias_rhs0
     *<li>alias_rhs1
     *<li>alias_rhs2
     *<li>alias_rhs3
     *<li>alias_rhs4
     *<li>alias_rhs5
     *<li>alias_rhs6
     *<li>macro_name_symbol0
     *<li>macro_name_symbol1
     *<li>name0
     *<li>name1
     *<li>name2
     *<li>name3
     *<li>name4
     *<li>name5
     *<li>produces0
     *<li>produces1
     *<li>produces2
     *<li>produces3
     *<li>symWithAttrs0
     *<li>symWithAttrs1
     *<li>start_symbol0
     *<li>start_symbol1
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface IASTNodeToken extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>LPG</b>
     */
    export interface ILPG extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>option_specList</b>
     */
    export interface Ioptions_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>LPG_itemList</b>
     */
    export interface ILPG_INPUT extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>AliasSeg
     *<li>AstSeg
     *<li>DefineSeg
     *<li>EofSeg
     *<li>EolSeg
     *<li>ErrorSeg
     *<li>ExportSeg
     *<li>GlobalsSeg
     *<li>HeadersSeg
     *<li>IdentifierSeg
     *<li>ImportSeg
     *<li>IncludeSeg
     *<li>KeywordsSeg
     *<li>NamesSeg
     *<li>NoticeSeg
     *<li>RulesSeg
     *<li>SoftKeywordsSeg
     *<li>StartSeg
     *<li>TerminalsSeg
     *<li>TrailersSeg
     *<li>TypesSeg
     *<li>RecoverSeg
     *<li>PredecessorSeg
     *</ul>
     *</b>
     */
    export interface ILPG_item extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>aliasSpecList</b>
     */
    export interface Ialias_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>END_KEY_OPT</b>
     */
    export interface IEND_KEY_OPT extends IASTNodeToken {}

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Iast_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>defineSpecList</b>
     */
    export interface Idefine_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface Ieof_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface Ieol_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface Ierror_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>terminal_symbolList</b>
     */
    export interface Iexport_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Iglobals_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Iheaders_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface Iidentifier_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>import_segment</b>
     */
    export interface Iimport_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>include_segment</b>
     */
    export interface Iinclude_segment extends IASTNodeToken {}

    /**
     * is implemented by <b>keywordSpecList</b>
     */
    export interface Ikeywords_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>nameSpecList</b>
     */
    export interface Inames_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Inotice_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>rules_segment</b>
     */
    export interface Irules_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>start_symbolList</b>
     */
    export interface Istart_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>terminalList</b>
     */
    export interface Iterminals_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Itrailers_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>type_declarationsList</b>
     */
    export interface Itypes_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>SYMBOLList</b>
     */
    export interface Irecover_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>symbol_pairList</b>
     */
    export interface Ipredecessor_segment extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>option_spec</b>
     */
    export interface Ioption_spec extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>optionList</b>
     */
    export interface Ioption_list extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>option</b>
     */
    export interface Ioption extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>option_value0
     *<li>option_value1
     *</ul>
     *</b>
     */
    export interface Ioption_value extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>SYMBOLList</b>
     */
    export interface Isymbol_list extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>aliasSpec0
     *<li>aliasSpec1
     *<li>aliasSpec2
     *<li>aliasSpec3
     *<li>aliasSpec4
     *<li>aliasSpec5
     *</ul>
     *</b>
     */
    export interface IaliasSpec extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>produces0
     *<li>produces1
     *<li>produces2
     *<li>produces3
     *</ul>
     *</b>
     */
    export interface Iproduces extends IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>alias_rhs0
     *<li>alias_rhs1
     *<li>alias_rhs2
     *<li>alias_rhs3
     *<li>alias_rhs4
     *<li>alias_rhs5
     *<li>alias_rhs6
     *</ul>
     *</b>
     */
    export interface Ialias_rhs extends IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>alias_lhs_macro_name</b>
     */
    export interface Ialias_lhs_macro_name extends IASTNodeToken {}

    /**
     * is implemented by <b>action_segmentList</b>
     */
    export interface Iaction_segment_list extends Iast_segment, Iheaders_segment, Itrailers_segment {}

    /**
     * is implemented by <b>defineSpec</b>
     */
    export interface IdefineSpec extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>macro_name_symbol0
     *<li>macro_name_symbol1
     *</ul>
     *</b>
     */
    export interface Imacro_name_symbol extends IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>macro_segment</b>
     */
    export interface Imacro_segment extends IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface Iterminal_symbol extends Ieol_segment, Ieof_segment, Ierror_segment, Iidentifier_segment, IkeywordSpec, IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>action_segment</b>
     */
    export interface Iaction_segment extends Iopt_action_segment, IASTNodeToken {}

    /**
     * is implemented by <b>drop_commandList</b>
     */
    export interface Idrop_command_list extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>drop_command0
     *<li>drop_command1
     *</ul>
     *</b>
     */
    export interface Idrop_command extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>SYMBOLList</b>
     */
    export interface Idrop_symbols extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>drop_ruleList</b>
     */
    export interface Idrop_rules extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>drop_rule</b>
     */
    export interface Idrop_rule extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>optMacroName</b>
     */
    export interface IoptMacroName extends IASTNodeToken {}

    /**
     * is implemented by <b>ruleList</b>
     */
    export interface IruleList extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>keywordSpec
     *<li>terminal_symbol0
     *<li>terminal_symbol1
     *</ul>
     *</b>
     */
    export interface IkeywordSpec extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>name0
     *<li>name1
     *<li>name2
     *<li>name3
     *<li>name4
     *<li>name5
     *</ul>
     *</b>
     */
    export interface Iname extends IASTNodeToken {}

    /**
     * is implemented by <b>nameSpec</b>
     */
    export interface InameSpec extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>nonTermList</b>
     */
    export interface InonTermList extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>nonTerm</b>
     */
    export interface InonTerm extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>RuleName</b>
     */
    export interface IruleNameWithAttributes extends IASTNodeToken {}

    /**
     * is implemented by <b>rule</b>
     */
    export interface Irule extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>symWithAttrsList</b>
     */
    export interface IsymWithAttrsList extends IRootForLPGParser    {
    }

    /**
     * is implemented by:
     *<b>
     *<ul>
     *<li>symWithAttrs0
     *<li>symWithAttrs1
     *</ul>
     *</b>
     */
    export interface IsymWithAttrs extends IASTNodeToken {}

    /**
     * is implemented by <b>symAttrs</b>
     */
    export interface IoptAttrList extends IASTNodeToken {}

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>action_segment</b>
     */
    export interface Iopt_action_segment extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by:
     *<b>
     *<ul>
     *<li>start_symbol0
     *<li>start_symbol1
     *</ul>
     *</b>
     */
    export interface Istart_symbol extends IASTNodeToken {}

    /**
     * is implemented by <b>terminal</b>
     */
    export interface Iterminal extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>optTerminalAlias</b>
     */
    export interface IoptTerminalAlias extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>type_declarations</b>
     */
    export interface Itype_declarations extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>SYMBOLList</b>
     */
    export interface IbarSymbolList extends IRootForLPGParser    {
    }

    /**
     * is implemented by <b>symbol_pair</b>
     */
    export interface Isymbol_pair extends IRootForLPGParser    {
    }

    /**
     * is always implemented by <b>ASTNodeToken</b>. It is also implemented by <b>recover_symbol</b>
     */
    export interface Irecover_symbol extends IASTNodeToken {}

    /**
     *<b>
    *<li>Rule 1:  LPG ::= options_segment LPG_INPUT
     *</b>
     */
    export class LPG extends ASTNode implements ILPG
    {
        private  _options_segment : option_specList;
        private  _LPG_INPUT : LPG_itemList;

        public  getoptions_segment() : option_specList{ return this._options_segment; }
        public  setoptions_segment( _options_segment : option_specList) : void { this._options_segment = _options_segment; }
        public  getLPG_INPUT() : LPG_itemList{ return this._LPG_INPUT; }
        public  setLPG_INPUT( _LPG_INPUT : LPG_itemList) : void { this._LPG_INPUT = _LPG_INPUT; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _options_segment : option_specList,
                     _LPG_INPUT : LPG_itemList)
        {
            super(leftIToken, rightIToken)

            this._options_segment = _options_segment;
            (<ASTNode> _options_segment).setParent(this);
            this._LPG_INPUT = _LPG_INPUT;
            (<ASTNode> _LPG_INPUT).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._options_segment)  list.add(this._options_segment);
            if(this._LPG_INPUT)  list.add(this._LPG_INPUT);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitLPG(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitLPG(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitLPG(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitLPG(this, o); }
    }

    /**
     *<b>
    *<li>Rule 2:  LPG_INPUT ::= %Empty
    *<li>Rule 3:  LPG_INPUT ::= LPG_INPUT LPG_item
     *</b>
     */
    export class LPG_itemList extends AbstractASTNodeList implements ILPG_INPUT
    {
        public  getLPG_itemAt(i : number) : ILPG_item{ return <ILPG_item> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static LPG_itemListfromElement(element : ILPG_item,leftRecursive : boolean) : LPG_itemList
        {
            let obj = new LPG_itemList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _LPG_item : ILPG_item) : void
        {
            super.addElement(<ASTNode> _LPG_item);
            (<ASTNode> _LPG_item).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getLPG_itemAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getLPG_itemAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getLPG_itemAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getLPG_itemAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 4:  LPG_item ::= ALIAS_KEY$ alias_segment END_KEY_OPT$
     *</b>
     */
    export class AliasSeg extends ASTNode implements ILPG_item
    {
        private  _alias_segment : aliasSpecList;

        public  getalias_segment() : aliasSpecList{ return this._alias_segment; }
        public  setalias_segment( _alias_segment : aliasSpecList) : void { this._alias_segment = _alias_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _alias_segment : aliasSpecList)
        {
            super(leftIToken, rightIToken)

            this._alias_segment = _alias_segment;
            (<ASTNode> _alias_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._alias_segment)  list.add(this._alias_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitAliasSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitAliasSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitAliasSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitAliasSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 5:  LPG_item ::= AST_KEY$ ast_segment END_KEY_OPT$
     *</b>
     */
    export class AstSeg extends ASTNode implements ILPG_item
    {
        private  _ast_segment : action_segmentList;

        public  getast_segment() : action_segmentList{ return this._ast_segment; }
        public  setast_segment( _ast_segment : action_segmentList) : void { this._ast_segment = _ast_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _ast_segment : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._ast_segment = _ast_segment;
            (<ASTNode> _ast_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._ast_segment)  list.add(this._ast_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitAstSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitAstSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitAstSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitAstSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 6:  LPG_item ::= DEFINE_KEY$ define_segment END_KEY_OPT$
     *</b>
     */
    export class DefineSeg extends ASTNode implements ILPG_item
    {
        private  _define_segment : defineSpecList;

        public  getdefine_segment() : defineSpecList{ return this._define_segment; }
        public  setdefine_segment( _define_segment : defineSpecList) : void { this._define_segment = _define_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _define_segment : defineSpecList)
        {
            super(leftIToken, rightIToken)

            this._define_segment = _define_segment;
            (<ASTNode> _define_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._define_segment)  list.add(this._define_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitDefineSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitDefineSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitDefineSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitDefineSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 7:  LPG_item ::= EOF_KEY$ eof_segment END_KEY_OPT$
     *</b>
     */
    export class EofSeg extends ASTNode implements ILPG_item
    {
        private  _eof_segment : Ieof_segment;

        public  geteof_segment() : Ieof_segment{ return this._eof_segment; }
        public  seteof_segment( _eof_segment : Ieof_segment) : void { this._eof_segment = _eof_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _eof_segment : Ieof_segment)
        {
            super(leftIToken, rightIToken)

            this._eof_segment = _eof_segment;
            (<ASTNode> _eof_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._eof_segment)  list.add(this._eof_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitEofSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitEofSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitEofSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitEofSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 8:  LPG_item ::= EOL_KEY$ eol_segment END_KEY_OPT$
     *</b>
     */
    export class EolSeg extends ASTNode implements ILPG_item
    {
        private  _eol_segment : Ieol_segment;

        public  geteol_segment() : Ieol_segment{ return this._eol_segment; }
        public  seteol_segment( _eol_segment : Ieol_segment) : void { this._eol_segment = _eol_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _eol_segment : Ieol_segment)
        {
            super(leftIToken, rightIToken)

            this._eol_segment = _eol_segment;
            (<ASTNode> _eol_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._eol_segment)  list.add(this._eol_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitEolSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitEolSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitEolSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitEolSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 9:  LPG_item ::= ERROR_KEY$ error_segment END_KEY_OPT$
     *</b>
     */
    export class ErrorSeg extends ASTNode implements ILPG_item
    {
        private  _error_segment : Ierror_segment;

        public  geterror_segment() : Ierror_segment{ return this._error_segment; }
        public  seterror_segment( _error_segment : Ierror_segment) : void { this._error_segment = _error_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _error_segment : Ierror_segment)
        {
            super(leftIToken, rightIToken)

            this._error_segment = _error_segment;
            (<ASTNode> _error_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._error_segment)  list.add(this._error_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitErrorSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitErrorSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitErrorSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitErrorSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 10:  LPG_item ::= EXPORT_KEY$ export_segment END_KEY_OPT$
     *</b>
     */
    export class ExportSeg extends ASTNode implements ILPG_item
    {
        private  _export_segment : terminal_symbolList;

        public  getexport_segment() : terminal_symbolList{ return this._export_segment; }
        public  setexport_segment( _export_segment : terminal_symbolList) : void { this._export_segment = _export_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _export_segment : terminal_symbolList)
        {
            super(leftIToken, rightIToken)

            this._export_segment = _export_segment;
            (<ASTNode> _export_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._export_segment)  list.add(this._export_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitExportSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitExportSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitExportSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitExportSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 11:  LPG_item ::= GLOBALS_KEY$ globals_segment END_KEY_OPT$
     *</b>
     */
    export class GlobalsSeg extends ASTNode implements ILPG_item
    {
        private  _globals_segment : action_segmentList;

        public  getglobals_segment() : action_segmentList{ return this._globals_segment; }
        public  setglobals_segment( _globals_segment : action_segmentList) : void { this._globals_segment = _globals_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _globals_segment : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._globals_segment = _globals_segment;
            (<ASTNode> _globals_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._globals_segment)  list.add(this._globals_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitGlobalsSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitGlobalsSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitGlobalsSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitGlobalsSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 12:  LPG_item ::= HEADERS_KEY$ headers_segment END_KEY_OPT$
     *</b>
     */
    export class HeadersSeg extends ASTNode implements ILPG_item
    {
        private  _headers_segment : action_segmentList;

        public  getheaders_segment() : action_segmentList{ return this._headers_segment; }
        public  setheaders_segment( _headers_segment : action_segmentList) : void { this._headers_segment = _headers_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _headers_segment : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._headers_segment = _headers_segment;
            (<ASTNode> _headers_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._headers_segment)  list.add(this._headers_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitHeadersSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitHeadersSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitHeadersSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitHeadersSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 13:  LPG_item ::= IDENTIFIER_KEY$ identifier_segment END_KEY_OPT$
     *</b>
     */
    export class IdentifierSeg extends ASTNode implements ILPG_item
    {
        private  _identifier_segment : Iidentifier_segment;

        public  getidentifier_segment() : Iidentifier_segment{ return this._identifier_segment; }
        public  setidentifier_segment( _identifier_segment : Iidentifier_segment) : void { this._identifier_segment = _identifier_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _identifier_segment : Iidentifier_segment)
        {
            super(leftIToken, rightIToken)

            this._identifier_segment = _identifier_segment;
            (<ASTNode> _identifier_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._identifier_segment)  list.add(this._identifier_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitIdentifierSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitIdentifierSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitIdentifierSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitIdentifierSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 14:  LPG_item ::= IMPORT_KEY$ import_segment END_KEY_OPT$
     *</b>
     */
    export class ImportSeg extends ASTNode implements ILPG_item
    {
        private  _import_segment : import_segment;

        public  getimport_segment() : import_segment{ return this._import_segment; }
        public  setimport_segment( _import_segment : import_segment) : void { this._import_segment = _import_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _import_segment : import_segment)
        {
            super(leftIToken, rightIToken)

            this._import_segment = _import_segment;
            (<ASTNode> _import_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._import_segment)  list.add(this._import_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitImportSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitImportSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitImportSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitImportSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 15:  LPG_item ::= INCLUDE_KEY$ include_segment END_KEY_OPT$
     *</b>
     */
    export class IncludeSeg extends ASTNode implements ILPG_item
    {
        private  _include_segment : include_segment;

        public  getinclude_segment() : include_segment{ return this._include_segment; }
        public  setinclude_segment( _include_segment : include_segment) : void { this._include_segment = _include_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _include_segment : include_segment)
        {
            super(leftIToken, rightIToken)

            this._include_segment = _include_segment;
            (<ASTNode> _include_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._include_segment)  list.add(this._include_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitIncludeSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitIncludeSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitIncludeSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitIncludeSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 16:  LPG_item ::= KEYWORDS_KEY$ keywords_segment END_KEY_OPT$
     *</b>
     */
    export class KeywordsSeg extends ASTNode implements ILPG_item
    {
        private  _keywords_segment : keywordSpecList;

        public  getkeywords_segment() : keywordSpecList{ return this._keywords_segment; }
        public  setkeywords_segment( _keywords_segment : keywordSpecList) : void { this._keywords_segment = _keywords_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _keywords_segment : keywordSpecList)
        {
            super(leftIToken, rightIToken)

            this._keywords_segment = _keywords_segment;
            (<ASTNode> _keywords_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._keywords_segment)  list.add(this._keywords_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitKeywordsSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitKeywordsSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitKeywordsSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitKeywordsSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 17:  LPG_item ::= NAMES_KEY$ names_segment END_KEY_OPT$
     *</b>
     */
    export class NamesSeg extends ASTNode implements ILPG_item
    {
        private  _names_segment : nameSpecList;

        public  getnames_segment() : nameSpecList{ return this._names_segment; }
        public  setnames_segment( _names_segment : nameSpecList) : void { this._names_segment = _names_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _names_segment : nameSpecList)
        {
            super(leftIToken, rightIToken)

            this._names_segment = _names_segment;
            (<ASTNode> _names_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._names_segment)  list.add(this._names_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitNamesSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitNamesSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitNamesSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitNamesSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 18:  LPG_item ::= NOTICE_KEY$ notice_segment END_KEY_OPT$
     *</b>
     */
    export class NoticeSeg extends ASTNode implements ILPG_item
    {
        private  _notice_segment : action_segmentList;

        public  getnotice_segment() : action_segmentList{ return this._notice_segment; }
        public  setnotice_segment( _notice_segment : action_segmentList) : void { this._notice_segment = _notice_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _notice_segment : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._notice_segment = _notice_segment;
            (<ASTNode> _notice_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._notice_segment)  list.add(this._notice_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitNoticeSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitNoticeSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitNoticeSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitNoticeSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 19:  LPG_item ::= RULES_KEY$ rules_segment END_KEY_OPT$
     *</b>
     */
    export class RulesSeg extends ASTNode implements ILPG_item
    {
        private  _rules_segment : rules_segment;

        public  getrules_segment() : rules_segment{ return this._rules_segment; }
        public  setrules_segment( _rules_segment : rules_segment) : void { this._rules_segment = _rules_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _rules_segment : rules_segment)
        {
            super(leftIToken, rightIToken)

            this._rules_segment = _rules_segment;
            (<ASTNode> _rules_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._rules_segment)  list.add(this._rules_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitRulesSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitRulesSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitRulesSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitRulesSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 20:  LPG_item ::= SOFT_KEYWORDS_KEY$ keywords_segment END_KEY_OPT$
     *</b>
     */
    export class SoftKeywordsSeg extends ASTNode implements ILPG_item
    {
        private  _keywords_segment : keywordSpecList;

        public  getkeywords_segment() : keywordSpecList{ return this._keywords_segment; }
        public  setkeywords_segment( _keywords_segment : keywordSpecList) : void { this._keywords_segment = _keywords_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _keywords_segment : keywordSpecList)
        {
            super(leftIToken, rightIToken)

            this._keywords_segment = _keywords_segment;
            (<ASTNode> _keywords_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._keywords_segment)  list.add(this._keywords_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitSoftKeywordsSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitSoftKeywordsSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitSoftKeywordsSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitSoftKeywordsSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 21:  LPG_item ::= START_KEY$ start_segment END_KEY_OPT$
     *</b>
     */
    export class StartSeg extends ASTNode implements ILPG_item
    {
        private  _start_segment : start_symbolList;

        public  getstart_segment() : start_symbolList{ return this._start_segment; }
        public  setstart_segment( _start_segment : start_symbolList) : void { this._start_segment = _start_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _start_segment : start_symbolList)
        {
            super(leftIToken, rightIToken)

            this._start_segment = _start_segment;
            (<ASTNode> _start_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._start_segment)  list.add(this._start_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitStartSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitStartSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitStartSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitStartSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 22:  LPG_item ::= TERMINALS_KEY$ terminals_segment END_KEY_OPT$
     *</b>
     */
    export class TerminalsSeg extends ASTNode implements ILPG_item
    {
        private  _terminals_segment : terminals_segment_terminalList;

        public  getterminals_segment() : terminals_segment_terminalList{ return this._terminals_segment; }
        public  setterminals_segment( _terminals_segment : terminals_segment_terminalList) : void { this._terminals_segment = _terminals_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _terminals_segment : terminals_segment_terminalList)
        {
            super(leftIToken, rightIToken)

            this._terminals_segment = _terminals_segment;
            (<ASTNode> _terminals_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._terminals_segment)  list.add(this._terminals_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitTerminalsSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitTerminalsSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitTerminalsSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitTerminalsSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 23:  LPG_item ::= TRAILERS_KEY$ trailers_segment END_KEY_OPT$
     *</b>
     */
    export class TrailersSeg extends ASTNode implements ILPG_item
    {
        private  _trailers_segment : action_segmentList;

        public  gettrailers_segment() : action_segmentList{ return this._trailers_segment; }
        public  settrailers_segment( _trailers_segment : action_segmentList) : void { this._trailers_segment = _trailers_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _trailers_segment : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._trailers_segment = _trailers_segment;
            (<ASTNode> _trailers_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._trailers_segment)  list.add(this._trailers_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitTrailersSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitTrailersSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitTrailersSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitTrailersSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 24:  LPG_item ::= TYPES_KEY$ types_segment END_KEY_OPT$
     *</b>
     */
    export class TypesSeg extends ASTNode implements ILPG_item
    {
        private  _types_segment : type_declarationsList;

        public  gettypes_segment() : type_declarationsList{ return this._types_segment; }
        public  settypes_segment( _types_segment : type_declarationsList) : void { this._types_segment = _types_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _types_segment : type_declarationsList)
        {
            super(leftIToken, rightIToken)

            this._types_segment = _types_segment;
            (<ASTNode> _types_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._types_segment)  list.add(this._types_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitTypesSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitTypesSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitTypesSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitTypesSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 25:  LPG_item ::= RECOVER_KEY$ recover_segment END_KEY_OPT$
     *</b>
     */
    export class RecoverSeg extends ASTNode implements ILPG_item
    {
        private  _recover_segment : SYMBOLList;

        public  getrecover_segment() : SYMBOLList{ return this._recover_segment; }
        public  setrecover_segment( _recover_segment : SYMBOLList) : void { this._recover_segment = _recover_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _recover_segment : SYMBOLList)
        {
            super(leftIToken, rightIToken)

            this._recover_segment = _recover_segment;
            (<ASTNode> _recover_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._recover_segment)  list.add(this._recover_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitRecoverSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitRecoverSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitRecoverSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitRecoverSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 26:  LPG_item ::= DISJOINTPREDECESSORSETS_KEY$ predecessor_segment END_KEY_OPT$
     *</b>
     */
    export class PredecessorSeg extends ASTNode implements ILPG_item
    {
        private  _predecessor_segment : symbol_pairList;

        public  getpredecessor_segment() : symbol_pairList{ return this._predecessor_segment; }
        public  setpredecessor_segment( _predecessor_segment : symbol_pairList) : void { this._predecessor_segment = _predecessor_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _predecessor_segment : symbol_pairList)
        {
            super(leftIToken, rightIToken)

            this._predecessor_segment = _predecessor_segment;
            (<ASTNode> _predecessor_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._predecessor_segment)  list.add(this._predecessor_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitPredecessorSeg(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitPredecessorSeg(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitPredecessorSeg(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitPredecessorSeg(this, o); }
    }

    /**
     *<b>
    *<li>Rule 27:  options_segment ::= %Empty
    *<li>Rule 28:  options_segment ::= options_segment option_spec
     *</b>
     */
    export class option_specList extends AbstractASTNodeList implements Ioptions_segment
    {
        public  getoption_specAt(i : number) : option_spec{ return <option_spec> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static option_specListfromElement(element : option_spec,leftRecursive : boolean) : option_specList
        {
            let obj = new option_specList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _option_spec : option_spec) : void
        {
            super.addElement(<ASTNode> _option_spec);
            (<ASTNode> _option_spec).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getoption_specAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getoption_specAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getoption_specAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getoption_specAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 29:  option_spec ::= OPTIONS_KEY$ option_list
     *</b>
     */
    export class option_spec extends ASTNode implements Ioption_spec
    {
        private  _option_list : optionList;

        public  getoption_list() : optionList{ return this._option_list; }
        public  setoption_list( _option_list : optionList) : void { this._option_list = _option_list; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _option_list : optionList)
        {
            super(leftIToken, rightIToken)

            this._option_list = _option_list;
            (<ASTNode> _option_list).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._option_list)  list.add(this._option_list);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoption_spec(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoption_spec(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoption_spec(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoption_spec(this, o); }
    }

    /**
     *<b>
    *<li>Rule 30:  option_list ::= option
    *<li>Rule 31:  option_list ::= option_list ,$ option
     *</b>
     */
    export class optionList extends AbstractASTNodeList implements Ioption_list
    {
        public  getoptionAt(i : number) : option{ return <option> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static optionListfromElement(element : option,leftRecursive : boolean) : optionList
        {
            let obj = new optionList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _option : option) : void
        {
            super.addElement(<ASTNode> _option);
            (<ASTNode> _option).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getoptionAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getoptionAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getoptionAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getoptionAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 32:  option ::= SYMBOL option_value
     *</b>
     */
    export class option extends ASTNode implements Ioption
    {
        private  _SYMBOL : ASTNodeToken;
        private  _option_value : Ioption_value| null;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        /**
         * The value returned by <b>getoption_value</b> may be <b>null</b>
         */
        public  getoption_value() : Ioption_value | null { return this._option_value; }
        public  setoption_value( _option_value : Ioption_value) : void { this._option_value = _option_value; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _option_value : Ioption_value| null)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._option_value = _option_value;
            if (_option_value) (<ASTNode> _option_value).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._option_value)  list.add(this._option_value);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoption(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoption(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoption(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoption(this, o); }
    }

    /**
     *<b>
    *<li>Rule 36:  symbol_list ::= SYMBOL
    *<li>Rule 37:  symbol_list ::= symbol_list ,$ SYMBOL
    *<li>Rule 75:  drop_symbols ::= SYMBOL
    *<li>Rule 76:  drop_symbols ::= drop_symbols SYMBOL
    *<li>Rule 136:  barSymbolList ::= SYMBOL
    *<li>Rule 137:  barSymbolList ::= barSymbolList |$ SYMBOL
    *<li>Rule 141:  recover_segment ::= %Empty
    *<li>Rule 142:  recover_segment ::= recover_segment recover_symbol
     *</b>
     */
    export class SYMBOLList extends AbstractASTNodeList implements Isymbol_list, Idrop_symbols, IbarSymbolList, Irecover_segment
    {
        public  getSYMBOLAt(i : number) : ASTNodeToken{ return <ASTNodeToken> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static SYMBOLListfromElement(element : ASTNodeToken,leftRecursive : boolean) : SYMBOLList
        {
            let obj = new SYMBOLList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _SYMBOL : ASTNodeToken) : void
        {
            super.addElement(<ASTNode> _SYMBOL);
            (<ASTNode> _SYMBOL).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getSYMBOLAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getSYMBOLAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getSYMBOLAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getSYMBOLAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 38:  alias_segment ::= aliasSpec
    *<li>Rule 39:  alias_segment ::= alias_segment aliasSpec
     *</b>
     */
    export class aliasSpecList extends AbstractASTNodeList implements Ialias_segment
    {
        public  getaliasSpecAt(i : number) : IaliasSpec{ return <IaliasSpec> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static aliasSpecListfromElement(element : IaliasSpec,leftRecursive : boolean) : aliasSpecList
        {
            let obj = new aliasSpecList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _aliasSpec : IaliasSpec) : void
        {
            super.addElement(<ASTNode> _aliasSpec);
            (<ASTNode> _aliasSpec).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getaliasSpecAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getaliasSpecAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getaliasSpecAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getaliasSpecAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 46:  alias_lhs_macro_name ::= MACRO_NAME
     *</b>
     */
    export class alias_lhs_macro_name extends ASTNodeToken implements Ialias_lhs_macro_name
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_lhs_macro_name(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_lhs_macro_name(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_lhs_macro_name(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_lhs_macro_name(this, o); }
    }

    /**
     *<b>
    *<li>Rule 55:  define_segment ::= defineSpec
    *<li>Rule 56:  define_segment ::= define_segment defineSpec
     *</b>
     */
    export class defineSpecList extends AbstractASTNodeList implements Idefine_segment
    {
        public  getdefineSpecAt(i : number) : defineSpec{ return <defineSpec> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static defineSpecListfromElement(element : defineSpec,leftRecursive : boolean) : defineSpecList
        {
            let obj = new defineSpecList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _defineSpec : defineSpec) : void
        {
            super.addElement(<ASTNode> _defineSpec);
            (<ASTNode> _defineSpec).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getdefineSpecAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getdefineSpecAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getdefineSpecAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getdefineSpecAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 57:  defineSpec ::= macro_name_symbol macro_segment
     *</b>
     */
    export class defineSpec extends ASTNode implements IdefineSpec
    {
        private  _macro_name_symbol : Imacro_name_symbol;
        private  _macro_segment : macro_segment;

        public  getmacro_name_symbol() : Imacro_name_symbol{ return this._macro_name_symbol; }
        public  setmacro_name_symbol( _macro_name_symbol : Imacro_name_symbol) : void { this._macro_name_symbol = _macro_name_symbol; }
        public  getmacro_segment() : macro_segment{ return this._macro_segment; }
        public  setmacro_segment( _macro_segment : macro_segment) : void { this._macro_segment = _macro_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _macro_name_symbol : Imacro_name_symbol,
                     _macro_segment : macro_segment)
        {
            super(leftIToken, rightIToken)

            this._macro_name_symbol = _macro_name_symbol;
            (<ASTNode> _macro_name_symbol).setParent(this);
            this._macro_segment = _macro_segment;
            (<ASTNode> _macro_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._macro_name_symbol)  list.add(this._macro_name_symbol);
            if(this._macro_segment)  list.add(this._macro_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitdefineSpec(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitdefineSpec(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitdefineSpec(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitdefineSpec(this, o); }
    }

    /**
     *<b>
    *<li>Rule 60:  macro_segment ::= BLOCK
     *</b>
     */
    export class macro_segment extends ASTNodeToken implements Imacro_segment
    {
        public  getBLOCK() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitmacro_segment(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitmacro_segment(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitmacro_segment(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitmacro_segment(this, o); }
    }

    /**
     *<b>
    *<li>Rule 64:  export_segment ::= terminal_symbol
    *<li>Rule 65:  export_segment ::= export_segment terminal_symbol
     *</b>
     */
    export class terminal_symbolList extends AbstractASTNodeList implements Iexport_segment
    {
        public  getterminal_symbolAt(i : number) : Iterminal_symbol{ return <Iterminal_symbol> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static terminal_symbolListfromElement(element : Iterminal_symbol,leftRecursive : boolean) : terminal_symbolList
        {
            let obj = new terminal_symbolList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _terminal_symbol : Iterminal_symbol) : void
        {
            super.addElement(<ASTNode> _terminal_symbol);
            (<ASTNode> _terminal_symbol).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getterminal_symbolAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getterminal_symbolAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getterminal_symbolAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getterminal_symbolAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 66:  globals_segment ::= action_segment
    *<li>Rule 67:  globals_segment ::= globals_segment action_segment
    *<li>Rule 96:  notice_segment ::= action_segment
    *<li>Rule 97:  notice_segment ::= notice_segment action_segment
    *<li>Rule 146:  action_segment_list ::= %Empty
    *<li>Rule 147:  action_segment_list ::= action_segment_list action_segment
     *</b>
     */
    export class action_segmentList extends AbstractASTNodeList implements Iglobals_segment, Inotice_segment, Iaction_segment_list
    {
        public  getaction_segmentAt(i : number) : action_segment{ return <action_segment> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static action_segmentListfromElement(element : action_segment,leftRecursive : boolean) : action_segmentList
        {
            let obj = new action_segmentList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _action_segment : action_segment) : void
        {
            super.addElement(<ASTNode> _action_segment);
            (<ASTNode> _action_segment).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getaction_segmentAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getaction_segmentAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getaction_segmentAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getaction_segmentAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 70:  import_segment ::= SYMBOL drop_command_list
     *</b>
     */
    export class import_segment extends ASTNode implements Iimport_segment
    {
        private  _SYMBOL : ASTNodeToken;
        private  _drop_command_list : drop_commandList;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        public  getdrop_command_list() : drop_commandList{ return this._drop_command_list; }
        public  setdrop_command_list( _drop_command_list : drop_commandList) : void { this._drop_command_list = _drop_command_list; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _drop_command_list : drop_commandList)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._drop_command_list = _drop_command_list;
            (<ASTNode> _drop_command_list).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._drop_command_list)  list.add(this._drop_command_list);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitimport_segment(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitimport_segment(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitimport_segment(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitimport_segment(this, o); }
    }

    /**
     *<b>
    *<li>Rule 71:  drop_command_list ::= %Empty
    *<li>Rule 72:  drop_command_list ::= drop_command_list drop_command
     *</b>
     */
    export class drop_commandList extends AbstractASTNodeList implements Idrop_command_list
    {
        public  getdrop_commandAt(i : number) : Idrop_command{ return <Idrop_command> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static drop_commandListfromElement(element : Idrop_command,leftRecursive : boolean) : drop_commandList
        {
            let obj = new drop_commandList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _drop_command : Idrop_command) : void
        {
            super.addElement(<ASTNode> _drop_command);
            (<ASTNode> _drop_command).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getdrop_commandAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getdrop_commandAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getdrop_commandAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getdrop_commandAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 77:  drop_rules ::= drop_rule
    *<li>Rule 78:  drop_rules ::= drop_rules drop_rule
     *</b>
     */
    export class drop_ruleList extends AbstractASTNodeList implements Idrop_rules
    {
        public  getdrop_ruleAt(i : number) : drop_rule{ return <drop_rule> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static drop_ruleListfromElement(element : drop_rule,leftRecursive : boolean) : drop_ruleList
        {
            let obj = new drop_ruleList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _drop_rule : drop_rule) : void
        {
            super.addElement(<ASTNode> _drop_rule);
            (<ASTNode> _drop_rule).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getdrop_ruleAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getdrop_ruleAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getdrop_ruleAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getdrop_ruleAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 79:  drop_rule ::= SYMBOL optMacroName produces ruleList
     *</b>
     */
    export class drop_rule extends ASTNode implements Idrop_rule
    {
        private  _SYMBOL : ASTNodeToken;
        private  _optMacroName : optMacroName| null;
        private  _produces : Iproduces;
        private  _ruleList : ruleList;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        /**
         * The value returned by <b>getoptMacroName</b> may be <b>null</b>
         */
        public  getoptMacroName() : optMacroName | null { return this._optMacroName; }
        public  setoptMacroName( _optMacroName : optMacroName) : void { this._optMacroName = _optMacroName; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getruleList() : ruleList{ return this._ruleList; }
        public  setruleList( _ruleList : ruleList) : void { this._ruleList = _ruleList; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _optMacroName : optMacroName| null,
                     _produces : Iproduces,
                     _ruleList : ruleList)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._optMacroName = _optMacroName;
            if (_optMacroName) (<ASTNode> _optMacroName).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._ruleList = _ruleList;
            (<ASTNode> _ruleList).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._optMacroName)  list.add(this._optMacroName);
            if(this._produces)  list.add(this._produces);
            if(this._ruleList)  list.add(this._ruleList);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitdrop_rule(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitdrop_rule(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitdrop_rule(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitdrop_rule(this, o); }
    }

    /**
     *<em>
    *<li>Rule 80:  optMacroName ::= %Empty
     *</em>
     *<p>
     *<b>
    *<li>Rule 81:  optMacroName ::= MACRO_NAME
     *</b>
     */
    export class optMacroName extends ASTNodeToken implements IoptMacroName
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoptMacroName(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoptMacroName(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoptMacroName(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoptMacroName(this, o); }
    }

    /**
     *<b>
    *<li>Rule 82:  include_segment ::= SYMBOL
     *</b>
     */
    export class include_segment extends ASTNodeToken implements Iinclude_segment
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitinclude_segment(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitinclude_segment(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitinclude_segment(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitinclude_segment(this, o); }
    }

    /**
     *<b>
    *<li>Rule 83:  keywords_segment ::= keywordSpec
    *<li>Rule 84:  keywords_segment ::= keywords_segment keywordSpec
     *</b>
     */
    export class keywordSpecList extends AbstractASTNodeList implements Ikeywords_segment
    {
        public  getkeywordSpecAt(i : number) : IkeywordSpec{ return <IkeywordSpec> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static keywordSpecListfromElement(element : IkeywordSpec,leftRecursive : boolean) : keywordSpecList
        {
            let obj = new keywordSpecList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _keywordSpec : IkeywordSpec) : void
        {
            super.addElement(<ASTNode> _keywordSpec);
            (<ASTNode> _keywordSpec).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getkeywordSpecAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getkeywordSpecAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getkeywordSpecAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getkeywordSpecAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<em>
    *<li>Rule 85:  keywordSpec ::= terminal_symbol
     *</em>
     *<p>
     *<b>
    *<li>Rule 86:  keywordSpec ::= terminal_symbol produces name
     *</b>
     */
    export class keywordSpec extends ASTNode implements IkeywordSpec
    {
        private  _terminal_symbol : Iterminal_symbol;
        private  _produces : Iproduces;
        private  _name : Iname;

        public  getterminal_symbol() : Iterminal_symbol{ return this._terminal_symbol; }
        public  setterminal_symbol( _terminal_symbol : Iterminal_symbol) : void { this._terminal_symbol = _terminal_symbol; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getname() : Iname{ return this._name; }
        public  setname( _name : Iname) : void { this._name = _name; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _terminal_symbol : Iterminal_symbol,
                     _produces : Iproduces,
                     _name : Iname)
        {
            super(leftIToken, rightIToken)

            this._terminal_symbol = _terminal_symbol;
            (<ASTNode> _terminal_symbol).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._name = _name;
            (<ASTNode> _name).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._terminal_symbol)  list.add(this._terminal_symbol);
            if(this._produces)  list.add(this._produces);
            if(this._name)  list.add(this._name);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitkeywordSpec(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitkeywordSpec(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitkeywordSpec(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitkeywordSpec(this, o); }
    }

    /**
     *<b>
    *<li>Rule 87:  names_segment ::= nameSpec
    *<li>Rule 88:  names_segment ::= names_segment nameSpec
     *</b>
     */
    export class nameSpecList extends AbstractASTNodeList implements Inames_segment
    {
        public  getnameSpecAt(i : number) : nameSpec{ return <nameSpec> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static nameSpecListfromElement(element : nameSpec,leftRecursive : boolean) : nameSpecList
        {
            let obj = new nameSpecList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _nameSpec : nameSpec) : void
        {
            super.addElement(<ASTNode> _nameSpec);
            (<ASTNode> _nameSpec).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getnameSpecAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getnameSpecAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getnameSpecAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getnameSpecAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 89:  nameSpec ::= name produces name
     *</b>
     */
    export class nameSpec extends ASTNode implements InameSpec
    {
        private  _name : Iname;
        private  _produces : Iproduces;
        private  _name3 : Iname;

        public  getname() : Iname{ return this._name; }
        public  setname( _name : Iname) : void { this._name = _name; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getname3() : Iname{ return this._name3; }
        public  setname3( _name3 : Iname) : void { this._name3 = _name3; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _name : Iname,
                     _produces : Iproduces,
                     _name3 : Iname)
        {
            super(leftIToken, rightIToken)

            this._name = _name;
            (<ASTNode> _name).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._name3 = _name3;
            (<ASTNode> _name3).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._name)  list.add(this._name);
            if(this._produces)  list.add(this._produces);
            if(this._name3)  list.add(this._name3);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitnameSpec(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitnameSpec(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitnameSpec(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitnameSpec(this, o); }
    }

    /**
     *<b>
    *<li>Rule 98:  rules_segment ::= action_segment_list nonTermList
     *</b>
     */
    export class rules_segment extends ASTNode implements Irules_segment
    {
        private  _action_segment_list : action_segmentList;
        private  _nonTermList : nonTermList;

        public  getaction_segment_list() : action_segmentList{ return this._action_segment_list; }
        public  setaction_segment_list( _action_segment_list : action_segmentList) : void { this._action_segment_list = _action_segment_list; }
        public  getnonTermList() : nonTermList{ return this._nonTermList; }
        public  setnonTermList( _nonTermList : nonTermList) : void { this._nonTermList = _nonTermList; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _action_segment_list : action_segmentList,
                     _nonTermList : nonTermList)
        {
            super(leftIToken, rightIToken)

            this._action_segment_list = _action_segment_list;
            (<ASTNode> _action_segment_list).setParent(this);
            this._nonTermList = _nonTermList;
            (<ASTNode> _nonTermList).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._action_segment_list)  list.add(this._action_segment_list);
            if(this._nonTermList)  list.add(this._nonTermList);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitrules_segment(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitrules_segment(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitrules_segment(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitrules_segment(this, o); }
    }

    /**
     *<b>
    *<li>Rule 99:  nonTermList ::= %Empty
    *<li>Rule 100:  nonTermList ::= nonTermList nonTerm
     *</b>
     */
    export class nonTermList extends AbstractASTNodeList implements InonTermList
    {
        public  getnonTermAt(i : number) : nonTerm{ return <nonTerm> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static nonTermListfromElement(element : nonTerm,leftRecursive : boolean) : nonTermList
        {
            let obj = new nonTermList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _nonTerm : nonTerm) : void
        {
            super.addElement(<ASTNode> _nonTerm);
            (<ASTNode> _nonTerm).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getnonTermAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getnonTermAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getnonTermAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getnonTermAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 101:  nonTerm ::= ruleNameWithAttributes produces ruleList
     *</b>
     */
    export class nonTerm extends ASTNode implements InonTerm
    {
        private  _ruleNameWithAttributes : RuleName;
        private  _produces : Iproduces;
        private  _ruleList : ruleList;

        public  getruleNameWithAttributes() : RuleName{ return this._ruleNameWithAttributes; }
        public  setruleNameWithAttributes( _ruleNameWithAttributes : RuleName) : void { this._ruleNameWithAttributes = _ruleNameWithAttributes; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getruleList() : ruleList{ return this._ruleList; }
        public  setruleList( _ruleList : ruleList) : void { this._ruleList = _ruleList; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _ruleNameWithAttributes : RuleName,
                     _produces : Iproduces,
                     _ruleList : ruleList)
        {
            super(leftIToken, rightIToken)

            this._ruleNameWithAttributes = _ruleNameWithAttributes;
            (<ASTNode> _ruleNameWithAttributes).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._ruleList = _ruleList;
            (<ASTNode> _ruleList).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._ruleNameWithAttributes)  list.add(this._ruleNameWithAttributes);
            if(this._produces)  list.add(this._produces);
            if(this._ruleList)  list.add(this._ruleList);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitnonTerm(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitnonTerm(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitnonTerm(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitnonTerm(this, o); }
    }

    /**
     *<b>
    *<li>Rule 102:  ruleNameWithAttributes ::= SYMBOL
    *<li>Rule 103:  ruleNameWithAttributes ::= SYMBOL MACRO_NAME$className
    *<li>Rule 104:  ruleNameWithAttributes ::= SYMBOL MACRO_NAME$className MACRO_NAME$arrayElement
     *</b>
     */
    export class RuleName extends ASTNode implements IruleNameWithAttributes
    {
        private  _SYMBOL : ASTNodeToken;
        private  _className : ASTNodeToken | null;
        private  _arrayElement : ASTNodeToken | null;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        /**
         * The value returned by <b>getclassName</b> may be <b>null</b>
         */
        public  getclassName() : ASTNodeToken | null { return this._className; }
        /**
         * The value returned by <b>getarrayElement</b> may be <b>null</b>
         */
        public  getarrayElement() : ASTNodeToken | null { return this._arrayElement; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _className : ASTNodeToken | null,
                     _arrayElement : ASTNodeToken | null)
        {
            super(leftIToken, rightIToken);

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._className = _className;
            if (_className) (<ASTNode> _className).setParent(this);
            this._arrayElement = _arrayElement;
            if (_arrayElement) (<ASTNode> _arrayElement).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._className)  list.add(this._className);
            if(this._arrayElement)  list.add(this._arrayElement);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitRuleName(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitRuleName(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitRuleName(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitRuleName(this, o); }
    }

    /**
     *<b>
    *<li>Rule 105:  ruleList ::= rule
    *<li>Rule 106:  ruleList ::= ruleList |$ rule
     *</b>
     */
    export class ruleList extends AbstractASTNodeList implements IruleList
    {
        public  getruleAt(i : number) : rule{ return <rule> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static ruleListfromElement(element : rule,leftRecursive : boolean) : ruleList
        {
            let obj = new ruleList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _rule : rule) : void
        {
            super.addElement(<ASTNode> _rule);
            (<ASTNode> _rule).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getruleAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getruleAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getruleAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getruleAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 111:  rule ::= symWithAttrsList action_segment_list
     *</b>
     */
    export class rule extends ASTNode implements Irule
    {
        private  _symWithAttrsList : symWithAttrsList;
        private  _action_segment_list : action_segmentList;

        public  getsymWithAttrsList() : symWithAttrsList{ return this._symWithAttrsList; }
        public  setsymWithAttrsList( _symWithAttrsList : symWithAttrsList) : void { this._symWithAttrsList = _symWithAttrsList; }
        public  getaction_segment_list() : action_segmentList{ return this._action_segment_list; }
        public  setaction_segment_list( _action_segment_list : action_segmentList) : void { this._action_segment_list = _action_segment_list; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _symWithAttrsList : symWithAttrsList,
                     _action_segment_list : action_segmentList)
        {
            super(leftIToken, rightIToken)

            this._symWithAttrsList = _symWithAttrsList;
            (<ASTNode> _symWithAttrsList).setParent(this);
            this._action_segment_list = _action_segment_list;
            (<ASTNode> _action_segment_list).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._symWithAttrsList)  list.add(this._symWithAttrsList);
            if(this._action_segment_list)  list.add(this._action_segment_list);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitrule(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitrule(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitrule(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitrule(this, o); }
    }

    /**
     *<b>
    *<li>Rule 112:  symWithAttrsList ::= %Empty
    *<li>Rule 113:  symWithAttrsList ::= symWithAttrsList symWithAttrs
     *</b>
     */
    export class symWithAttrsList extends AbstractASTNodeList implements IsymWithAttrsList
    {
        public  getsymWithAttrsAt(i : number) : IsymWithAttrs{ return <IsymWithAttrs> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static symWithAttrsListfromElement(element : IsymWithAttrs,leftRecursive : boolean) : symWithAttrsList
        {
            let obj = new symWithAttrsList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _symWithAttrs : IsymWithAttrs) : void
        {
            super.addElement(<ASTNode> _symWithAttrs);
            (<ASTNode> _symWithAttrs).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getsymWithAttrsAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getsymWithAttrsAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getsymWithAttrsAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getsymWithAttrsAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 116:  optAttrList ::= %Empty
    *<li>Rule 117:  optAttrList ::= MACRO_NAME
     *</b>
     */
    export class symAttrs extends ASTNode implements IoptAttrList
    {
        private  _MACRO_NAME : ASTNodeToken | null;

        /**
         * The value returned by <b>getMACRO_NAME</b> may be <b>null</b>
         */
        public  getMACRO_NAME() : ASTNodeToken | null { return this._MACRO_NAME; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _MACRO_NAME : ASTNodeToken | null)
        {
            super(leftIToken, rightIToken);

            this._MACRO_NAME = _MACRO_NAME;
            if (_MACRO_NAME) (<ASTNode> _MACRO_NAME).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._MACRO_NAME)  list.add(this._MACRO_NAME);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitsymAttrs(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitsymAttrs(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitsymAttrs(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitsymAttrs(this, o); }
    }

    /**
     *<b>
    *<li>Rule 120:  action_segment ::= BLOCK
     *</b>
     */
    export class action_segment extends ASTNodeToken implements Iaction_segment
    {
        public  getBLOCK() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaction_segment(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaction_segment(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaction_segment(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaction_segment(this, o); }
    }

    /**
     *<b>
    *<li>Rule 121:  start_segment ::= start_symbol
    *<li>Rule 122:  start_segment ::= start_segment start_symbol
     *</b>
     */
    export class start_symbolList extends AbstractASTNodeList implements Istart_segment
    {
        public  getstart_symbolAt(i : number) : Istart_symbol{ return <Istart_symbol> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static start_symbolListfromElement(element : Istart_symbol,leftRecursive : boolean) : start_symbolList
        {
            let obj = new start_symbolList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _start_symbol : Istart_symbol) : void
        {
            super.addElement(<ASTNode> _start_symbol);
            (<ASTNode> _start_symbol).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) : void{ for (let i = 0; i < this.size(); i++) this.getstart_symbolAt(i).acceptWithVisitor(v); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { for (let i = 0; i < this.size(); i++) this.getstart_symbolAt(i).acceptWithArg(v, o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getstart_symbolAt(i).acceptWithResult(v));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any 
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(this.getstart_symbolAt(i).acceptWthResultArgument(v, o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 125:  terminals_segment ::= terminal
    *<li>Rule 126:  terminals_segment ::= terminals_segment terminal
     *</b>
     */
    export class terminalList extends AbstractASTNodeList implements Iterminals_segment
    {
        public  getterminalAt(i : number) : terminal{ return <terminal> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static terminalListfromElement(element : terminal,leftRecursive : boolean) : terminalList
        {
            let obj = new terminalList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _terminal : terminal) : void
        {
            super.addElement(<ASTNode> _terminal);
            (<ASTNode> _terminal).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getterminalAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getterminalAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getterminalAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getterminalAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 125:  terminals_segment ::= terminal
    *<li>Rule 126:  terminals_segment ::= terminals_segment terminal
     *</b>
     */
    export class terminals_segment_terminalList extends terminalList
    {
        private  environment : LPGParser;
        public  getEnvironment() :LPGParser{ return this.environment; }

        constructor(environment : LPGParser, leftIToken : IToken,  rightIToken : IToken, leftRecursive : boolean)
        {
            super(leftIToken, rightIToken, leftRecursive);
            this.environment = environment;
            this.initialize();
        }

       public static  terminals_segment_terminalListfromElement(environment : LPGParser,element : terminal,leftRecursive : boolean) : terminals_segment_terminalList
        {
            let obj = new terminals_segment_terminalList(environment,element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

    }

    /**
     *<b>
    *<li>Rule 127:  terminal ::= terminal_symbol optTerminalAlias
     *</b>
     */
    export class terminal extends ASTNode implements Iterminal
    {
        private  _terminal_symbol : Iterminal_symbol;
        private  _optTerminalAlias : optTerminalAlias| null;

        public  getterminal_symbol() : Iterminal_symbol{ return this._terminal_symbol; }
        public  setterminal_symbol( _terminal_symbol : Iterminal_symbol) : void { this._terminal_symbol = _terminal_symbol; }
        /**
         * The value returned by <b>getoptTerminalAlias</b> may be <b>null</b>
         */
        public  getoptTerminalAlias() : optTerminalAlias | null { return this._optTerminalAlias; }
        public  setoptTerminalAlias( _optTerminalAlias : optTerminalAlias) : void { this._optTerminalAlias = _optTerminalAlias; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _terminal_symbol : Iterminal_symbol,
                     _optTerminalAlias : optTerminalAlias| null)
        {
            super(leftIToken, rightIToken)

            this._terminal_symbol = _terminal_symbol;
            (<ASTNode> _terminal_symbol).setParent(this);
            this._optTerminalAlias = _optTerminalAlias;
            if (_optTerminalAlias) (<ASTNode> _optTerminalAlias).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._terminal_symbol)  list.add(this._terminal_symbol);
            if(this._optTerminalAlias)  list.add(this._optTerminalAlias);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitterminal(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitterminal(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitterminal(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitterminal(this, o); }
    }

    /**
     *<em>
    *<li>Rule 128:  optTerminalAlias ::= %Empty
     *</em>
     *<p>
     *<b>
    *<li>Rule 129:  optTerminalAlias ::= produces name
     *</b>
     */
    export class optTerminalAlias extends ASTNode implements IoptTerminalAlias
    {
        private  _produces : Iproduces;
        private  _name : Iname;

        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getname() : Iname{ return this._name; }
        public  setname( _name : Iname) : void { this._name = _name; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _produces : Iproduces,
                     _name : Iname)
        {
            super(leftIToken, rightIToken)

            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._name = _name;
            (<ASTNode> _name).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._produces)  list.add(this._produces);
            if(this._name)  list.add(this._name);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoptTerminalAlias(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoptTerminalAlias(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoptTerminalAlias(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoptTerminalAlias(this, o); }
    }

    /**
     *<b>
    *<li>Rule 133:  types_segment ::= type_declarations
    *<li>Rule 134:  types_segment ::= types_segment type_declarations
     *</b>
     */
    export class type_declarationsList extends AbstractASTNodeList implements Itypes_segment
    {
        public  gettype_declarationsAt(i : number) : type_declarations{ return <type_declarations> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static type_declarationsListfromElement(element : type_declarations,leftRecursive : boolean) : type_declarationsList
        {
            let obj = new type_declarationsList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _type_declarations : type_declarations) : void
        {
            super.addElement(<ASTNode> _type_declarations);
            (<ASTNode> _type_declarations).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.gettype_declarationsAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.gettype_declarationsAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.gettype_declarationsAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.gettype_declarationsAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 135:  type_declarations ::= SYMBOL produces barSymbolList opt_action_segment
     *</b>
     */
    export class type_declarations extends ASTNode implements Itype_declarations
    {
        private  _SYMBOL : ASTNodeToken;
        private  _produces : Iproduces;
        private  _barSymbolList : SYMBOLList;
        private  _opt_action_segment : action_segment| null;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getbarSymbolList() : SYMBOLList{ return this._barSymbolList; }
        public  setbarSymbolList( _barSymbolList : SYMBOLList) : void { this._barSymbolList = _barSymbolList; }
        /**
         * The value returned by <b>getopt_action_segment</b> may be <b>null</b>
         */
        public  getopt_action_segment() : action_segment | null { return this._opt_action_segment; }
        public  setopt_action_segment( _opt_action_segment : action_segment) : void { this._opt_action_segment = _opt_action_segment; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _produces : Iproduces,
                     _barSymbolList : SYMBOLList,
                     _opt_action_segment : action_segment| null)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._barSymbolList = _barSymbolList;
            (<ASTNode> _barSymbolList).setParent(this);
            this._opt_action_segment = _opt_action_segment;
            if (_opt_action_segment) (<ASTNode> _opt_action_segment).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._produces)  list.add(this._produces);
            if(this._barSymbolList)  list.add(this._barSymbolList);
            if(this._opt_action_segment)  list.add(this._opt_action_segment);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visittype_declarations(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visittype_declarations(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visittype_declarations(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visittype_declarations(this, o); }
    }

    /**
     *<b>
    *<li>Rule 138:  predecessor_segment ::= %Empty
    *<li>Rule 139:  predecessor_segment ::= predecessor_segment symbol_pair
     *</b>
     */
    export class symbol_pairList extends AbstractASTNodeList implements Ipredecessor_segment
    {
        public  getsymbol_pairAt(i : number) : symbol_pair{ return <symbol_pair> this.getElementAt(i); }

        constructor(leftToken : IToken, rightToken : IToken , leftRecursive : boolean )
        {
            super(leftToken, rightToken, leftRecursive);
        }

       public static symbol_pairListfromElement(element : symbol_pair,leftRecursive : boolean) : symbol_pairList
        {
            let obj = new symbol_pairList(element.getLeftIToken(),element.getRightIToken(), leftRecursive);
            obj.list.add(element);
            (<ASTNode> element).setParent(obj);
            return obj;
        }

        public  addElement( _symbol_pair : symbol_pair) : void
        {
            super.addElement(<ASTNode> _symbol_pair);
            (<ASTNode> _symbol_pair).setParent(this);
        }


        public  acceptWithVisitor(v : Visitor) :void { for (let i = 0; i < this.size(); i++) v.visit(this.getsymbol_pairAt(i)); }
        public  acceptWithArg(v : ArgumentVisitor, o : any)  : void{ for (let i = 0; i < this.size(); i++) v.visit(this.getsymbol_pairAt(i), o); }
        public  acceptWithResult(v : ResultVisitor) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getsymbol_pairAt(i)));
            return result;
        }
        public  acceptWthResultArgument(v: ResultArgumentVisitor, o : any) : any
        {
            let result = new Lpg.Util.ArrayList<IAst>();
            for (let i = 0; i < this.size(); i++)
                result.add(v.visit(this.getsymbol_pairAt(i), o));
            return result;
        }
    }

    /**
     *<b>
    *<li>Rule 140:  symbol_pair ::= SYMBOL SYMBOL
     *</b>
     */
    export class symbol_pair extends ASTNode implements Isymbol_pair
    {
        private  _SYMBOL : ASTNodeToken;
        private  _SYMBOL2 : ASTNodeToken;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        public  getSYMBOL2() : ASTNodeToken{ return this._SYMBOL2; }
        public  setSYMBOL2( _SYMBOL2 : ASTNodeToken) : void { this._SYMBOL2 = _SYMBOL2; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _SYMBOL2 : ASTNodeToken)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._SYMBOL2 = _SYMBOL2;
            (<ASTNode> _SYMBOL2).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._SYMBOL2)  list.add(this._SYMBOL2);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitsymbol_pair(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitsymbol_pair(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitsymbol_pair(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitsymbol_pair(this, o); }
    }

    /**
     *<b>
    *<li>Rule 143:  recover_symbol ::= SYMBOL
     *</b>
     */
    export class recover_symbol extends ASTNodeToken implements Irecover_symbol
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitrecover_symbol(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitrecover_symbol(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitrecover_symbol(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitrecover_symbol(this, o); }
    }

    /**
     *<em>
    *<li>Rule 144:  END_KEY_OPT ::= %Empty
     *</em>
     *<p>
     *<b>
    *<li>Rule 145:  END_KEY_OPT ::= END_KEY
     *</b>
     */
    export class END_KEY_OPT extends ASTNodeToken implements IEND_KEY_OPT
    {
        public  getEND_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitEND_KEY_OPT(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitEND_KEY_OPT(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitEND_KEY_OPT(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitEND_KEY_OPT(this, o); }
    }

    /**
     *<b>
    *<li>Rule 34:  option_value ::= =$ SYMBOL
     *</b>
     */
    export class option_value0 extends ASTNode implements Ioption_value
    {
        private  _SYMBOL : ASTNodeToken;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoption_value0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoption_value0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoption_value0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoption_value0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 35:  option_value ::= =$ ($ symbol_list )$
     *</b>
     */
    export class option_value1 extends ASTNode implements Ioption_value
    {
        private  _symbol_list : SYMBOLList;

        public  getsymbol_list() : SYMBOLList{ return this._symbol_list; }
        public  setsymbol_list( _symbol_list : SYMBOLList) : void { this._symbol_list = _symbol_list; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _symbol_list : SYMBOLList)
        {
            super(leftIToken, rightIToken)

            this._symbol_list = _symbol_list;
            (<ASTNode> _symbol_list).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._symbol_list)  list.add(this._symbol_list);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitoption_value1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitoption_value1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitoption_value1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitoption_value1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 40:  aliasSpec ::= ERROR_KEY produces alias_rhs
     *</b>
     */
    export class aliasSpec0 extends ASTNode implements IaliasSpec
    {
        private  _ERROR_KEY : ASTNodeToken;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getERROR_KEY() : ASTNodeToken{ return this._ERROR_KEY; }
        public  setERROR_KEY( _ERROR_KEY : ASTNodeToken) : void { this._ERROR_KEY = _ERROR_KEY; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _ERROR_KEY : ASTNodeToken,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._ERROR_KEY = _ERROR_KEY;
            (<ASTNode> _ERROR_KEY).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._ERROR_KEY)  list.add(this._ERROR_KEY);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 41:  aliasSpec ::= EOL_KEY produces alias_rhs
     *</b>
     */
    export class aliasSpec1 extends ASTNode implements IaliasSpec
    {
        private  _EOL_KEY : ASTNodeToken;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getEOL_KEY() : ASTNodeToken{ return this._EOL_KEY; }
        public  setEOL_KEY( _EOL_KEY : ASTNodeToken) : void { this._EOL_KEY = _EOL_KEY; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _EOL_KEY : ASTNodeToken,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._EOL_KEY = _EOL_KEY;
            (<ASTNode> _EOL_KEY).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._EOL_KEY)  list.add(this._EOL_KEY);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 42:  aliasSpec ::= EOF_KEY produces alias_rhs
     *</b>
     */
    export class aliasSpec2 extends ASTNode implements IaliasSpec
    {
        private  _EOF_KEY : ASTNodeToken;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getEOF_KEY() : ASTNodeToken{ return this._EOF_KEY; }
        public  setEOF_KEY( _EOF_KEY : ASTNodeToken) : void { this._EOF_KEY = _EOF_KEY; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _EOF_KEY : ASTNodeToken,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._EOF_KEY = _EOF_KEY;
            (<ASTNode> _EOF_KEY).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._EOF_KEY)  list.add(this._EOF_KEY);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec2(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec2(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec2(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec2(this, o); }
    }

    /**
     *<b>
    *<li>Rule 43:  aliasSpec ::= IDENTIFIER_KEY produces alias_rhs
     *</b>
     */
    export class aliasSpec3 extends ASTNode implements IaliasSpec
    {
        private  _IDENTIFIER_KEY : ASTNodeToken;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getIDENTIFIER_KEY() : ASTNodeToken{ return this._IDENTIFIER_KEY; }
        public  setIDENTIFIER_KEY( _IDENTIFIER_KEY : ASTNodeToken) : void { this._IDENTIFIER_KEY = _IDENTIFIER_KEY; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _IDENTIFIER_KEY : ASTNodeToken,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._IDENTIFIER_KEY = _IDENTIFIER_KEY;
            (<ASTNode> _IDENTIFIER_KEY).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._IDENTIFIER_KEY)  list.add(this._IDENTIFIER_KEY);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec3(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec3(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec3(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec3(this, o); }
    }

    /**
     *<b>
    *<li>Rule 44:  aliasSpec ::= SYMBOL produces alias_rhs
     *</b>
     */
    export class aliasSpec4 extends ASTNode implements IaliasSpec
    {
        private  _SYMBOL : ASTNodeToken;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec4(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec4(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec4(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec4(this, o); }
    }

    /**
     *<b>
    *<li>Rule 45:  aliasSpec ::= alias_lhs_macro_name produces alias_rhs
     *</b>
     */
    export class aliasSpec5 extends ASTNode implements IaliasSpec
    {
        private  _alias_lhs_macro_name : alias_lhs_macro_name;
        private  _produces : Iproduces;
        private  _alias_rhs : Ialias_rhs;

        public  getalias_lhs_macro_name() : alias_lhs_macro_name{ return this._alias_lhs_macro_name; }
        public  setalias_lhs_macro_name( _alias_lhs_macro_name : alias_lhs_macro_name) : void { this._alias_lhs_macro_name = _alias_lhs_macro_name; }
        public  getproduces() : Iproduces{ return this._produces; }
        public  setproduces( _produces : Iproduces) : void { this._produces = _produces; }
        public  getalias_rhs() : Ialias_rhs{ return this._alias_rhs; }
        public  setalias_rhs( _alias_rhs : Ialias_rhs) : void { this._alias_rhs = _alias_rhs; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _alias_lhs_macro_name : alias_lhs_macro_name,
                     _produces : Iproduces,
                     _alias_rhs : Ialias_rhs)
        {
            super(leftIToken, rightIToken)

            this._alias_lhs_macro_name = _alias_lhs_macro_name;
            (<ASTNode> _alias_lhs_macro_name).setParent(this);
            this._produces = _produces;
            (<ASTNode> _produces).setParent(this);
            this._alias_rhs = _alias_rhs;
            (<ASTNode> _alias_rhs).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._alias_lhs_macro_name)  list.add(this._alias_lhs_macro_name);
            if(this._produces)  list.add(this._produces);
            if(this._alias_rhs)  list.add(this._alias_rhs);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitaliasSpec5(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitaliasSpec5(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitaliasSpec5(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitaliasSpec5(this, o); }
    }

    /**
     *<b>
    *<li>Rule 47:  alias_rhs ::= SYMBOL
     *</b>
     */
    export class alias_rhs0 extends ASTNodeToken implements Ialias_rhs
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 48:  alias_rhs ::= MACRO_NAME
     *</b>
     */
    export class alias_rhs1 extends ASTNodeToken implements Ialias_rhs
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 49:  alias_rhs ::= ERROR_KEY
     *</b>
     */
    export class alias_rhs2 extends ASTNodeToken implements Ialias_rhs
    {
        public  getERROR_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs2(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs2(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs2(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs2(this, o); }
    }

    /**
     *<b>
    *<li>Rule 50:  alias_rhs ::= EOL_KEY
     *</b>
     */
    export class alias_rhs3 extends ASTNodeToken implements Ialias_rhs
    {
        public  getEOL_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs3(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs3(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs3(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs3(this, o); }
    }

    /**
     *<b>
    *<li>Rule 51:  alias_rhs ::= EOF_KEY
     *</b>
     */
    export class alias_rhs4 extends ASTNodeToken implements Ialias_rhs
    {
        public  getEOF_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs4(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs4(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs4(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs4(this, o); }
    }

    /**
     *<b>
    *<li>Rule 52:  alias_rhs ::= EMPTY_KEY
     *</b>
     */
    export class alias_rhs5 extends ASTNodeToken implements Ialias_rhs
    {
        public  getEMPTY_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs5(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs5(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs5(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs5(this, o); }
    }

    /**
     *<b>
    *<li>Rule 53:  alias_rhs ::= IDENTIFIER_KEY
     *</b>
     */
    export class alias_rhs6 extends ASTNodeToken implements Ialias_rhs
    {
        public  getIDENTIFIER_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitalias_rhs6(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitalias_rhs6(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitalias_rhs6(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitalias_rhs6(this, o); }
    }

    /**
     *<b>
    *<li>Rule 58:  macro_name_symbol ::= MACRO_NAME
     *</b>
     */
    export class macro_name_symbol0 extends ASTNodeToken implements Imacro_name_symbol
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitmacro_name_symbol0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitmacro_name_symbol0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitmacro_name_symbol0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitmacro_name_symbol0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 59:  macro_name_symbol ::= SYMBOL
     *</b>
     */
    export class macro_name_symbol1 extends ASTNodeToken implements Imacro_name_symbol
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitmacro_name_symbol1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitmacro_name_symbol1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitmacro_name_symbol1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitmacro_name_symbol1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 73:  drop_command ::= DROPSYMBOLS_KEY drop_symbols
     *</b>
     */
    export class drop_command0 extends ASTNode implements Idrop_command
    {
        private  _DROPSYMBOLS_KEY : ASTNodeToken;
        private  _drop_symbols : SYMBOLList;

        public  getDROPSYMBOLS_KEY() : ASTNodeToken{ return this._DROPSYMBOLS_KEY; }
        public  setDROPSYMBOLS_KEY( _DROPSYMBOLS_KEY : ASTNodeToken) : void { this._DROPSYMBOLS_KEY = _DROPSYMBOLS_KEY; }
        public  getdrop_symbols() : SYMBOLList{ return this._drop_symbols; }
        public  setdrop_symbols( _drop_symbols : SYMBOLList) : void { this._drop_symbols = _drop_symbols; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _DROPSYMBOLS_KEY : ASTNodeToken,
                     _drop_symbols : SYMBOLList)
        {
            super(leftIToken, rightIToken)

            this._DROPSYMBOLS_KEY = _DROPSYMBOLS_KEY;
            (<ASTNode> _DROPSYMBOLS_KEY).setParent(this);
            this._drop_symbols = _drop_symbols;
            (<ASTNode> _drop_symbols).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._DROPSYMBOLS_KEY)  list.add(this._DROPSYMBOLS_KEY);
            if(this._drop_symbols)  list.add(this._drop_symbols);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitdrop_command0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitdrop_command0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitdrop_command0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitdrop_command0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 74:  drop_command ::= DROPRULES_KEY drop_rules
     *</b>
     */
    export class drop_command1 extends ASTNode implements Idrop_command
    {
        private  _DROPRULES_KEY : ASTNodeToken;
        private  _drop_rules : drop_ruleList;

        public  getDROPRULES_KEY() : ASTNodeToken{ return this._DROPRULES_KEY; }
        public  setDROPRULES_KEY( _DROPRULES_KEY : ASTNodeToken) : void { this._DROPRULES_KEY = _DROPRULES_KEY; }
        public  getdrop_rules() : drop_ruleList{ return this._drop_rules; }
        public  setdrop_rules( _drop_rules : drop_ruleList) : void { this._drop_rules = _drop_rules; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _DROPRULES_KEY : ASTNodeToken,
                     _drop_rules : drop_ruleList)
        {
            super(leftIToken, rightIToken)

            this._DROPRULES_KEY = _DROPRULES_KEY;
            (<ASTNode> _DROPRULES_KEY).setParent(this);
            this._drop_rules = _drop_rules;
            (<ASTNode> _drop_rules).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._DROPRULES_KEY)  list.add(this._DROPRULES_KEY);
            if(this._drop_rules)  list.add(this._drop_rules);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitdrop_command1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitdrop_command1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitdrop_command1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitdrop_command1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 90:  name ::= SYMBOL
     *</b>
     */
    export class name0 extends ASTNodeToken implements Iname
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 91:  name ::= MACRO_NAME
     *</b>
     */
    export class name1 extends ASTNodeToken implements Iname
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 92:  name ::= EMPTY_KEY
     *</b>
     */
    export class name2 extends ASTNodeToken implements Iname
    {
        public  getEMPTY_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname2(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname2(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname2(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname2(this, o); }
    }

    /**
     *<b>
    *<li>Rule 93:  name ::= ERROR_KEY
     *</b>
     */
    export class name3 extends ASTNodeToken implements Iname
    {
        public  getERROR_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname3(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname3(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname3(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname3(this, o); }
    }

    /**
     *<b>
    *<li>Rule 94:  name ::= EOL_KEY
     *</b>
     */
    export class name4 extends ASTNodeToken implements Iname
    {
        public  getEOL_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname4(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname4(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname4(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname4(this, o); }
    }

    /**
     *<b>
    *<li>Rule 95:  name ::= IDENTIFIER_KEY
     *</b>
     */
    export class name5 extends ASTNodeToken implements Iname
    {
        public  getIDENTIFIER_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitname5(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitname5(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitname5(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitname5(this, o); }
    }

    /**
     *<b>
    *<li>Rule 107:  produces ::= ::=
     *</b>
     */
    export class produces0 extends ASTNodeToken implements Iproduces
    {
        public  getEQUIVALENCE() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitproduces0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitproduces0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitproduces0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitproduces0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 108:  produces ::= ::=?
     *</b>
     */
    export class produces1 extends ASTNodeToken implements Iproduces
    {
        public  getPRIORITY_EQUIVALENCE() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitproduces1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitproduces1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitproduces1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitproduces1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 109:  produces ::= ->
     *</b>
     */
    export class produces2 extends ASTNodeToken implements Iproduces
    {
        public  getARROW() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitproduces2(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitproduces2(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitproduces2(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitproduces2(this, o); }
    }

    /**
     *<b>
    *<li>Rule 110:  produces ::= ->?
     *</b>
     */
    export class produces3 extends ASTNodeToken implements Iproduces
    {
        public  getPRIORITY_ARROW() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitproduces3(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitproduces3(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitproduces3(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitproduces3(this, o); }
    }

    /**
     *<b>
    *<li>Rule 114:  symWithAttrs ::= EMPTY_KEY
     *</b>
     */
    export class symWithAttrs0 extends ASTNodeToken implements IsymWithAttrs
    {
        public  getEMPTY_KEY() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitsymWithAttrs0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitsymWithAttrs0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitsymWithAttrs0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitsymWithAttrs0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 115:  symWithAttrs ::= SYMBOL optAttrList
     *</b>
     */
    export class symWithAttrs1 extends ASTNode implements IsymWithAttrs
    {
        private  _SYMBOL : ASTNodeToken;
        private  _optAttrList : symAttrs| null;

        public  getSYMBOL() : ASTNodeToken{ return this._SYMBOL; }
        public  setSYMBOL( _SYMBOL : ASTNodeToken) : void { this._SYMBOL = _SYMBOL; }
        /**
         * The value returned by <b>getoptAttrList</b> may be <b>null</b>
         */
        public  getoptAttrList() : symAttrs | null { return this._optAttrList; }
        public  setoptAttrList( _optAttrList : symAttrs) : void { this._optAttrList = _optAttrList; }

        constructor(leftIToken : IToken , rightIToken : IToken ,
                     _SYMBOL : ASTNodeToken,
                     _optAttrList : symAttrs| null)
        {
            super(leftIToken, rightIToken)

            this._SYMBOL = _SYMBOL;
            (<ASTNode> _SYMBOL).setParent(this);
            this._optAttrList = _optAttrList;
            if (_optAttrList) (<ASTNode> _optAttrList).setParent(this);
            this.initialize();
        }

        /**
         * A list of all children of this node, don't including the null ones.
         */
         public   getAllChildren() : Lpg.Util.ArrayList<IAst>
        {
            let list = new Lpg.Util.ArrayList<IAst>();
            if(this._SYMBOL)  list.add(this._SYMBOL);
            if(this._optAttrList)  list.add(this._optAttrList);
            return list;
        }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitsymWithAttrs1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitsymWithAttrs1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitsymWithAttrs1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitsymWithAttrs1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 123:  start_symbol ::= SYMBOL
     *</b>
     */
    export class start_symbol0 extends ASTNodeToken implements Istart_symbol
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitstart_symbol0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitstart_symbol0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitstart_symbol0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitstart_symbol0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 124:  start_symbol ::= MACRO_NAME
     *</b>
     */
    export class start_symbol1 extends ASTNodeToken implements Istart_symbol
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitstart_symbol1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitstart_symbol1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitstart_symbol1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitstart_symbol1(this, o); }
    }

    /**
     *<b>
    *<li>Rule 130:  terminal_symbol ::= SYMBOL
     *</b>
     */
    export class terminal_symbol0 extends ASTNodeToken implements Iterminal_symbol
    {
        public  getSYMBOL() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitterminal_symbol0(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitterminal_symbol0(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitterminal_symbol0(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitterminal_symbol0(this, o); }
    }

    /**
     *<b>
    *<li>Rule 131:  terminal_symbol ::= MACRO_NAME
     *</b>
     */
    export class terminal_symbol1 extends ASTNodeToken implements Iterminal_symbol
    {
        public  getMACRO_NAME() : IToken { return this.leftIToken; }

    constructor(token : IToken ) { super(token); this.initialize(); }

        public  acceptWithVisitor(v : Visitor) : void{ v.visitterminal_symbol1(this); }
        public  acceptWithArg(v : ArgumentVisitor, o : any) : void { v.visitterminal_symbol1(this, o); }
        public  acceptWithResult(v : ResultVisitor) : any{ return v.visitterminal_symbol1(this); }
        public   acceptWthResultArgument(v : ResultArgumentVisitor, o : any) : any { return v.visitterminal_symbol1(this, o); }
    }

    export interface Visitor
    {
        visitASTNodeToken(n : ASTNodeToken) : void;
        visitLPG(n : LPG) : void;
        visitLPG_itemList(n : LPG_itemList) : void;
        visitAliasSeg(n : AliasSeg) : void;
        visitAstSeg(n : AstSeg) : void;
        visitDefineSeg(n : DefineSeg) : void;
        visitEofSeg(n : EofSeg) : void;
        visitEolSeg(n : EolSeg) : void;
        visitErrorSeg(n : ErrorSeg) : void;
        visitExportSeg(n : ExportSeg) : void;
        visitGlobalsSeg(n : GlobalsSeg) : void;
        visitHeadersSeg(n : HeadersSeg) : void;
        visitIdentifierSeg(n : IdentifierSeg) : void;
        visitImportSeg(n : ImportSeg) : void;
        visitIncludeSeg(n : IncludeSeg) : void;
        visitKeywordsSeg(n : KeywordsSeg) : void;
        visitNamesSeg(n : NamesSeg) : void;
        visitNoticeSeg(n : NoticeSeg) : void;
        visitRulesSeg(n : RulesSeg) : void;
        visitSoftKeywordsSeg(n : SoftKeywordsSeg) : void;
        visitStartSeg(n : StartSeg) : void;
        visitTerminalsSeg(n : TerminalsSeg) : void;
        visitTrailersSeg(n : TrailersSeg) : void;
        visitTypesSeg(n : TypesSeg) : void;
        visitRecoverSeg(n : RecoverSeg) : void;
        visitPredecessorSeg(n : PredecessorSeg) : void;
        visitoption_specList(n : option_specList) : void;
        visitoption_spec(n : option_spec) : void;
        visitoptionList(n : optionList) : void;
        visitoption(n : option) : void;
        visitSYMBOLList(n : SYMBOLList) : void;
        visitaliasSpecList(n : aliasSpecList) : void;
        visitalias_lhs_macro_name(n : alias_lhs_macro_name) : void;
        visitdefineSpecList(n : defineSpecList) : void;
        visitdefineSpec(n : defineSpec) : void;
        visitmacro_segment(n : macro_segment) : void;
        visitterminal_symbolList(n : terminal_symbolList) : void;
        visitaction_segmentList(n : action_segmentList) : void;
        visitimport_segment(n : import_segment) : void;
        visitdrop_commandList(n : drop_commandList) : void;
        visitdrop_ruleList(n : drop_ruleList) : void;
        visitdrop_rule(n : drop_rule) : void;
        visitoptMacroName(n : optMacroName) : void;
        visitinclude_segment(n : include_segment) : void;
        visitkeywordSpecList(n : keywordSpecList) : void;
        visitkeywordSpec(n : keywordSpec) : void;
        visitnameSpecList(n : nameSpecList) : void;
        visitnameSpec(n : nameSpec) : void;
        visitrules_segment(n : rules_segment) : void;
        visitnonTermList(n : nonTermList) : void;
        visitnonTerm(n : nonTerm) : void;
        visitRuleName(n : RuleName) : void;
        visitruleList(n : ruleList) : void;
        visitrule(n : rule) : void;
        visitsymWithAttrsList(n : symWithAttrsList) : void;
        visitsymAttrs(n : symAttrs) : void;
        visitaction_segment(n : action_segment) : void;
        visitstart_symbolList(n : start_symbolList) : void;
        visitterminals_segment_terminalList(n : terminals_segment_terminalList) : void;
        visitterminalList(n : terminalList) : void;
        visitterminal(n : terminal) : void;
        visitoptTerminalAlias(n : optTerminalAlias) : void;
        visittype_declarationsList(n : type_declarationsList) : void;
        visittype_declarations(n : type_declarations) : void;
        visitsymbol_pairList(n : symbol_pairList) : void;
        visitsymbol_pair(n : symbol_pair) : void;
        visitrecover_symbol(n : recover_symbol) : void;
        visitEND_KEY_OPT(n : END_KEY_OPT) : void;
        visitoption_value0(n : option_value0) : void;
        visitoption_value1(n : option_value1) : void;
        visitaliasSpec0(n : aliasSpec0) : void;
        visitaliasSpec1(n : aliasSpec1) : void;
        visitaliasSpec2(n : aliasSpec2) : void;
        visitaliasSpec3(n : aliasSpec3) : void;
        visitaliasSpec4(n : aliasSpec4) : void;
        visitaliasSpec5(n : aliasSpec5) : void;
        visitalias_rhs0(n : alias_rhs0) : void;
        visitalias_rhs1(n : alias_rhs1) : void;
        visitalias_rhs2(n : alias_rhs2) : void;
        visitalias_rhs3(n : alias_rhs3) : void;
        visitalias_rhs4(n : alias_rhs4) : void;
        visitalias_rhs5(n : alias_rhs5) : void;
        visitalias_rhs6(n : alias_rhs6) : void;
        visitmacro_name_symbol0(n : macro_name_symbol0) : void;
        visitmacro_name_symbol1(n : macro_name_symbol1) : void;
        visitdrop_command0(n : drop_command0) : void;
        visitdrop_command1(n : drop_command1) : void;
        visitname0(n : name0) : void;
        visitname1(n : name1) : void;
        visitname2(n : name2) : void;
        visitname3(n : name3) : void;
        visitname4(n : name4) : void;
        visitname5(n : name5) : void;
        visitproduces0(n : produces0) : void;
        visitproduces1(n : produces1) : void;
        visitproduces2(n : produces2) : void;
        visitproduces3(n : produces3) : void;
        visitsymWithAttrs0(n : symWithAttrs0) : void;
        visitsymWithAttrs1(n : symWithAttrs1) : void;
        visitstart_symbol0(n : start_symbol0) : void;
        visitstart_symbol1(n : start_symbol1) : void;
        visitterminal_symbol0(n : terminal_symbol0) : void;
        visitterminal_symbol1(n : terminal_symbol1) : void;

        visit(n : ASTNode) : void;
    }
    export interface ArgumentVisitor
    {
        visitASTNodeToken(n : ASTNodeToken, o : any) : void;
        visitLPG(n : LPG, o : any) : void;
        visitLPG_itemList(n : LPG_itemList, o : any) : void;
        visitAliasSeg(n : AliasSeg, o : any) : void;
        visitAstSeg(n : AstSeg, o : any) : void;
        visitDefineSeg(n : DefineSeg, o : any) : void;
        visitEofSeg(n : EofSeg, o : any) : void;
        visitEolSeg(n : EolSeg, o : any) : void;
        visitErrorSeg(n : ErrorSeg, o : any) : void;
        visitExportSeg(n : ExportSeg, o : any) : void;
        visitGlobalsSeg(n : GlobalsSeg, o : any) : void;
        visitHeadersSeg(n : HeadersSeg, o : any) : void;
        visitIdentifierSeg(n : IdentifierSeg, o : any) : void;
        visitImportSeg(n : ImportSeg, o : any) : void;
        visitIncludeSeg(n : IncludeSeg, o : any) : void;
        visitKeywordsSeg(n : KeywordsSeg, o : any) : void;
        visitNamesSeg(n : NamesSeg, o : any) : void;
        visitNoticeSeg(n : NoticeSeg, o : any) : void;
        visitRulesSeg(n : RulesSeg, o : any) : void;
        visitSoftKeywordsSeg(n : SoftKeywordsSeg, o : any) : void;
        visitStartSeg(n : StartSeg, o : any) : void;
        visitTerminalsSeg(n : TerminalsSeg, o : any) : void;
        visitTrailersSeg(n : TrailersSeg, o : any) : void;
        visitTypesSeg(n : TypesSeg, o : any) : void;
        visitRecoverSeg(n : RecoverSeg, o : any) : void;
        visitPredecessorSeg(n : PredecessorSeg, o : any) : void;
        visitoption_specList(n : option_specList, o : any) : void;
        visitoption_spec(n : option_spec, o : any) : void;
        visitoptionList(n : optionList, o : any) : void;
        visitoption(n : option, o : any) : void;
        visitSYMBOLList(n : SYMBOLList, o : any) : void;
        visitaliasSpecList(n : aliasSpecList, o : any) : void;
        visitalias_lhs_macro_name(n : alias_lhs_macro_name, o : any) : void;
        visitdefineSpecList(n : defineSpecList, o : any) : void;
        visitdefineSpec(n : defineSpec, o : any) : void;
        visitmacro_segment(n : macro_segment, o : any) : void;
        visitterminal_symbolList(n : terminal_symbolList, o : any) : void;
        visitaction_segmentList(n : action_segmentList, o : any) : void;
        visitimport_segment(n : import_segment, o : any) : void;
        visitdrop_commandList(n : drop_commandList, o : any) : void;
        visitdrop_ruleList(n : drop_ruleList, o : any) : void;
        visitdrop_rule(n : drop_rule, o : any) : void;
        visitoptMacroName(n : optMacroName, o : any) : void;
        visitinclude_segment(n : include_segment, o : any) : void;
        visitkeywordSpecList(n : keywordSpecList, o : any) : void;
        visitkeywordSpec(n : keywordSpec, o : any) : void;
        visitnameSpecList(n : nameSpecList, o : any) : void;
        visitnameSpec(n : nameSpec, o : any) : void;
        visitrules_segment(n : rules_segment, o : any) : void;
        visitnonTermList(n : nonTermList, o : any) : void;
        visitnonTerm(n : nonTerm, o : any) : void;
        visitRuleName(n : RuleName, o : any) : void;
        visitruleList(n : ruleList, o : any) : void;
        visitrule(n : rule, o : any) : void;
        visitsymWithAttrsList(n : symWithAttrsList, o : any) : void;
        visitsymAttrs(n : symAttrs, o : any) : void;
        visitaction_segment(n : action_segment, o : any) : void;
        visitstart_symbolList(n : start_symbolList, o : any) : void;
        visitterminals_segment_terminalList(n : terminals_segment_terminalList, o : any) : void;
        visitterminalList(n : terminalList, o : any) : void;
        visitterminal(n : terminal, o : any) : void;
        visitoptTerminalAlias(n : optTerminalAlias, o : any) : void;
        visittype_declarationsList(n : type_declarationsList, o : any) : void;
        visittype_declarations(n : type_declarations, o : any) : void;
        visitsymbol_pairList(n : symbol_pairList, o : any) : void;
        visitsymbol_pair(n : symbol_pair, o : any) : void;
        visitrecover_symbol(n : recover_symbol, o : any) : void;
        visitEND_KEY_OPT(n : END_KEY_OPT, o : any) : void;
        visitoption_value0(n : option_value0, o : any) : void;
        visitoption_value1(n : option_value1, o : any) : void;
        visitaliasSpec0(n : aliasSpec0, o : any) : void;
        visitaliasSpec1(n : aliasSpec1, o : any) : void;
        visitaliasSpec2(n : aliasSpec2, o : any) : void;
        visitaliasSpec3(n : aliasSpec3, o : any) : void;
        visitaliasSpec4(n : aliasSpec4, o : any) : void;
        visitaliasSpec5(n : aliasSpec5, o : any) : void;
        visitalias_rhs0(n : alias_rhs0, o : any) : void;
        visitalias_rhs1(n : alias_rhs1, o : any) : void;
        visitalias_rhs2(n : alias_rhs2, o : any) : void;
        visitalias_rhs3(n : alias_rhs3, o : any) : void;
        visitalias_rhs4(n : alias_rhs4, o : any) : void;
        visitalias_rhs5(n : alias_rhs5, o : any) : void;
        visitalias_rhs6(n : alias_rhs6, o : any) : void;
        visitmacro_name_symbol0(n : macro_name_symbol0, o : any) : void;
        visitmacro_name_symbol1(n : macro_name_symbol1, o : any) : void;
        visitdrop_command0(n : drop_command0, o : any) : void;
        visitdrop_command1(n : drop_command1, o : any) : void;
        visitname0(n : name0, o : any) : void;
        visitname1(n : name1, o : any) : void;
        visitname2(n : name2, o : any) : void;
        visitname3(n : name3, o : any) : void;
        visitname4(n : name4, o : any) : void;
        visitname5(n : name5, o : any) : void;
        visitproduces0(n : produces0, o : any) : void;
        visitproduces1(n : produces1, o : any) : void;
        visitproduces2(n : produces2, o : any) : void;
        visitproduces3(n : produces3, o : any) : void;
        visitsymWithAttrs0(n : symWithAttrs0, o : any) : void;
        visitsymWithAttrs1(n : symWithAttrs1, o : any) : void;
        visitstart_symbol0(n : start_symbol0, o : any) : void;
        visitstart_symbol1(n : start_symbol1, o : any) : void;
        visitterminal_symbol0(n : terminal_symbol0, o : any) : void;
        visitterminal_symbol1(n : terminal_symbol1, o : any) : void;

        visit(n : ASTNode, o : any) : void;
    }
    export interface ResultVisitor
    {
        visitASTNodeToken(n : ASTNodeToken) : any;
        visitLPG(n : LPG) : any;
        visitLPG_itemList(n : LPG_itemList) : any;
        visitAliasSeg(n : AliasSeg) : any;
        visitAstSeg(n : AstSeg) : any;
        visitDefineSeg(n : DefineSeg) : any;
        visitEofSeg(n : EofSeg) : any;
        visitEolSeg(n : EolSeg) : any;
        visitErrorSeg(n : ErrorSeg) : any;
        visitExportSeg(n : ExportSeg) : any;
        visitGlobalsSeg(n : GlobalsSeg) : any;
        visitHeadersSeg(n : HeadersSeg) : any;
        visitIdentifierSeg(n : IdentifierSeg) : any;
        visitImportSeg(n : ImportSeg) : any;
        visitIncludeSeg(n : IncludeSeg) : any;
        visitKeywordsSeg(n : KeywordsSeg) : any;
        visitNamesSeg(n : NamesSeg) : any;
        visitNoticeSeg(n : NoticeSeg) : any;
        visitRulesSeg(n : RulesSeg) : any;
        visitSoftKeywordsSeg(n : SoftKeywordsSeg) : any;
        visitStartSeg(n : StartSeg) : any;
        visitTerminalsSeg(n : TerminalsSeg) : any;
        visitTrailersSeg(n : TrailersSeg) : any;
        visitTypesSeg(n : TypesSeg) : any;
        visitRecoverSeg(n : RecoverSeg) : any;
        visitPredecessorSeg(n : PredecessorSeg) : any;
        visitoption_specList(n : option_specList) : any;
        visitoption_spec(n : option_spec) : any;
        visitoptionList(n : optionList) : any;
        visitoption(n : option) : any;
        visitSYMBOLList(n : SYMBOLList) : any;
        visitaliasSpecList(n : aliasSpecList) : any;
        visitalias_lhs_macro_name(n : alias_lhs_macro_name) : any;
        visitdefineSpecList(n : defineSpecList) : any;
        visitdefineSpec(n : defineSpec) : any;
        visitmacro_segment(n : macro_segment) : any;
        visitterminal_symbolList(n : terminal_symbolList) : any;
        visitaction_segmentList(n : action_segmentList) : any;
        visitimport_segment(n : import_segment) : any;
        visitdrop_commandList(n : drop_commandList) : any;
        visitdrop_ruleList(n : drop_ruleList) : any;
        visitdrop_rule(n : drop_rule) : any;
        visitoptMacroName(n : optMacroName) : any;
        visitinclude_segment(n : include_segment) : any;
        visitkeywordSpecList(n : keywordSpecList) : any;
        visitkeywordSpec(n : keywordSpec) : any;
        visitnameSpecList(n : nameSpecList) : any;
        visitnameSpec(n : nameSpec) : any;
        visitrules_segment(n : rules_segment) : any;
        visitnonTermList(n : nonTermList) : any;
        visitnonTerm(n : nonTerm) : any;
        visitRuleName(n : RuleName) : any;
        visitruleList(n : ruleList) : any;
        visitrule(n : rule) : any;
        visitsymWithAttrsList(n : symWithAttrsList) : any;
        visitsymAttrs(n : symAttrs) : any;
        visitaction_segment(n : action_segment) : any;
        visitstart_symbolList(n : start_symbolList) : any;
        visitterminals_segment_terminalList(n : terminals_segment_terminalList) : any;
        visitterminalList(n : terminalList) : any;
        visitterminal(n : terminal) : any;
        visitoptTerminalAlias(n : optTerminalAlias) : any;
        visittype_declarationsList(n : type_declarationsList) : any;
        visittype_declarations(n : type_declarations) : any;
        visitsymbol_pairList(n : symbol_pairList) : any;
        visitsymbol_pair(n : symbol_pair) : any;
        visitrecover_symbol(n : recover_symbol) : any;
        visitEND_KEY_OPT(n : END_KEY_OPT) : any;
        visitoption_value0(n : option_value0) : any;
        visitoption_value1(n : option_value1) : any;
        visitaliasSpec0(n : aliasSpec0) : any;
        visitaliasSpec1(n : aliasSpec1) : any;
        visitaliasSpec2(n : aliasSpec2) : any;
        visitaliasSpec3(n : aliasSpec3) : any;
        visitaliasSpec4(n : aliasSpec4) : any;
        visitaliasSpec5(n : aliasSpec5) : any;
        visitalias_rhs0(n : alias_rhs0) : any;
        visitalias_rhs1(n : alias_rhs1) : any;
        visitalias_rhs2(n : alias_rhs2) : any;
        visitalias_rhs3(n : alias_rhs3) : any;
        visitalias_rhs4(n : alias_rhs4) : any;
        visitalias_rhs5(n : alias_rhs5) : any;
        visitalias_rhs6(n : alias_rhs6) : any;
        visitmacro_name_symbol0(n : macro_name_symbol0) : any;
        visitmacro_name_symbol1(n : macro_name_symbol1) : any;
        visitdrop_command0(n : drop_command0) : any;
        visitdrop_command1(n : drop_command1) : any;
        visitname0(n : name0) : any;
        visitname1(n : name1) : any;
        visitname2(n : name2) : any;
        visitname3(n : name3) : any;
        visitname4(n : name4) : any;
        visitname5(n : name5) : any;
        visitproduces0(n : produces0) : any;
        visitproduces1(n : produces1) : any;
        visitproduces2(n : produces2) : any;
        visitproduces3(n : produces3) : any;
        visitsymWithAttrs0(n : symWithAttrs0) : any;
        visitsymWithAttrs1(n : symWithAttrs1) : any;
        visitstart_symbol0(n : start_symbol0) : any;
        visitstart_symbol1(n : start_symbol1) : any;
        visitterminal_symbol0(n : terminal_symbol0) : any;
        visitterminal_symbol1(n : terminal_symbol1) : any;

        visit(n : ASTNode) : any;
    }
    export interface ResultArgumentVisitor
    {
        visitASTNodeToken(n : ASTNodeToken, o : any) : any;
        visitLPG(n : LPG, o : any) : any;
        visitLPG_itemList(n : LPG_itemList, o : any) : any;
        visitAliasSeg(n : AliasSeg, o : any) : any;
        visitAstSeg(n : AstSeg, o : any) : any;
        visitDefineSeg(n : DefineSeg, o : any) : any;
        visitEofSeg(n : EofSeg, o : any) : any;
        visitEolSeg(n : EolSeg, o : any) : any;
        visitErrorSeg(n : ErrorSeg, o : any) : any;
        visitExportSeg(n : ExportSeg, o : any) : any;
        visitGlobalsSeg(n : GlobalsSeg, o : any) : any;
        visitHeadersSeg(n : HeadersSeg, o : any) : any;
        visitIdentifierSeg(n : IdentifierSeg, o : any) : any;
        visitImportSeg(n : ImportSeg, o : any) : any;
        visitIncludeSeg(n : IncludeSeg, o : any) : any;
        visitKeywordsSeg(n : KeywordsSeg, o : any) : any;
        visitNamesSeg(n : NamesSeg, o : any) : any;
        visitNoticeSeg(n : NoticeSeg, o : any) : any;
        visitRulesSeg(n : RulesSeg, o : any) : any;
        visitSoftKeywordsSeg(n : SoftKeywordsSeg, o : any) : any;
        visitStartSeg(n : StartSeg, o : any) : any;
        visitTerminalsSeg(n : TerminalsSeg, o : any) : any;
        visitTrailersSeg(n : TrailersSeg, o : any) : any;
        visitTypesSeg(n : TypesSeg, o : any) : any;
        visitRecoverSeg(n : RecoverSeg, o : any) : any;
        visitPredecessorSeg(n : PredecessorSeg, o : any) : any;
        visitoption_specList(n : option_specList, o : any) : any;
        visitoption_spec(n : option_spec, o : any) : any;
        visitoptionList(n : optionList, o : any) : any;
        visitoption(n : option, o : any) : any;
        visitSYMBOLList(n : SYMBOLList, o : any) : any;
        visitaliasSpecList(n : aliasSpecList, o : any) : any;
        visitalias_lhs_macro_name(n : alias_lhs_macro_name, o : any) : any;
        visitdefineSpecList(n : defineSpecList, o : any) : any;
        visitdefineSpec(n : defineSpec, o : any) : any;
        visitmacro_segment(n : macro_segment, o : any) : any;
        visitterminal_symbolList(n : terminal_symbolList, o : any) : any;
        visitaction_segmentList(n : action_segmentList, o : any) : any;
        visitimport_segment(n : import_segment, o : any) : any;
        visitdrop_commandList(n : drop_commandList, o : any) : any;
        visitdrop_ruleList(n : drop_ruleList, o : any) : any;
        visitdrop_rule(n : drop_rule, o : any) : any;
        visitoptMacroName(n : optMacroName, o : any) : any;
        visitinclude_segment(n : include_segment, o : any) : any;
        visitkeywordSpecList(n : keywordSpecList, o : any) : any;
        visitkeywordSpec(n : keywordSpec, o : any) : any;
        visitnameSpecList(n : nameSpecList, o : any) : any;
        visitnameSpec(n : nameSpec, o : any) : any;
        visitrules_segment(n : rules_segment, o : any) : any;
        visitnonTermList(n : nonTermList, o : any) : any;
        visitnonTerm(n : nonTerm, o : any) : any;
        visitRuleName(n : RuleName, o : any) : any;
        visitruleList(n : ruleList, o : any) : any;
        visitrule(n : rule, o : any) : any;
        visitsymWithAttrsList(n : symWithAttrsList, o : any) : any;
        visitsymAttrs(n : symAttrs, o : any) : any;
        visitaction_segment(n : action_segment, o : any) : any;
        visitstart_symbolList(n : start_symbolList, o : any) : any;
        visitterminals_segment_terminalList(n : terminals_segment_terminalList, o : any) : any;
        visitterminalList(n : terminalList, o : any) : any;
        visitterminal(n : terminal, o : any) : any;
        visitoptTerminalAlias(n : optTerminalAlias, o : any) : any;
        visittype_declarationsList(n : type_declarationsList, o : any) : any;
        visittype_declarations(n : type_declarations, o : any) : any;
        visitsymbol_pairList(n : symbol_pairList, o : any) : any;
        visitsymbol_pair(n : symbol_pair, o : any) : any;
        visitrecover_symbol(n : recover_symbol, o : any) : any;
        visitEND_KEY_OPT(n : END_KEY_OPT, o : any) : any;
        visitoption_value0(n : option_value0, o : any) : any;
        visitoption_value1(n : option_value1, o : any) : any;
        visitaliasSpec0(n : aliasSpec0, o : any) : any;
        visitaliasSpec1(n : aliasSpec1, o : any) : any;
        visitaliasSpec2(n : aliasSpec2, o : any) : any;
        visitaliasSpec3(n : aliasSpec3, o : any) : any;
        visitaliasSpec4(n : aliasSpec4, o : any) : any;
        visitaliasSpec5(n : aliasSpec5, o : any) : any;
        visitalias_rhs0(n : alias_rhs0, o : any) : any;
        visitalias_rhs1(n : alias_rhs1, o : any) : any;
        visitalias_rhs2(n : alias_rhs2, o : any) : any;
        visitalias_rhs3(n : alias_rhs3, o : any) : any;
        visitalias_rhs4(n : alias_rhs4, o : any) : any;
        visitalias_rhs5(n : alias_rhs5, o : any) : any;
        visitalias_rhs6(n : alias_rhs6, o : any) : any;
        visitmacro_name_symbol0(n : macro_name_symbol0, o : any) : any;
        visitmacro_name_symbol1(n : macro_name_symbol1, o : any) : any;
        visitdrop_command0(n : drop_command0, o : any) : any;
        visitdrop_command1(n : drop_command1, o : any) : any;
        visitname0(n : name0, o : any) : any;
        visitname1(n : name1, o : any) : any;
        visitname2(n : name2, o : any) : any;
        visitname3(n : name3, o : any) : any;
        visitname4(n : name4, o : any) : any;
        visitname5(n : name5, o : any) : any;
        visitproduces0(n : produces0, o : any) : any;
        visitproduces1(n : produces1, o : any) : any;
        visitproduces2(n : produces2, o : any) : any;
        visitproduces3(n : produces3, o : any) : any;
        visitsymWithAttrs0(n : symWithAttrs0, o : any) : any;
        visitsymWithAttrs1(n : symWithAttrs1, o : any) : any;
        visitstart_symbol0(n : start_symbol0, o : any) : any;
        visitstart_symbol1(n : start_symbol1, o : any) : any;
        visitterminal_symbol0(n : terminal_symbol0, o : any) : any;
        visitterminal_symbol1(n : terminal_symbol1, o : any) : any;

        visit(n : ASTNode, o : any) : any;
    }
    export abstract class AbstractVisitor implements Visitor, ArgumentVisitor
    {
        public abstract  unimplementedVisitor(s : string) : void;

        public  visitASTNodeToken(n : ASTNodeToken, o? : any) : void { this.unimplementedVisitor("visitASTNodeToken(ASTNodeToken, any)"); }

        public  visitLPG(n : LPG, o? : any) : void { this.unimplementedVisitor("visitLPG(LPG, any)"); }

        public  visitLPG_itemList(n : LPG_itemList, o? : any) : void { this.unimplementedVisitor("visitLPG_itemList(LPG_itemList, any)"); }

        public  visitAliasSeg(n : AliasSeg, o? : any) : void { this.unimplementedVisitor("visitAliasSeg(AliasSeg, any)"); }

        public  visitAstSeg(n : AstSeg, o? : any) : void { this.unimplementedVisitor("visitAstSeg(AstSeg, any)"); }

        public  visitDefineSeg(n : DefineSeg, o? : any) : void { this.unimplementedVisitor("visitDefineSeg(DefineSeg, any)"); }

        public  visitEofSeg(n : EofSeg, o? : any) : void { this.unimplementedVisitor("visitEofSeg(EofSeg, any)"); }

        public  visitEolSeg(n : EolSeg, o? : any) : void { this.unimplementedVisitor("visitEolSeg(EolSeg, any)"); }

        public  visitErrorSeg(n : ErrorSeg, o? : any) : void { this.unimplementedVisitor("visitErrorSeg(ErrorSeg, any)"); }

        public  visitExportSeg(n : ExportSeg, o? : any) : void { this.unimplementedVisitor("visitExportSeg(ExportSeg, any)"); }

        public  visitGlobalsSeg(n : GlobalsSeg, o? : any) : void { this.unimplementedVisitor("visitGlobalsSeg(GlobalsSeg, any)"); }

        public  visitHeadersSeg(n : HeadersSeg, o? : any) : void { this.unimplementedVisitor("visitHeadersSeg(HeadersSeg, any)"); }

        public  visitIdentifierSeg(n : IdentifierSeg, o? : any) : void { this.unimplementedVisitor("visitIdentifierSeg(IdentifierSeg, any)"); }

        public  visitImportSeg(n : ImportSeg, o? : any) : void { this.unimplementedVisitor("visitImportSeg(ImportSeg, any)"); }

        public  visitIncludeSeg(n : IncludeSeg, o? : any) : void { this.unimplementedVisitor("visitIncludeSeg(IncludeSeg, any)"); }

        public  visitKeywordsSeg(n : KeywordsSeg, o? : any) : void { this.unimplementedVisitor("visitKeywordsSeg(KeywordsSeg, any)"); }

        public  visitNamesSeg(n : NamesSeg, o? : any) : void { this.unimplementedVisitor("visitNamesSeg(NamesSeg, any)"); }

        public  visitNoticeSeg(n : NoticeSeg, o? : any) : void { this.unimplementedVisitor("visitNoticeSeg(NoticeSeg, any)"); }

        public  visitRulesSeg(n : RulesSeg, o? : any) : void { this.unimplementedVisitor("visitRulesSeg(RulesSeg, any)"); }

        public  visitSoftKeywordsSeg(n : SoftKeywordsSeg, o? : any) : void { this.unimplementedVisitor("visitSoftKeywordsSeg(SoftKeywordsSeg, any)"); }

        public  visitStartSeg(n : StartSeg, o? : any) : void { this.unimplementedVisitor("visitStartSeg(StartSeg, any)"); }

        public  visitTerminalsSeg(n : TerminalsSeg, o? : any) : void { this.unimplementedVisitor("visitTerminalsSeg(TerminalsSeg, any)"); }

        public  visitTrailersSeg(n : TrailersSeg, o? : any) : void { this.unimplementedVisitor("visitTrailersSeg(TrailersSeg, any)"); }

        public  visitTypesSeg(n : TypesSeg, o? : any) : void { this.unimplementedVisitor("visitTypesSeg(TypesSeg, any)"); }

        public  visitRecoverSeg(n : RecoverSeg, o? : any) : void { this.unimplementedVisitor("visitRecoverSeg(RecoverSeg, any)"); }

        public  visitPredecessorSeg(n : PredecessorSeg, o? : any) : void { this.unimplementedVisitor("visitPredecessorSeg(PredecessorSeg, any)"); }

        public  visitoption_specList(n : option_specList, o? : any) : void { this.unimplementedVisitor("visitoption_specList(option_specList, any)"); }

        public  visitoption_spec(n : option_spec, o? : any) : void { this.unimplementedVisitor("visitoption_spec(option_spec, any)"); }

        public  visitoptionList(n : optionList, o? : any) : void { this.unimplementedVisitor("visitoptionList(optionList, any)"); }

        public  visitoption(n : option, o? : any) : void { this.unimplementedVisitor("visitoption(option, any)"); }

        public  visitSYMBOLList(n : SYMBOLList, o? : any) : void { this.unimplementedVisitor("visitSYMBOLList(SYMBOLList, any)"); }

        public  visitaliasSpecList(n : aliasSpecList, o? : any) : void { this.unimplementedVisitor("visitaliasSpecList(aliasSpecList, any)"); }

        public  visitalias_lhs_macro_name(n : alias_lhs_macro_name, o? : any) : void { this.unimplementedVisitor("visitalias_lhs_macro_name(alias_lhs_macro_name, any)"); }

        public  visitdefineSpecList(n : defineSpecList, o? : any) : void { this.unimplementedVisitor("visitdefineSpecList(defineSpecList, any)"); }

        public  visitdefineSpec(n : defineSpec, o? : any) : void { this.unimplementedVisitor("visitdefineSpec(defineSpec, any)"); }

        public  visitmacro_segment(n : macro_segment, o? : any) : void { this.unimplementedVisitor("visitmacro_segment(macro_segment, any)"); }

        public  visitterminal_symbolList(n : terminal_symbolList, o? : any) : void { this.unimplementedVisitor("visitterminal_symbolList(terminal_symbolList, any)"); }

        public  visitaction_segmentList(n : action_segmentList, o? : any) : void { this.unimplementedVisitor("visitaction_segmentList(action_segmentList, any)"); }

        public  visitimport_segment(n : import_segment, o? : any) : void { this.unimplementedVisitor("visitimport_segment(import_segment, any)"); }

        public  visitdrop_commandList(n : drop_commandList, o? : any) : void { this.unimplementedVisitor("visitdrop_commandList(drop_commandList, any)"); }

        public  visitdrop_ruleList(n : drop_ruleList, o? : any) : void { this.unimplementedVisitor("visitdrop_ruleList(drop_ruleList, any)"); }

        public  visitdrop_rule(n : drop_rule, o? : any) : void { this.unimplementedVisitor("visitdrop_rule(drop_rule, any)"); }

        public  visitoptMacroName(n : optMacroName, o? : any) : void { this.unimplementedVisitor("visitoptMacroName(optMacroName, any)"); }

        public  visitinclude_segment(n : include_segment, o? : any) : void { this.unimplementedVisitor("visitinclude_segment(include_segment, any)"); }

        public  visitkeywordSpecList(n : keywordSpecList, o? : any) : void { this.unimplementedVisitor("visitkeywordSpecList(keywordSpecList, any)"); }

        public  visitkeywordSpec(n : keywordSpec, o? : any) : void { this.unimplementedVisitor("visitkeywordSpec(keywordSpec, any)"); }

        public  visitnameSpecList(n : nameSpecList, o? : any) : void { this.unimplementedVisitor("visitnameSpecList(nameSpecList, any)"); }

        public  visitnameSpec(n : nameSpec, o? : any) : void { this.unimplementedVisitor("visitnameSpec(nameSpec, any)"); }

        public  visitrules_segment(n : rules_segment, o? : any) : void { this.unimplementedVisitor("visitrules_segment(rules_segment, any)"); }

        public  visitnonTermList(n : nonTermList, o? : any) : void { this.unimplementedVisitor("visitnonTermList(nonTermList, any)"); }

        public  visitnonTerm(n : nonTerm, o? : any) : void { this.unimplementedVisitor("visitnonTerm(nonTerm, any)"); }

        public  visitRuleName(n : RuleName, o? : any) : void { this.unimplementedVisitor("visitRuleName(RuleName, any)"); }

        public  visitruleList(n : ruleList, o? : any) : void { this.unimplementedVisitor("visitruleList(ruleList, any)"); }

        public  visitrule(n : rule, o? : any) : void { this.unimplementedVisitor("visitrule(rule, any)"); }

        public  visitsymWithAttrsList(n : symWithAttrsList, o? : any) : void { this.unimplementedVisitor("visitsymWithAttrsList(symWithAttrsList, any)"); }

        public  visitsymAttrs(n : symAttrs, o? : any) : void { this.unimplementedVisitor("visitsymAttrs(symAttrs, any)"); }

        public  visitaction_segment(n : action_segment, o? : any) : void { this.unimplementedVisitor("visitaction_segment(action_segment, any)"); }

        public  visitstart_symbolList(n : start_symbolList, o? : any) : void { this.unimplementedVisitor("visitstart_symbolList(start_symbolList, any)"); }

        public  visitterminals_segment_terminalList(n : terminals_segment_terminalList, o? : any) : void { this.unimplementedVisitor("visitterminals_segment_terminalList(terminals_segment_terminalList, any)"); }

        public  visitterminalList(n : terminalList, o? : any) : void { this.unimplementedVisitor("visitterminalList(terminalList, any)"); }

        public  visitterminal(n : terminal, o? : any) : void { this.unimplementedVisitor("visitterminal(terminal, any)"); }

        public  visitoptTerminalAlias(n : optTerminalAlias, o? : any) : void { this.unimplementedVisitor("visitoptTerminalAlias(optTerminalAlias, any)"); }

        public  visittype_declarationsList(n : type_declarationsList, o? : any) : void { this.unimplementedVisitor("visittype_declarationsList(type_declarationsList, any)"); }

        public  visittype_declarations(n : type_declarations, o? : any) : void { this.unimplementedVisitor("visittype_declarations(type_declarations, any)"); }

        public  visitsymbol_pairList(n : symbol_pairList, o? : any) : void { this.unimplementedVisitor("visitsymbol_pairList(symbol_pairList, any)"); }

        public  visitsymbol_pair(n : symbol_pair, o? : any) : void { this.unimplementedVisitor("visitsymbol_pair(symbol_pair, any)"); }

        public  visitrecover_symbol(n : recover_symbol, o? : any) : void { this.unimplementedVisitor("visitrecover_symbol(recover_symbol, any)"); }

        public  visitEND_KEY_OPT(n : END_KEY_OPT, o? : any) : void { this.unimplementedVisitor("visitEND_KEY_OPT(END_KEY_OPT, any)"); }

        public  visitoption_value0(n : option_value0, o? : any) : void { this.unimplementedVisitor("visitoption_value0(option_value0, any)"); }

        public  visitoption_value1(n : option_value1, o? : any) : void { this.unimplementedVisitor("visitoption_value1(option_value1, any)"); }

        public  visitaliasSpec0(n : aliasSpec0, o? : any) : void { this.unimplementedVisitor("visitaliasSpec0(aliasSpec0, any)"); }

        public  visitaliasSpec1(n : aliasSpec1, o? : any) : void { this.unimplementedVisitor("visitaliasSpec1(aliasSpec1, any)"); }

        public  visitaliasSpec2(n : aliasSpec2, o? : any) : void { this.unimplementedVisitor("visitaliasSpec2(aliasSpec2, any)"); }

        public  visitaliasSpec3(n : aliasSpec3, o? : any) : void { this.unimplementedVisitor("visitaliasSpec3(aliasSpec3, any)"); }

        public  visitaliasSpec4(n : aliasSpec4, o? : any) : void { this.unimplementedVisitor("visitaliasSpec4(aliasSpec4, any)"); }

        public  visitaliasSpec5(n : aliasSpec5, o? : any) : void { this.unimplementedVisitor("visitaliasSpec5(aliasSpec5, any)"); }

        public  visitalias_rhs0(n : alias_rhs0, o? : any) : void { this.unimplementedVisitor("visitalias_rhs0(alias_rhs0, any)"); }

        public  visitalias_rhs1(n : alias_rhs1, o? : any) : void { this.unimplementedVisitor("visitalias_rhs1(alias_rhs1, any)"); }

        public  visitalias_rhs2(n : alias_rhs2, o? : any) : void { this.unimplementedVisitor("visitalias_rhs2(alias_rhs2, any)"); }

        public  visitalias_rhs3(n : alias_rhs3, o? : any) : void { this.unimplementedVisitor("visitalias_rhs3(alias_rhs3, any)"); }

        public  visitalias_rhs4(n : alias_rhs4, o? : any) : void { this.unimplementedVisitor("visitalias_rhs4(alias_rhs4, any)"); }

        public  visitalias_rhs5(n : alias_rhs5, o? : any) : void { this.unimplementedVisitor("visitalias_rhs5(alias_rhs5, any)"); }

        public  visitalias_rhs6(n : alias_rhs6, o? : any) : void { this.unimplementedVisitor("visitalias_rhs6(alias_rhs6, any)"); }

        public  visitmacro_name_symbol0(n : macro_name_symbol0, o? : any) : void { this.unimplementedVisitor("visitmacro_name_symbol0(macro_name_symbol0, any)"); }

        public  visitmacro_name_symbol1(n : macro_name_symbol1, o? : any) : void { this.unimplementedVisitor("visitmacro_name_symbol1(macro_name_symbol1, any)"); }

        public  visitdrop_command0(n : drop_command0, o? : any) : void { this.unimplementedVisitor("visitdrop_command0(drop_command0, any)"); }

        public  visitdrop_command1(n : drop_command1, o? : any) : void { this.unimplementedVisitor("visitdrop_command1(drop_command1, any)"); }

        public  visitname0(n : name0, o? : any) : void { this.unimplementedVisitor("visitname0(name0, any)"); }

        public  visitname1(n : name1, o? : any) : void { this.unimplementedVisitor("visitname1(name1, any)"); }

        public  visitname2(n : name2, o? : any) : void { this.unimplementedVisitor("visitname2(name2, any)"); }

        public  visitname3(n : name3, o? : any) : void { this.unimplementedVisitor("visitname3(name3, any)"); }

        public  visitname4(n : name4, o? : any) : void { this.unimplementedVisitor("visitname4(name4, any)"); }

        public  visitname5(n : name5, o? : any) : void { this.unimplementedVisitor("visitname5(name5, any)"); }

        public  visitproduces0(n : produces0, o? : any) : void { this.unimplementedVisitor("visitproduces0(produces0, any)"); }

        public  visitproduces1(n : produces1, o? : any) : void { this.unimplementedVisitor("visitproduces1(produces1, any)"); }

        public  visitproduces2(n : produces2, o? : any) : void { this.unimplementedVisitor("visitproduces2(produces2, any)"); }

        public  visitproduces3(n : produces3, o? : any) : void { this.unimplementedVisitor("visitproduces3(produces3, any)"); }

        public  visitsymWithAttrs0(n : symWithAttrs0, o? : any) : void { this.unimplementedVisitor("visitsymWithAttrs0(symWithAttrs0, any)"); }

        public  visitsymWithAttrs1(n : symWithAttrs1, o? : any) : void { this.unimplementedVisitor("visitsymWithAttrs1(symWithAttrs1, any)"); }

        public  visitstart_symbol0(n : start_symbol0, o? : any) : void { this.unimplementedVisitor("visitstart_symbol0(start_symbol0, any)"); }

        public  visitstart_symbol1(n : start_symbol1, o? : any) : void { this.unimplementedVisitor("visitstart_symbol1(start_symbol1, any)"); }

        public  visitterminal_symbol0(n : terminal_symbol0, o? : any) : void { this.unimplementedVisitor("visitterminal_symbol0(terminal_symbol0, any)"); }

        public  visitterminal_symbol1(n : terminal_symbol1, o? : any) : void { this.unimplementedVisitor("visitterminal_symbol1(terminal_symbol1, any)"); }


        public  visit(n : ASTNode, o? : any) : void
        {
            if (n instanceof ASTNodeToken) this.visitASTNodeToken(<ASTNodeToken> n, o);
            else if (n instanceof LPG) this.visitLPG(<LPG> n, o);
            else if (n instanceof LPG_itemList) this.visitLPG_itemList(<LPG_itemList> n, o);
            else if (n instanceof AliasSeg) this.visitAliasSeg(<AliasSeg> n, o);
            else if (n instanceof AstSeg) this.visitAstSeg(<AstSeg> n, o);
            else if (n instanceof DefineSeg) this.visitDefineSeg(<DefineSeg> n, o);
            else if (n instanceof EofSeg) this.visitEofSeg(<EofSeg> n, o);
            else if (n instanceof EolSeg) this.visitEolSeg(<EolSeg> n, o);
            else if (n instanceof ErrorSeg) this.visitErrorSeg(<ErrorSeg> n, o);
            else if (n instanceof ExportSeg) this.visitExportSeg(<ExportSeg> n, o);
            else if (n instanceof GlobalsSeg) this.visitGlobalsSeg(<GlobalsSeg> n, o);
            else if (n instanceof HeadersSeg) this.visitHeadersSeg(<HeadersSeg> n, o);
            else if (n instanceof IdentifierSeg) this.visitIdentifierSeg(<IdentifierSeg> n, o);
            else if (n instanceof ImportSeg) this.visitImportSeg(<ImportSeg> n, o);
            else if (n instanceof IncludeSeg) this.visitIncludeSeg(<IncludeSeg> n, o);
            else if (n instanceof KeywordsSeg) this.visitKeywordsSeg(<KeywordsSeg> n, o);
            else if (n instanceof NamesSeg) this.visitNamesSeg(<NamesSeg> n, o);
            else if (n instanceof NoticeSeg) this.visitNoticeSeg(<NoticeSeg> n, o);
            else if (n instanceof RulesSeg) this.visitRulesSeg(<RulesSeg> n, o);
            else if (n instanceof SoftKeywordsSeg) this.visitSoftKeywordsSeg(<SoftKeywordsSeg> n, o);
            else if (n instanceof StartSeg) this.visitStartSeg(<StartSeg> n, o);
            else if (n instanceof TerminalsSeg) this.visitTerminalsSeg(<TerminalsSeg> n, o);
            else if (n instanceof TrailersSeg) this.visitTrailersSeg(<TrailersSeg> n, o);
            else if (n instanceof TypesSeg) this.visitTypesSeg(<TypesSeg> n, o);
            else if (n instanceof RecoverSeg) this.visitRecoverSeg(<RecoverSeg> n, o);
            else if (n instanceof PredecessorSeg) this.visitPredecessorSeg(<PredecessorSeg> n, o);
            else if (n instanceof option_specList) this.visitoption_specList(<option_specList> n, o);
            else if (n instanceof option_spec) this.visitoption_spec(<option_spec> n, o);
            else if (n instanceof optionList) this.visitoptionList(<optionList> n, o);
            else if (n instanceof option) this.visitoption(<option> n, o);
            else if (n instanceof SYMBOLList) this.visitSYMBOLList(<SYMBOLList> n, o);
            else if (n instanceof aliasSpecList) this.visitaliasSpecList(<aliasSpecList> n, o);
            else if (n instanceof alias_lhs_macro_name) this.visitalias_lhs_macro_name(<alias_lhs_macro_name> n, o);
            else if (n instanceof defineSpecList) this.visitdefineSpecList(<defineSpecList> n, o);
            else if (n instanceof defineSpec) this.visitdefineSpec(<defineSpec> n, o);
            else if (n instanceof macro_segment) this.visitmacro_segment(<macro_segment> n, o);
            else if (n instanceof terminal_symbolList) this.visitterminal_symbolList(<terminal_symbolList> n, o);
            else if (n instanceof action_segmentList) this.visitaction_segmentList(<action_segmentList> n, o);
            else if (n instanceof import_segment) this.visitimport_segment(<import_segment> n, o);
            else if (n instanceof drop_commandList) this.visitdrop_commandList(<drop_commandList> n, o);
            else if (n instanceof drop_ruleList) this.visitdrop_ruleList(<drop_ruleList> n, o);
            else if (n instanceof drop_rule) this.visitdrop_rule(<drop_rule> n, o);
            else if (n instanceof optMacroName) this.visitoptMacroName(<optMacroName> n, o);
            else if (n instanceof include_segment) this.visitinclude_segment(<include_segment> n, o);
            else if (n instanceof keywordSpecList) this.visitkeywordSpecList(<keywordSpecList> n, o);
            else if (n instanceof keywordSpec) this.visitkeywordSpec(<keywordSpec> n, o);
            else if (n instanceof nameSpecList) this.visitnameSpecList(<nameSpecList> n, o);
            else if (n instanceof nameSpec) this.visitnameSpec(<nameSpec> n, o);
            else if (n instanceof rules_segment) this.visitrules_segment(<rules_segment> n, o);
            else if (n instanceof nonTermList) this.visitnonTermList(<nonTermList> n, o);
            else if (n instanceof nonTerm) this.visitnonTerm(<nonTerm> n, o);
            else if (n instanceof RuleName) this.visitRuleName(<RuleName> n, o);
            else if (n instanceof ruleList) this.visitruleList(<ruleList> n, o);
            else if (n instanceof rule) this.visitrule(<rule> n, o);
            else if (n instanceof symWithAttrsList) this.visitsymWithAttrsList(<symWithAttrsList> n, o);
            else if (n instanceof symAttrs) this.visitsymAttrs(<symAttrs> n, o);
            else if (n instanceof action_segment) this.visitaction_segment(<action_segment> n, o);
            else if (n instanceof start_symbolList) this.visitstart_symbolList(<start_symbolList> n, o);
            else if (n instanceof terminals_segment_terminalList) this.visitterminals_segment_terminalList(<terminals_segment_terminalList> n, o);
            else if (n instanceof terminalList) this.visitterminalList(<terminalList> n, o);
            else if (n instanceof terminal) this.visitterminal(<terminal> n, o);
            else if (n instanceof optTerminalAlias) this.visitoptTerminalAlias(<optTerminalAlias> n, o);
            else if (n instanceof type_declarationsList) this.visittype_declarationsList(<type_declarationsList> n, o);
            else if (n instanceof type_declarations) this.visittype_declarations(<type_declarations> n, o);
            else if (n instanceof symbol_pairList) this.visitsymbol_pairList(<symbol_pairList> n, o);
            else if (n instanceof symbol_pair) this.visitsymbol_pair(<symbol_pair> n, o);
            else if (n instanceof recover_symbol) this.visitrecover_symbol(<recover_symbol> n, o);
            else if (n instanceof END_KEY_OPT) this.visitEND_KEY_OPT(<END_KEY_OPT> n, o);
            else if (n instanceof option_value0) this.visitoption_value0(<option_value0> n, o);
            else if (n instanceof option_value1) this.visitoption_value1(<option_value1> n, o);
            else if (n instanceof aliasSpec0) this.visitaliasSpec0(<aliasSpec0> n, o);
            else if (n instanceof aliasSpec1) this.visitaliasSpec1(<aliasSpec1> n, o);
            else if (n instanceof aliasSpec2) this.visitaliasSpec2(<aliasSpec2> n, o);
            else if (n instanceof aliasSpec3) this.visitaliasSpec3(<aliasSpec3> n, o);
            else if (n instanceof aliasSpec4) this.visitaliasSpec4(<aliasSpec4> n, o);
            else if (n instanceof aliasSpec5) this.visitaliasSpec5(<aliasSpec5> n, o);
            else if (n instanceof alias_rhs0) this.visitalias_rhs0(<alias_rhs0> n, o);
            else if (n instanceof alias_rhs1) this.visitalias_rhs1(<alias_rhs1> n, o);
            else if (n instanceof alias_rhs2) this.visitalias_rhs2(<alias_rhs2> n, o);
            else if (n instanceof alias_rhs3) this.visitalias_rhs3(<alias_rhs3> n, o);
            else if (n instanceof alias_rhs4) this.visitalias_rhs4(<alias_rhs4> n, o);
            else if (n instanceof alias_rhs5) this.visitalias_rhs5(<alias_rhs5> n, o);
            else if (n instanceof alias_rhs6) this.visitalias_rhs6(<alias_rhs6> n, o);
            else if (n instanceof macro_name_symbol0) this.visitmacro_name_symbol0(<macro_name_symbol0> n, o);
            else if (n instanceof macro_name_symbol1) this.visitmacro_name_symbol1(<macro_name_symbol1> n, o);
            else if (n instanceof drop_command0) this.visitdrop_command0(<drop_command0> n, o);
            else if (n instanceof drop_command1) this.visitdrop_command1(<drop_command1> n, o);
            else if (n instanceof name0) this.visitname0(<name0> n, o);
            else if (n instanceof name1) this.visitname1(<name1> n, o);
            else if (n instanceof name2) this.visitname2(<name2> n, o);
            else if (n instanceof name3) this.visitname3(<name3> n, o);
            else if (n instanceof name4) this.visitname4(<name4> n, o);
            else if (n instanceof name5) this.visitname5(<name5> n, o);
            else if (n instanceof produces0) this.visitproduces0(<produces0> n, o);
            else if (n instanceof produces1) this.visitproduces1(<produces1> n, o);
            else if (n instanceof produces2) this.visitproduces2(<produces2> n, o);
            else if (n instanceof produces3) this.visitproduces3(<produces3> n, o);
            else if (n instanceof symWithAttrs0) this.visitsymWithAttrs0(<symWithAttrs0> n, o);
            else if (n instanceof symWithAttrs1) this.visitsymWithAttrs1(<symWithAttrs1> n, o);
            else if (n instanceof start_symbol0) this.visitstart_symbol0(<start_symbol0> n, o);
            else if (n instanceof start_symbol1) this.visitstart_symbol1(<start_symbol1> n, o);
            else if (n instanceof terminal_symbol0) this.visitterminal_symbol0(<terminal_symbol0> n, o);
            else if (n instanceof terminal_symbol1) this.visitterminal_symbol1(<terminal_symbol1> n, o);
            throw new Error("visit(" + n.toString() + ")");
        }
    }
    export abstract class AbstractResultVisitor implements ResultVisitor, ResultArgumentVisitor
    {
        public abstract  unimplementedVisitor(s : string) : any;

        public visitASTNodeToken(n : ASTNodeToken, o? : any) : any{ return  this.unimplementedVisitor("visitASTNodeToken(ASTNodeToken, any)"); }

        public visitLPG(n : LPG, o? : any) : any{ return  this.unimplementedVisitor("visitLPG(LPG, any)"); }

        public visitLPG_itemList(n : LPG_itemList, o? : any) : any{ return  this.unimplementedVisitor("visitLPG_itemList(LPG_itemList, any)"); }

        public visitAliasSeg(n : AliasSeg, o? : any) : any{ return  this.unimplementedVisitor("visitAliasSeg(AliasSeg, any)"); }

        public visitAstSeg(n : AstSeg, o? : any) : any{ return  this.unimplementedVisitor("visitAstSeg(AstSeg, any)"); }

        public visitDefineSeg(n : DefineSeg, o? : any) : any{ return  this.unimplementedVisitor("visitDefineSeg(DefineSeg, any)"); }

        public visitEofSeg(n : EofSeg, o? : any) : any{ return  this.unimplementedVisitor("visitEofSeg(EofSeg, any)"); }

        public visitEolSeg(n : EolSeg, o? : any) : any{ return  this.unimplementedVisitor("visitEolSeg(EolSeg, any)"); }

        public visitErrorSeg(n : ErrorSeg, o? : any) : any{ return  this.unimplementedVisitor("visitErrorSeg(ErrorSeg, any)"); }

        public visitExportSeg(n : ExportSeg, o? : any) : any{ return  this.unimplementedVisitor("visitExportSeg(ExportSeg, any)"); }

        public visitGlobalsSeg(n : GlobalsSeg, o? : any) : any{ return  this.unimplementedVisitor("visitGlobalsSeg(GlobalsSeg, any)"); }

        public visitHeadersSeg(n : HeadersSeg, o? : any) : any{ return  this.unimplementedVisitor("visitHeadersSeg(HeadersSeg, any)"); }

        public visitIdentifierSeg(n : IdentifierSeg, o? : any) : any{ return  this.unimplementedVisitor("visitIdentifierSeg(IdentifierSeg, any)"); }

        public visitImportSeg(n : ImportSeg, o? : any) : any{ return  this.unimplementedVisitor("visitImportSeg(ImportSeg, any)"); }

        public visitIncludeSeg(n : IncludeSeg, o? : any) : any{ return  this.unimplementedVisitor("visitIncludeSeg(IncludeSeg, any)"); }

        public visitKeywordsSeg(n : KeywordsSeg, o? : any) : any{ return  this.unimplementedVisitor("visitKeywordsSeg(KeywordsSeg, any)"); }

        public visitNamesSeg(n : NamesSeg, o? : any) : any{ return  this.unimplementedVisitor("visitNamesSeg(NamesSeg, any)"); }

        public visitNoticeSeg(n : NoticeSeg, o? : any) : any{ return  this.unimplementedVisitor("visitNoticeSeg(NoticeSeg, any)"); }

        public visitRulesSeg(n : RulesSeg, o? : any) : any{ return  this.unimplementedVisitor("visitRulesSeg(RulesSeg, any)"); }

        public visitSoftKeywordsSeg(n : SoftKeywordsSeg, o? : any) : any{ return  this.unimplementedVisitor("visitSoftKeywordsSeg(SoftKeywordsSeg, any)"); }

        public visitStartSeg(n : StartSeg, o? : any) : any{ return  this.unimplementedVisitor("visitStartSeg(StartSeg, any)"); }

        public visitTerminalsSeg(n : TerminalsSeg, o? : any) : any{ return  this.unimplementedVisitor("visitTerminalsSeg(TerminalsSeg, any)"); }

        public visitTrailersSeg(n : TrailersSeg, o? : any) : any{ return  this.unimplementedVisitor("visitTrailersSeg(TrailersSeg, any)"); }

        public visitTypesSeg(n : TypesSeg, o? : any) : any{ return  this.unimplementedVisitor("visitTypesSeg(TypesSeg, any)"); }

        public visitRecoverSeg(n : RecoverSeg, o? : any) : any{ return  this.unimplementedVisitor("visitRecoverSeg(RecoverSeg, any)"); }

        public visitPredecessorSeg(n : PredecessorSeg, o? : any) : any{ return  this.unimplementedVisitor("visitPredecessorSeg(PredecessorSeg, any)"); }

        public visitoption_specList(n : option_specList, o? : any) : any{ return  this.unimplementedVisitor("visitoption_specList(option_specList, any)"); }

        public visitoption_spec(n : option_spec, o? : any) : any{ return  this.unimplementedVisitor("visitoption_spec(option_spec, any)"); }

        public visitoptionList(n : optionList, o? : any) : any{ return  this.unimplementedVisitor("visitoptionList(optionList, any)"); }

        public visitoption(n : option, o? : any) : any{ return  this.unimplementedVisitor("visitoption(option, any)"); }

        public visitSYMBOLList(n : SYMBOLList, o? : any) : any{ return  this.unimplementedVisitor("visitSYMBOLList(SYMBOLList, any)"); }

        public visitaliasSpecList(n : aliasSpecList, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpecList(aliasSpecList, any)"); }

        public visitalias_lhs_macro_name(n : alias_lhs_macro_name, o? : any) : any{ return  this.unimplementedVisitor("visitalias_lhs_macro_name(alias_lhs_macro_name, any)"); }

        public visitdefineSpecList(n : defineSpecList, o? : any) : any{ return  this.unimplementedVisitor("visitdefineSpecList(defineSpecList, any)"); }

        public visitdefineSpec(n : defineSpec, o? : any) : any{ return  this.unimplementedVisitor("visitdefineSpec(defineSpec, any)"); }

        public visitmacro_segment(n : macro_segment, o? : any) : any{ return  this.unimplementedVisitor("visitmacro_segment(macro_segment, any)"); }

        public visitterminal_symbolList(n : terminal_symbolList, o? : any) : any{ return  this.unimplementedVisitor("visitterminal_symbolList(terminal_symbolList, any)"); }

        public visitaction_segmentList(n : action_segmentList, o? : any) : any{ return  this.unimplementedVisitor("visitaction_segmentList(action_segmentList, any)"); }

        public visitimport_segment(n : import_segment, o? : any) : any{ return  this.unimplementedVisitor("visitimport_segment(import_segment, any)"); }

        public visitdrop_commandList(n : drop_commandList, o? : any) : any{ return  this.unimplementedVisitor("visitdrop_commandList(drop_commandList, any)"); }

        public visitdrop_ruleList(n : drop_ruleList, o? : any) : any{ return  this.unimplementedVisitor("visitdrop_ruleList(drop_ruleList, any)"); }

        public visitdrop_rule(n : drop_rule, o? : any) : any{ return  this.unimplementedVisitor("visitdrop_rule(drop_rule, any)"); }

        public visitoptMacroName(n : optMacroName, o? : any) : any{ return  this.unimplementedVisitor("visitoptMacroName(optMacroName, any)"); }

        public visitinclude_segment(n : include_segment, o? : any) : any{ return  this.unimplementedVisitor("visitinclude_segment(include_segment, any)"); }

        public visitkeywordSpecList(n : keywordSpecList, o? : any) : any{ return  this.unimplementedVisitor("visitkeywordSpecList(keywordSpecList, any)"); }

        public visitkeywordSpec(n : keywordSpec, o? : any) : any{ return  this.unimplementedVisitor("visitkeywordSpec(keywordSpec, any)"); }

        public visitnameSpecList(n : nameSpecList, o? : any) : any{ return  this.unimplementedVisitor("visitnameSpecList(nameSpecList, any)"); }

        public visitnameSpec(n : nameSpec, o? : any) : any{ return  this.unimplementedVisitor("visitnameSpec(nameSpec, any)"); }

        public visitrules_segment(n : rules_segment, o? : any) : any{ return  this.unimplementedVisitor("visitrules_segment(rules_segment, any)"); }

        public visitnonTermList(n : nonTermList, o? : any) : any{ return  this.unimplementedVisitor("visitnonTermList(nonTermList, any)"); }

        public visitnonTerm(n : nonTerm, o? : any) : any{ return  this.unimplementedVisitor("visitnonTerm(nonTerm, any)"); }

        public visitRuleName(n : RuleName, o? : any) : any{ return  this.unimplementedVisitor("visitRuleName(RuleName, any)"); }

        public visitruleList(n : ruleList, o? : any) : any{ return  this.unimplementedVisitor("visitruleList(ruleList, any)"); }

        public visitrule(n : rule, o? : any) : any{ return  this.unimplementedVisitor("visitrule(rule, any)"); }

        public visitsymWithAttrsList(n : symWithAttrsList, o? : any) : any{ return  this.unimplementedVisitor("visitsymWithAttrsList(symWithAttrsList, any)"); }

        public visitsymAttrs(n : symAttrs, o? : any) : any{ return  this.unimplementedVisitor("visitsymAttrs(symAttrs, any)"); }

        public visitaction_segment(n : action_segment, o? : any) : any{ return  this.unimplementedVisitor("visitaction_segment(action_segment, any)"); }

        public visitstart_symbolList(n : start_symbolList, o? : any) : any{ return  this.unimplementedVisitor("visitstart_symbolList(start_symbolList, any)"); }

        public visitterminals_segment_terminalList(n : terminals_segment_terminalList, o? : any) : any{ return  this.unimplementedVisitor("visitterminals_segment_terminalList(terminals_segment_terminalList, any)"); }

        public visitterminalList(n : terminalList, o? : any) : any{ return  this.unimplementedVisitor("visitterminalList(terminalList, any)"); }

        public visitterminal(n : terminal, o? : any) : any{ return  this.unimplementedVisitor("visitterminal(terminal, any)"); }

        public visitoptTerminalAlias(n : optTerminalAlias, o? : any) : any{ return  this.unimplementedVisitor("visitoptTerminalAlias(optTerminalAlias, any)"); }

        public visittype_declarationsList(n : type_declarationsList, o? : any) : any{ return  this.unimplementedVisitor("visittype_declarationsList(type_declarationsList, any)"); }

        public visittype_declarations(n : type_declarations, o? : any) : any{ return  this.unimplementedVisitor("visittype_declarations(type_declarations, any)"); }

        public visitsymbol_pairList(n : symbol_pairList, o? : any) : any{ return  this.unimplementedVisitor("visitsymbol_pairList(symbol_pairList, any)"); }

        public visitsymbol_pair(n : symbol_pair, o? : any) : any{ return  this.unimplementedVisitor("visitsymbol_pair(symbol_pair, any)"); }

        public visitrecover_symbol(n : recover_symbol, o? : any) : any{ return  this.unimplementedVisitor("visitrecover_symbol(recover_symbol, any)"); }

        public visitEND_KEY_OPT(n : END_KEY_OPT, o? : any) : any{ return  this.unimplementedVisitor("visitEND_KEY_OPT(END_KEY_OPT, any)"); }

        public visitoption_value0(n : option_value0, o? : any) : any{ return  this.unimplementedVisitor("visitoption_value0(option_value0, any)"); }

        public visitoption_value1(n : option_value1, o? : any) : any{ return  this.unimplementedVisitor("visitoption_value1(option_value1, any)"); }

        public visitaliasSpec0(n : aliasSpec0, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec0(aliasSpec0, any)"); }

        public visitaliasSpec1(n : aliasSpec1, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec1(aliasSpec1, any)"); }

        public visitaliasSpec2(n : aliasSpec2, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec2(aliasSpec2, any)"); }

        public visitaliasSpec3(n : aliasSpec3, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec3(aliasSpec3, any)"); }

        public visitaliasSpec4(n : aliasSpec4, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec4(aliasSpec4, any)"); }

        public visitaliasSpec5(n : aliasSpec5, o? : any) : any{ return  this.unimplementedVisitor("visitaliasSpec5(aliasSpec5, any)"); }

        public visitalias_rhs0(n : alias_rhs0, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs0(alias_rhs0, any)"); }

        public visitalias_rhs1(n : alias_rhs1, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs1(alias_rhs1, any)"); }

        public visitalias_rhs2(n : alias_rhs2, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs2(alias_rhs2, any)"); }

        public visitalias_rhs3(n : alias_rhs3, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs3(alias_rhs3, any)"); }

        public visitalias_rhs4(n : alias_rhs4, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs4(alias_rhs4, any)"); }

        public visitalias_rhs5(n : alias_rhs5, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs5(alias_rhs5, any)"); }

        public visitalias_rhs6(n : alias_rhs6, o? : any) : any{ return  this.unimplementedVisitor("visitalias_rhs6(alias_rhs6, any)"); }

        public visitmacro_name_symbol0(n : macro_name_symbol0, o? : any) : any{ return  this.unimplementedVisitor("visitmacro_name_symbol0(macro_name_symbol0, any)"); }

        public visitmacro_name_symbol1(n : macro_name_symbol1, o? : any) : any{ return  this.unimplementedVisitor("visitmacro_name_symbol1(macro_name_symbol1, any)"); }

        public visitdrop_command0(n : drop_command0, o? : any) : any{ return  this.unimplementedVisitor("visitdrop_command0(drop_command0, any)"); }

        public visitdrop_command1(n : drop_command1, o? : any) : any{ return  this.unimplementedVisitor("visitdrop_command1(drop_command1, any)"); }

        public visitname0(n : name0, o? : any) : any{ return  this.unimplementedVisitor("visitname0(name0, any)"); }

        public visitname1(n : name1, o? : any) : any{ return  this.unimplementedVisitor("visitname1(name1, any)"); }

        public visitname2(n : name2, o? : any) : any{ return  this.unimplementedVisitor("visitname2(name2, any)"); }

        public visitname3(n : name3, o? : any) : any{ return  this.unimplementedVisitor("visitname3(name3, any)"); }

        public visitname4(n : name4, o? : any) : any{ return  this.unimplementedVisitor("visitname4(name4, any)"); }

        public visitname5(n : name5, o? : any) : any{ return  this.unimplementedVisitor("visitname5(name5, any)"); }

        public visitproduces0(n : produces0, o? : any) : any{ return  this.unimplementedVisitor("visitproduces0(produces0, any)"); }

        public visitproduces1(n : produces1, o? : any) : any{ return  this.unimplementedVisitor("visitproduces1(produces1, any)"); }

        public visitproduces2(n : produces2, o? : any) : any{ return  this.unimplementedVisitor("visitproduces2(produces2, any)"); }

        public visitproduces3(n : produces3, o? : any) : any{ return  this.unimplementedVisitor("visitproduces3(produces3, any)"); }

        public visitsymWithAttrs0(n : symWithAttrs0, o? : any) : any{ return  this.unimplementedVisitor("visitsymWithAttrs0(symWithAttrs0, any)"); }

        public visitsymWithAttrs1(n : symWithAttrs1, o? : any) : any{ return  this.unimplementedVisitor("visitsymWithAttrs1(symWithAttrs1, any)"); }

        public visitstart_symbol0(n : start_symbol0, o? : any) : any{ return  this.unimplementedVisitor("visitstart_symbol0(start_symbol0, any)"); }

        public visitstart_symbol1(n : start_symbol1, o? : any) : any{ return  this.unimplementedVisitor("visitstart_symbol1(start_symbol1, any)"); }

        public visitterminal_symbol0(n : terminal_symbol0, o? : any) : any{ return  this.unimplementedVisitor("visitterminal_symbol0(terminal_symbol0, any)"); }

        public visitterminal_symbol1(n : terminal_symbol1, o? : any) : any{ return  this.unimplementedVisitor("visitterminal_symbol1(terminal_symbol1, any)"); }


        public visit(n : ASTNode, o? : any) : any
        {
            if (n instanceof ASTNodeToken) return this.visitASTNodeToken(<ASTNodeToken> n, o);
            else if (n instanceof LPG) return this.visitLPG(<LPG> n, o);
            else if (n instanceof LPG_itemList) return this.visitLPG_itemList(<LPG_itemList> n, o);
            else if (n instanceof AliasSeg) return this.visitAliasSeg(<AliasSeg> n, o);
            else if (n instanceof AstSeg) return this.visitAstSeg(<AstSeg> n, o);
            else if (n instanceof DefineSeg) return this.visitDefineSeg(<DefineSeg> n, o);
            else if (n instanceof EofSeg) return this.visitEofSeg(<EofSeg> n, o);
            else if (n instanceof EolSeg) return this.visitEolSeg(<EolSeg> n, o);
            else if (n instanceof ErrorSeg) return this.visitErrorSeg(<ErrorSeg> n, o);
            else if (n instanceof ExportSeg) return this.visitExportSeg(<ExportSeg> n, o);
            else if (n instanceof GlobalsSeg) return this.visitGlobalsSeg(<GlobalsSeg> n, o);
            else if (n instanceof HeadersSeg) return this.visitHeadersSeg(<HeadersSeg> n, o);
            else if (n instanceof IdentifierSeg) return this.visitIdentifierSeg(<IdentifierSeg> n, o);
            else if (n instanceof ImportSeg) return this.visitImportSeg(<ImportSeg> n, o);
            else if (n instanceof IncludeSeg) return this.visitIncludeSeg(<IncludeSeg> n, o);
            else if (n instanceof KeywordsSeg) return this.visitKeywordsSeg(<KeywordsSeg> n, o);
            else if (n instanceof NamesSeg) return this.visitNamesSeg(<NamesSeg> n, o);
            else if (n instanceof NoticeSeg) return this.visitNoticeSeg(<NoticeSeg> n, o);
            else if (n instanceof RulesSeg) return this.visitRulesSeg(<RulesSeg> n, o);
            else if (n instanceof SoftKeywordsSeg) return this.visitSoftKeywordsSeg(<SoftKeywordsSeg> n, o);
            else if (n instanceof StartSeg) return this.visitStartSeg(<StartSeg> n, o);
            else if (n instanceof TerminalsSeg) return this.visitTerminalsSeg(<TerminalsSeg> n, o);
            else if (n instanceof TrailersSeg) return this.visitTrailersSeg(<TrailersSeg> n, o);
            else if (n instanceof TypesSeg) return this.visitTypesSeg(<TypesSeg> n, o);
            else if (n instanceof RecoverSeg) return this.visitRecoverSeg(<RecoverSeg> n, o);
            else if (n instanceof PredecessorSeg) return this.visitPredecessorSeg(<PredecessorSeg> n, o);
            else if (n instanceof option_specList) return this.visitoption_specList(<option_specList> n, o);
            else if (n instanceof option_spec) return this.visitoption_spec(<option_spec> n, o);
            else if (n instanceof optionList) return this.visitoptionList(<optionList> n, o);
            else if (n instanceof option) return this.visitoption(<option> n, o);
            else if (n instanceof SYMBOLList) return this.visitSYMBOLList(<SYMBOLList> n, o);
            else if (n instanceof aliasSpecList) return this.visitaliasSpecList(<aliasSpecList> n, o);
            else if (n instanceof alias_lhs_macro_name) return this.visitalias_lhs_macro_name(<alias_lhs_macro_name> n, o);
            else if (n instanceof defineSpecList) return this.visitdefineSpecList(<defineSpecList> n, o);
            else if (n instanceof defineSpec) return this.visitdefineSpec(<defineSpec> n, o);
            else if (n instanceof macro_segment) return this.visitmacro_segment(<macro_segment> n, o);
            else if (n instanceof terminal_symbolList) return this.visitterminal_symbolList(<terminal_symbolList> n, o);
            else if (n instanceof action_segmentList) return this.visitaction_segmentList(<action_segmentList> n, o);
            else if (n instanceof import_segment) return this.visitimport_segment(<import_segment> n, o);
            else if (n instanceof drop_commandList) return this.visitdrop_commandList(<drop_commandList> n, o);
            else if (n instanceof drop_ruleList) return this.visitdrop_ruleList(<drop_ruleList> n, o);
            else if (n instanceof drop_rule) return this.visitdrop_rule(<drop_rule> n, o);
            else if (n instanceof optMacroName) return this.visitoptMacroName(<optMacroName> n, o);
            else if (n instanceof include_segment) return this.visitinclude_segment(<include_segment> n, o);
            else if (n instanceof keywordSpecList) return this.visitkeywordSpecList(<keywordSpecList> n, o);
            else if (n instanceof keywordSpec) return this.visitkeywordSpec(<keywordSpec> n, o);
            else if (n instanceof nameSpecList) return this.visitnameSpecList(<nameSpecList> n, o);
            else if (n instanceof nameSpec) return this.visitnameSpec(<nameSpec> n, o);
            else if (n instanceof rules_segment) return this.visitrules_segment(<rules_segment> n, o);
            else if (n instanceof nonTermList) return this.visitnonTermList(<nonTermList> n, o);
            else if (n instanceof nonTerm) return this.visitnonTerm(<nonTerm> n, o);
            else if (n instanceof RuleName) return this.visitRuleName(<RuleName> n, o);
            else if (n instanceof ruleList) return this.visitruleList(<ruleList> n, o);
            else if (n instanceof rule) return this.visitrule(<rule> n, o);
            else if (n instanceof symWithAttrsList) return this.visitsymWithAttrsList(<symWithAttrsList> n, o);
            else if (n instanceof symAttrs) return this.visitsymAttrs(<symAttrs> n, o);
            else if (n instanceof action_segment) return this.visitaction_segment(<action_segment> n, o);
            else if (n instanceof start_symbolList) return this.visitstart_symbolList(<start_symbolList> n, o);
            else if (n instanceof terminals_segment_terminalList) return this.visitterminals_segment_terminalList(<terminals_segment_terminalList> n, o);
            else if (n instanceof terminalList) return this.visitterminalList(<terminalList> n, o);
            else if (n instanceof terminal) return this.visitterminal(<terminal> n, o);
            else if (n instanceof optTerminalAlias) return this.visitoptTerminalAlias(<optTerminalAlias> n, o);
            else if (n instanceof type_declarationsList) return this.visittype_declarationsList(<type_declarationsList> n, o);
            else if (n instanceof type_declarations) return this.visittype_declarations(<type_declarations> n, o);
            else if (n instanceof symbol_pairList) return this.visitsymbol_pairList(<symbol_pairList> n, o);
            else if (n instanceof symbol_pair) return this.visitsymbol_pair(<symbol_pair> n, o);
            else if (n instanceof recover_symbol) return this.visitrecover_symbol(<recover_symbol> n, o);
            else if (n instanceof END_KEY_OPT) return this.visitEND_KEY_OPT(<END_KEY_OPT> n, o);
            else if (n instanceof option_value0) return this.visitoption_value0(<option_value0> n, o);
            else if (n instanceof option_value1) return this.visitoption_value1(<option_value1> n, o);
            else if (n instanceof aliasSpec0) return this.visitaliasSpec0(<aliasSpec0> n, o);
            else if (n instanceof aliasSpec1) return this.visitaliasSpec1(<aliasSpec1> n, o);
            else if (n instanceof aliasSpec2) return this.visitaliasSpec2(<aliasSpec2> n, o);
            else if (n instanceof aliasSpec3) return this.visitaliasSpec3(<aliasSpec3> n, o);
            else if (n instanceof aliasSpec4) return this.visitaliasSpec4(<aliasSpec4> n, o);
            else if (n instanceof aliasSpec5) return this.visitaliasSpec5(<aliasSpec5> n, o);
            else if (n instanceof alias_rhs0) return this.visitalias_rhs0(<alias_rhs0> n, o);
            else if (n instanceof alias_rhs1) return this.visitalias_rhs1(<alias_rhs1> n, o);
            else if (n instanceof alias_rhs2) return this.visitalias_rhs2(<alias_rhs2> n, o);
            else if (n instanceof alias_rhs3) return this.visitalias_rhs3(<alias_rhs3> n, o);
            else if (n instanceof alias_rhs4) return this.visitalias_rhs4(<alias_rhs4> n, o);
            else if (n instanceof alias_rhs5) return this.visitalias_rhs5(<alias_rhs5> n, o);
            else if (n instanceof alias_rhs6) return this.visitalias_rhs6(<alias_rhs6> n, o);
            else if (n instanceof macro_name_symbol0) return this.visitmacro_name_symbol0(<macro_name_symbol0> n, o);
            else if (n instanceof macro_name_symbol1) return this.visitmacro_name_symbol1(<macro_name_symbol1> n, o);
            else if (n instanceof drop_command0) return this.visitdrop_command0(<drop_command0> n, o);
            else if (n instanceof drop_command1) return this.visitdrop_command1(<drop_command1> n, o);
            else if (n instanceof name0) return this.visitname0(<name0> n, o);
            else if (n instanceof name1) return this.visitname1(<name1> n, o);
            else if (n instanceof name2) return this.visitname2(<name2> n, o);
            else if (n instanceof name3) return this.visitname3(<name3> n, o);
            else if (n instanceof name4) return this.visitname4(<name4> n, o);
            else if (n instanceof name5) return this.visitname5(<name5> n, o);
            else if (n instanceof produces0) return this.visitproduces0(<produces0> n, o);
            else if (n instanceof produces1) return this.visitproduces1(<produces1> n, o);
            else if (n instanceof produces2) return this.visitproduces2(<produces2> n, o);
            else if (n instanceof produces3) return this.visitproduces3(<produces3> n, o);
            else if (n instanceof symWithAttrs0) return this.visitsymWithAttrs0(<symWithAttrs0> n, o);
            else if (n instanceof symWithAttrs1) return this.visitsymWithAttrs1(<symWithAttrs1> n, o);
            else if (n instanceof start_symbol0) return this.visitstart_symbol0(<start_symbol0> n, o);
            else if (n instanceof start_symbol1) return this.visitstart_symbol1(<start_symbol1> n, o);
            else if (n instanceof terminal_symbol0) return this.visitterminal_symbol0(<terminal_symbol0> n, o);
            else if (n instanceof terminal_symbol1) return this.visitterminal_symbol1(<terminal_symbol1> n, o);
            throw new Error("visit(" + n.toString() + ")");
        }
    }

