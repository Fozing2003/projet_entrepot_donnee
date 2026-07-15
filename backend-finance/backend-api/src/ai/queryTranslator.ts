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

    private fallback(question: string) {
        const normalized = question
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (normalized.includes("zone") || normalized.includes("ville") || normalized.includes("quartier")) {
            return {
                measures: ["Transactions.transactionCount", "Transactions.totalRevenue"],
                dimensions: ["Zones.region", "Zones.ville", "Zones.quartier"],
                order: {
                    "Transactions.transactionCount": "desc"
                },
                limit: 10
            };
        }

        return {
            measures: ["Transactions.transactionCount", "Transactions.totalRevenue"],
            dimensions: ["Agences.nom"],
            order: {
                "Transactions.totalRevenue": "desc"
            },
            limit: 10
        };
    }

    async translate(question: string) {

        const prompt = buildPrompt(
            question.trim(),
            this.catalog.getCatalog()
        );

        const json = await this.mistral.complete(prompt);

        const cleaned = this.clean(json);

        try {
            return JSON.parse(cleaned);
        } catch {
            return this.fallback(question);
        }

    }

}
