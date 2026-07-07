import { BusinessCatalog } from "../catalog/businessCatalog";
import { Intent } from "./intent.types";

export class ComparisonResolver {

    constructor(
        private catalog = new BusinessCatalog()
    ) {}

    resolve(question: string, intent: Intent): Intent {

        if (!intent.comparison)
            return intent;

        const lower = question.toLowerCase();

        const entities = this.catalog
            .getEntities()
            .filter(entity =>
                lower.includes(entity.value.toLowerCase())
            );

        if (entities.length >= 2) {

            intent.comparisonInfo = {

                left: entities[0].value,

                right: entities[1].value,

                dimension: entities[0].dimension

            };

        }

        return intent;

    }

}