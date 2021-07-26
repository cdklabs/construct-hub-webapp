import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useHistory } from "react-router-dom";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";

export interface UseCatalogSearchParams {
  defaultQuery?: string;
  defaultLanguage?: Language | null;
}

export interface UseCatalogSearchReturn {
  /**
   * The language state for this search
   */
  language: Language | null;
  /**
   * Updates language state
   */
  onLanguageChange: (lang: Language | null) => void;
  /**
   * Input ChangeEventHandler which wraps the setQuery state setter
   */
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
  /**
   * Navigates to the search query url
   */
  onSearch: () => void;
  /**
   * FormEventHandler to handle query submission
   */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /**
   * The query state for this search
   */
  query: string;
  /**
   * Language state setter
   */
  setLanguage: Dispatch<SetStateAction<Language | null>>;
  /**
   * Query state setter
   */
  setQuery: Dispatch<SetStateAction<string>>;
}

/**
 * This hook provides all of the methods required to implement the functionality
 * of a client-side catalog search component. It additionally exposes lower-level methods
 * for custom components which may want to access parts of the search API
 */
export const useCatalogSearch = (
  options: UseCatalogSearchParams = {}
): UseCatalogSearchReturn => {
  const [query, setQuery] = useState(options.defaultQuery ?? "");

  const [language, setLanguage] = useState<Language | null>(
    options.defaultLanguage ?? null
  );

  const { push } = useHistory();

  const onQueryChange: UseCatalogSearchReturn["onQueryChange"] = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const onSearch = useCallback(() => {
    push(getSearchPath({ language, query }));
  }, [language, push, query]);

  const onSubmit: UseCatalogSearchReturn["onSubmit"] = useCallback(
    (e) => {
      e?.preventDefault();
      onSearch();
    },
    [onSearch]
  );

  return useMemo(
    () => ({
      language,
      onLanguageChange: setLanguage,
      onQueryChange,
      onSearch,
      onSubmit,
      query,
      setLanguage,
      setQuery,
    }),
    [language, onSearch, onSubmit, query]
  );
};
