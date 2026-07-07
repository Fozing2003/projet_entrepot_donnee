import { BusinessCatalog } from "../catalog/businessCatalog";
import { Intent } from "./intent.types";

export class EntityExtractor {

    constructor(
        private catalog = new BusinessCatalog()
    ) {}

    enrich(question: string, intent: Intent): Intent {

        const lower = question.toLowerCase();

        for (const entity of this.catalog.getEntities()) {

            if (lower.includes(entity.value.toLowerCase())) {

                intent.filters.push({

                    member: entity.dimension,

                    operator: "equals",

                    values: [entity.value]

                });

            }

        }

        return intent;

    }

}