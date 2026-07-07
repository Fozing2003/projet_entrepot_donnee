import { Token, TokenType } from "../types/types";
import { QueryIntent } from "../types/query-intent";

export class Parser {

    parse(tokens: Token[]): QueryIntent {

        const intent: QueryIntent = {

            dimensions: [],

            filters: []

        };

        for (const token of tokens) {

            switch (token.type) {

                case TokenType.MEASURE:

                    intent.measure = token.value;

                    break;

                case TokenType.DIMENSION:

                    intent.dimensions.push(token.value);

                    break;

                case TokenType.NUMBER:

                    if (!intent.limit) {

                        intent.limit = Number(token.value);

                    }

                    break;

                case TokenType.YEAR:

                    intent.filters.push({

                        field: "year",

                        operator: "equals",

                        value: token.value

                    });

                    break;

                case TokenType.OPERATOR:

                    intent.order =

                        token.value === "top"

                            ? "desc"

                            : "asc";

                    break;

            }

        }

        return intent;

    }

}