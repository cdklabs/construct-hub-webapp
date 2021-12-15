import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { offsetState, searchParametersSelector } from "../../state/search";
import { getSearchPath } from "../../util/url";

export const useSyncParamsToUrl = () => {
  const { push } = useHistory();
  const isFirstRender = useRef(true);

  const searchParams = useRecoilValue(searchParametersSelector);
  const offset = useRecoilValue(offsetState);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    push(
      getSearchPath({
        query: searchParams.query,
        sort: searchParams.sort,
        offset,
        ...searchParams.filters,
      })
    );
  }, [push, searchParams, offset]);
};
