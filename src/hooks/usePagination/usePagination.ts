import { useEffect, useMemo, useState } from "react";

export interface UsePaginationOptions {
  limit?: number;
  offset?: number;
}

const takePage = <T extends any[]>(
  items: T,
  opts: Required<UsePaginationOptions & { pageLimit: number }>
) => {
  const { limit, offset, pageLimit } = opts;
  const start = (offset > pageLimit ? pageLimit : offset) * limit;
  const stop = start + limit;
  return items.slice(start, stop);
};

export const usePagination = <T extends any[]>(
  data: T,
  options?: UsePaginationOptions
) => {
  const { limit = 25, offset = 0 } = options ?? {};
  const pageLimit = data ? Math.floor(data.length / limit) : 0;

  const [page, setPage] = useState(
    takePage(data, { limit, offset, pageLimit })
  );

  useEffect(() => {
    setPage(takePage(data, { limit, offset, pageLimit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset, data]);

  return useMemo(() => ({ page, pageLimit }), [page, pageLimit]);
};
