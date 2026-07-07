import { CatalogService } from "../services/catalog.service";
import { buildPrompt } from "../prompts/query.prompt";
import { MistralService } from "./mistral.service";



export class QueryTranslator {

    private catalog = new CatalogService();

    private mistral = new MistralService();

    private clean(text: string): string {

        return text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

    }

    async translate(question: string) {

        const prompt = buildPrompt(
            question,
            this.catalog.getCatalog()
        );

        const json = await this.mistral.complete(prompt);

        const cleaned = this.clean(json);


        return JSON.parse(cleaned);

    }

}