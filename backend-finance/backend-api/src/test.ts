import { Tokenizer } from "./utils/tokenizer";
import { Lexer } from "./utils/lexer";
import { Parser } from "./ai/parser";
import { Resolver } from "./ai/resolver";
import { QueryBuilder } from "./ai/queryBuilder";

const tokenizer = new Tokenizer();
const lexer = new Lexer();
const parser = new Parser();
const resolver = new Resolver();
const builder = new QueryBuilder();

const question =
    "Je veux les 10 agences avec le plus de revenu en 2024";

const words = tokenizer.tokenize(question);

const tokens = lexer.lex(words);

const intent = parser.parse(tokens);

const resolved = resolver.resolve(intent);

const cubeQuery = builder.build(resolved);

console.log(JSON.stringify(cubeQuery, null, 2));