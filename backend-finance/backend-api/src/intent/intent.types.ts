export interface Comparison {

    left?: string;

    right?: string;

    dimension?: string;

}

export interface Intent {

    measure?: string;

    dimensions: string[];

    filters: any[];

    order?: "asc" | "desc";

    limit?: number;

    comparison?: boolean;

    comparisonInfo?: Comparison;

    trend?: boolean;

    groupByTime?: boolean;

}