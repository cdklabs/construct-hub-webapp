import { useMemo } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";

export const useSearchParam = <T = string | null>(
  key: string,
  transform?: (param: string | null) => T
): T => {
  const queryParams = useQueryParams();
  const qp = queryParams.get(key);

  return useMemo(
    () => (transform ? transform(qp) : (qp as unknown as T)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qp]
  );
};
