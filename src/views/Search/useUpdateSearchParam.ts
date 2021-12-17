import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getSearchPath } from "../../util/url";
import { getSearchUrlParams } from "./util";

export const useUpdateSearchParam = () => {
  const { push } = useHistory();

  return useCallback(
    (p?: Partial<Parameters<typeof getSearchPath>[0]>) => {
      const { offset, ...params } = p ?? {};

      push(
        getSearchPath({
          ...getSearchUrlParams(),
          ...params,
          offset: offset ?? 0,
        })
      );
    },
    [push]
  );
};
