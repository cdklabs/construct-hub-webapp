import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS, ROUTES } from "../../constants/url";

export interface UseCatalogSearchParams {
  defaultQuery?: string;
  defaultLanguage?: Language | null;
}
/**
 * This hook provides all of the methods required to implement the functionality
 * of a client-side catalog search component
 */
export const useCatalogSearch = (options: UseCatalogSearchParams = {}) => {
  const [search, setSearch] = useState(options.defaultQuery ?? "");

  const [language, setLanguage] = useState<Language | null>(
    options.defaultLanguage ?? null
  );

  const { push } = useHistory();

  const onQueryChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const baseUrl = `${ROUTES.SEARCH}?${QUERY_PARAMS.SEARCH_QUERY}=${search}&${QUERY_PARAMS.OFFSET}=0`;
      const langParam = language ? `&${QUERY_PARAMS.LANGUAGE}=${language}` : "";
      push(`${baseUrl}${langParam}`);
    },
    [language, push, search]
  );

  return useMemo(
    () => ({
      query: search,
      language,
      onQueryChange,
      onLanguageChange: setLanguage,
      onSubmit,
    }),
    [language, onSubmit, search]
  );
};
