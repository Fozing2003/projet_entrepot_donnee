export interface CubeQuery {
  measures?: string[];
  dimensions?: string[];
  filters?: any[];
  order?: Record<string, "asc" | "desc">;
  limit?: number;
}

export interface QueryIntent {
  measure?: string;
  dimensions: string[];
  order?: "asc" | "desc";
  limit?: number;
}