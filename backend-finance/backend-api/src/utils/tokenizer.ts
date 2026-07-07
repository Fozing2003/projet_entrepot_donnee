import { CatalogService } from "../services/catalog.service";

export class Tokenizer {

    constructor(
        private catalog = new CatalogService()
    ) {}

    tokenize(sentence: string): string[] {

        return sentence

            .toLowerCase()

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .replace(/[?,.;:!]/g, " ")

            .split(/\s+/)

            .filter(Boolean)

            .filter(word => !this.catalog.isStopWord(word));

    }

}