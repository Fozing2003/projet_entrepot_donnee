import fs from "fs";
import path from "path";
// removed invalid import of JSON file; catalog is loaded at runtime from filesystem

export interface Measure {
    id: string;
    cube: string;
    label: string;
    synonyms: string[];
}

export interface Dimension {
    id: string;
    cube: string;
    label: string;
    synonyms: string[];
}

export interface Operator {
    id: string;
    order: "asc" | "desc";
    synonyms: string[];
}

interface Catalog {
    measures: Measure[];
    dimensions: Dimension[];
    operators: Operator[];
    stopWords: string[];
}

export class CatalogService {

    private catalog: Catalog;

    constructor() {

        const file = path.join(__dirname, "./../catalog/catalog.json");

        console.log("Catalogue :", file);

        this.catalog = JSON.parse(
            fs.readFileSync(file, "utf8")
        );

        console.log("Catalogue chargé !");
    }

    getCatalog() {
        return this.catalog;
    }

    getMeasures() {
        return this.catalog.measures;
    }

    getDimensions() {
        return this.catalog.dimensions;
    }

    getOperators() {
        return this.catalog.operators;
    }

    getStopWords() {
        return this.catalog.stopWords;
    }

    findMeasure(word: string) {

        const token = word.toLowerCase();

        return this.catalog.measures.find(m =>
            m.synonyms.some(s => s.toLowerCase() === token)
        );
    }

    findDimension(word: string) {

        const token = word.toLowerCase();

        return this.catalog.dimensions.find(d =>
            d.synonyms.some(s => s.toLowerCase() === token)
        );
    }

    findOperator(word: string) {

        const token = word.toLowerCase();

        return this.catalog.operators.find(o =>
            o.synonyms.some(s => s.toLowerCase() === token)
        );
    }

    isStopWord(word: string) {

        return this.catalog.stopWords.includes(
            word.toLowerCase()
        );
    }

}
/*
import { measures } from "./../catalog/measures";
import { dimensions } from "./../catalog/dimensions";

export class CatalogService {

    findMeasureByExpression(expression: string) {

    expression = expression.toLowerCase();

    for (const measure of Object.values(measures)) {

        if (

            measure.synonyms.some(

                s => s.toLowerCase() === expression

            )

        ) {

            return measure;

        }

    }

    return null;

}

    findDimensionByExpression(expression: string) {

        for (const dimension of Object.values(dimensions)) {

            if (dimension.synonyms.some(s => s.toLowerCase() === expression)) {
                return dimension;
            }

        }

        return null;

    }

    getMeasure(name: string) {

        return measures[name as keyof typeof measures];

    }

    getDimension(name: string) {

        return dimensions[name as keyof typeof dimensions];

    }

}
*/
/*
export class CatalogService {

    getMeasure(name: string) {
        return measures[name as keyof typeof measures];
    }

    getDimension(name: string) {
        return dimensions[name as keyof typeof dimensions];
    }

    findMeasureBySynonym(word: string) {

        return Object.values(measures).find(m =>
            m.synonyms.some(s =>
                s.toLowerCase() === word.toLowerCase()
            )
        );

    }

    findDimensionBySynonym(word: string) {

        return Object.values(dimensions).find(d =>
            d.synonyms.some(s =>
                s.toLowerCase() === word.toLowerCase()
            )
        );

    }

}
    */