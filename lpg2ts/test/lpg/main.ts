import { LPGLexer } from "./LPGLexer";
import { LPGParser } from "./LPGParser";

function  main(): void{

    let _lexer = new LPGLexer("E:/LPG2/lpg2/src/jikespg.g"); // Create the lexer
   // let _lexer = new LPGLexer("E:/LPG2/tool/LPG-VScode/templates/templates/rt_cpp/LexerTemplateF.gi"); // Create the lexer
    let parser = new LPGParser(_lexer.getILexStream());
    _lexer.printTokens = true;
    _lexer.lexer(parser.getIPrsStream());
  
    let  ast = parser.parser(100000);
    if(ast){
        console.log("成功");
    }
    else{
        console.log("失败");
    }
}
main();