import { ResolvedIntent } from "../types/resolved-intent";

export class QueryBuilder {

    build(intent: ResolvedIntent) {

        const query: any = {};

        //----------------------------------
        // Measures
        //----------------------------------

        if (intent.measures.length) {

            query.measures = intent.measures;

        }

        //----------------------------------
        // Dimensions
        //----------------------------------

        if (intent.dimensions.length) {

            query.dimensions = intent.dimensions;

        }

        //----------------------------------
        // Filters
        //----------------------------------

        if (intent.filters.length) {

            query.filters = intent.filters;

        }

        //----------------------------------
        // Order
        //----------------------------------

        if (intent.order) {

            query.order = intent.order;

        }

        //----------------------------------
        // Limit
        //----------------------------------

        if (intent.limit) {

            query.limit = intent.limit;

        }

        

        return query;

    }

}