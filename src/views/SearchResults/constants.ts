import type { QueryParamKey } from "../../constants/url";

const LIMITS = [25, 50, 75, 100];
export const LIMIT = LIMITS[0];

export type SearchQueryParam = Extract<QueryParamKey, "offset" | "q">;
