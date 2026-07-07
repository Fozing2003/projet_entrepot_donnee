import { Token, TokenType } from "../types/types";
import { Intent } from "./intent.types";

export class IntentDetector {

    detect(tokens: Token[]): Intent {

        const intent: Intent = {

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

                case TokenType.YEAR:

                    intent.filters.push({

                        member: "Temps.annee",

                        operator: "equals",

                        values: [token.value]

                    });

                    break;

                case TokenType.NUMBER:

                    if (!intent.limit) {

                        intent.limit = Number(token.value);

                    }

                    break;

            }

        }

        return intent;

    }

}