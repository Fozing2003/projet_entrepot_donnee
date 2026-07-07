export enum TokenType {

    WORD = "WORD",

    NUMBER = "NUMBER",

    YEAR = "YEAR",

    MEASURE = "MEASURE",

    DIMENSION = "DIMENSION",

    OPERATOR = "OPERATOR"

}

export interface Token {

    type: TokenType;

    value: string;

}