export interface CubeFilter {

    member: string;

    operator: string;

    values: string[];

}

export interface ResolvedIntent {

    measures: string[];

    dimensions: string[];

    filters: CubeFilter[];

    order?: Record<string, "asc" | "desc">;

    limit?: number;

}