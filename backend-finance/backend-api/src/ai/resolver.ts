import { CatalogService } from "../services/catalog.service";
import { QueryIntent } from "../types/query-intent";
import { ResolvedIntent } from "../types/resolved-intent";

export class Resolver {

    private catalog = new CatalogService();

    resolve(intent: QueryIntent): ResolvedIntent {

        const resolved: ResolvedIntent = {

            measures: [],

            dimensions: [],

            filters: []

        };

        //--------------------------------
        // Measure
        //--------------------------------

        if (intent.measure) {

            const measure = this.catalog
                .getMeasures()
                .find(m => m.id === intent.measure);

            if (measure) {

                resolved.measures.push(
                    measure.cube
                );

            }

        }

        //--------------------------------
        // Dimensions
        //--------------------------------

        for (const dimensionId of intent.dimensions) {

            const dimension = this.catalog
                .getDimensions()
                .find(d => d.id === dimensionId);

            if (dimension) {

                resolved.dimensions.push(
                    dimension.cube
                );

            }

        }

        //--------------------------------
        // Filters
        //--------------------------------

        for (const filter of intent.filters) {

            const dimension = this.catalog
                .getDimensions()
                .find(d => d.id === filter.field);

            if (!dimension) continue;

            resolved.filters.push({

                member: dimension.cube,

                operator: filter.operator,

                values: [filter.value]

            });

        }

        //--------------------------------
        // Order
        //--------------------------------

        if (

            intent.order &&

            resolved.measures.length > 0

        ) {

            resolved.order = {

                [resolved.measures[0]]: intent.order

            };

        }

        //--------------------------------
        // Limit
        //--------------------------------

        if (intent.limit) {

            resolved.limit = intent.limit;

        }

        return resolved;

    }

}