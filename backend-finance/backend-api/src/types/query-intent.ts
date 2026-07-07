export interface FilterIntent {

    field: string;

    operator: string;

    value: string;

}

export interface QueryIntent {

    measure?: string;

    dimensions: string[];

    filters: FilterIntent[];

    order?: "asc" | "desc";

    limit?: number;

}