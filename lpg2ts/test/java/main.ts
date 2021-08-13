import { JavaLexer } from "./JavaLexer";
import { JavaParser } from "./JavaParser";

function main() : void{

   
    let _lexer = new JavaLexer( "D:/workspace/New_Parser/lpg_java/src/test/test2.java" ); // Create the lexer
    let parser = new JavaParser(_lexer.getILexStream());
    _lexer.printTokens = true;
    _lexer.lexer(parser.getIPrsStream());
  
    let  ast = parser.parser();
    if(ast){
        console.log("成功");
    }
    else{
        console.log("失败");
    }
}
main();