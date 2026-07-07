import { CatalogService } from "../services/catalog.service";
import { Token, TokenType } from "./../types/types";

export class Lexer {

    constructor(
        private catalog = new CatalogService()
    ) {}

    lex(words: string[]): Token[] {

        const tokens: Token[] = [];

        for (const word of words) {

            if (/^\d{4}$/.test(word)) {

                tokens.push({

                    type: TokenType.YEAR,

                    value: word

                });

                continue;

            }

            if (/^\d+$/.test(word)) {

                tokens.push({

                    type: TokenType.NUMBER,

                    value: word

                });

                continue;

            }

            const measure = this.catalog.findMeasure(word);

            if (measure) {

                tokens.push({

                    type: TokenType.MEASURE,

                    value: measure.id

                });

                continue;

            }

            const dimension = this.catalog.findDimension(word);

            if (dimension) {

                tokens.push({

                    type: TokenType.DIMENSION,

                    value: dimension.id

                });

                continue;

            }

            const operator = this.catalog.findOperator(word);

            if (operator) {

                tokens.push({

                    type: TokenType.OPERATOR,

                    value: operator.id

                });

                continue;

            }

            tokens.push({

                type: TokenType.WORD,

                value: word

            });

        }

        return tokens;

    }

}