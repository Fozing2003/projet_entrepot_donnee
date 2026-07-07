export interface IntentFilter {
  field: string;
  operator:
    | "equals"
    | "greaterThan"
    | "lessThan"
    | "between"
    | "contains";
  value: any;
}

export interface QueryIntent {
  measure?: string;

  groupBy: string[];

  filters: IntentFilter[];

  order?: "asc" | "desc";

  limit?: number;

  chart?: "table" | "bar" | "line" | "pie";

  aggregation?: "sum" | "avg" | "count";

  confidence?: number;
}