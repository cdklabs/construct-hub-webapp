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
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";

export interface UseCatalogSearchParams {
  defaultCdkMajor?: number;
  defaultCdkType?: CDKType;
  defaultQuery?: string;
  defaultLanguage?: UseCatalogSearchReturn["language"];
  defaultLanguages?: UseCatalogSearchReturn["languages"];
  defaultSort?: UseCatalogSearchReturn["sort"];
  defaultTags?: UseCatalogSearchReturn["tags"];
}

interface NavigationParams {
  replace?: boolean;
}

export interface UseCatalogSearchReturn {
  /**
   * The CDK Type's major version to filter by
   */
  cdkMajor?: number;
  /**
   * The CDK Type to filter by
   */
  cdkType?: CDKType;
  /**
   * The language state for this search
   */
  language?: Language;
  /**
   * The list of languages being filtered
   */
  languages: Language[];
  /**
   * The list of tags being filtered
   */
  tags: string[];
  /**
   * Updates language state
   */
  onLanguageChange: (lang?: Language) => void;
  /**
   * Input ChangeEventHandler which wraps the setQuery state setter
   */
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
  /**
   * Navigates to the search query url
   */
  onSearch: (p?: NavigationParams) => void;
  /**
   * FormEventHandler to handle query submission
   */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /**
   * The query state for this search
   */
  query: string;
  /**
   * CDK Major state setter
   */
  setCdkMajor: Dispatch<SetStateAction<UseCatalogSearchReturn["cdkMajor"]>>;
  /**
   * CDK Type state setter
   */
  setCdkType: Dispatch<SetStateAction<UseCatalogSearchReturn["cdkType"]>>;
  /**
   * Language state setter
   */
  setLanguage: Dispatch<SetStateAction<UseCatalogSearchReturn["language"]>>;
  /**
   * Languages list state setter
   */
  setLanguages: Dispatch<SetStateAction<UseCatalogSearchReturn["languages"]>>;
  /**
   * Tags list state setter
   */
  setTags: Dispatch<SetStateAction<UseCatalogSearchReturn["tags"]>>;
  /**
   * Query state setter
   */
  setQuery: Dispatch<SetStateAction<UseCatalogSearchReturn["query"]>>;

  setSort: Dispatch<SetStateAction<UseCatalogSearchReturn["sort"]>>;

  sort?: CatalogSearchSort;
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

  const [cdkType, setCdkType] = useState<UseCatalogSearchReturn["cdkType"]>(
    options.defaultCdkType
  );

  const [cdkMajor, setCdkMajor] = useState<UseCatalogSearchReturn["cdkMajor"]>(
    options.defaultCdkMajor
  );

  const [languages, setLanguages] = useState<
    UseCatalogSearchReturn["languages"]
  >(options.defaultLanguages ?? []);

  const [tags, setTags] = useState<UseCatalogSearchReturn["tags"]>(
    options.defaultTags ?? []
  );

  const [language, setLanguage] = useState<UseCatalogSearchReturn["language"]>(
    options.defaultLanguage
  );

  const [sort, setSort] = useState<UseCatalogSearchReturn["sort"]>(
    options.defaultSort
  );

  const { push, replace } = useHistory();

  const onQueryChange: UseCatalogSearchReturn["onQueryChange"] = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const onSearch: UseCatalogSearchReturn["onSearch"] = useCallback(
    (opts) => {
      const navigate = opts?.replace ? replace : push;
      navigate(
        getSearchPath({
          cdkType,
          cdkMajor,
          language,
          languages,
          query,
          sort,
          tags,
        })
      );
    },
    [cdkType, cdkMajor, language, languages, push, query, replace, sort, tags]
  );

  const onSubmit: UseCatalogSearchReturn["onSubmit"] = useCallback(
    (e) => {
      e?.preventDefault();
      onSearch();
    },
    [onSearch]
  );

  return useMemo(
    () => ({
      cdkMajor,
      cdkType,
      language,
      languages,
      onLanguageChange: setLanguage,
      onQueryChange,
      onSearch,
      onSubmit,
      query,
      setCdkMajor,
      setCdkType,
      setLanguage,
      setLanguages,
      setTags,
      setQuery,
      setSort,
      sort,
      tags,
    }),
    [
      cdkMajor,
      cdkType,
      language,
      languages,
      onSearch,
      onSubmit,
      query,
      sort,
      tags,
    ]
  );
};
