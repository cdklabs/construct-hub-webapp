import { useMemo } from "react";

export interface UsePaginationOptions {
  limit?: number;
  offset?: number;
}

const takePage = <T extends any[]>(
  items: T,
  opts: Required<UsePaginationOptions>
) => {
  const { limit, offset } = opts;
  const start = offset * limit;
  const stop = start + limit;
  return items.slice(start, stop);
};

export const usePagination = <T extends any[]>(
  data: T,
  options?: UsePaginationOptions
) => {
  const { limit = 25, offset = 0 } = options ?? {};
  const pageLimit = data ? Math.floor(data.length / limit) : 0;

  return useMemo(
    () => ({
      page: takePage(data, {
        limit,
        offset: offset > pageLimit ? pageLimit : offset,
      }) as T,
      pageLimit,
    }),
    [data, limit, offset, pageLimit]
  );
};
