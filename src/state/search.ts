import { atom, DefaultValue, selector } from "recoil";
import {
  CatalogSearchParams,
  ExtendedCatalogPackage,
} from "../api/catalog-search";
import { CatalogSearchSort } from "../api/catalog-search/constants";
import { CDKType } from "../constants/constructs";
import { Language } from "../constants/languages";

export const queryState = atom<string>({
  key: "search-queryState",
  default: "",
});

export const keywordsState = atom<string[]>({
  key: "search-keywordsState",
  default: [],
});

export const cdkTypeState = atom<CDKType | undefined>({
  key: "search-cdkTypeState",
  default: undefined,
});

export const cdkMajorState = atom<number | undefined>({
  key: "search-cdkMajorState",
  default: undefined,
});

export const languagesState = atom<Language[]>({
  key: "search-languagesState",
  default: [],
});

export const offsetState = atom<number>({
  key: "search-offsetState",
  default: 0,
});

export const sortState = atom<CatalogSearchSort | undefined>({
  key: "search-sortState",
  default: undefined,
});

export const resultsState = atom<ExtendedCatalogPackage[]>({
  key: "search-resultsState",
  default: [],
});

export const pageLimitState = atom<number>({
  key: "search-pageLimitState",
  default: 0,
});

export const pageState = atom<ExtendedCatalogPackage[]>({
  key: "search-pageState",
  default: [],
});

export const tagsState = atom<string[]>({
  key: "search-tagsState",
  default: [],
});

export const searchParametersSelector = selector<CatalogSearchParams>({
  key: "search-searchParametersSelector",
  get: ({ get }) => ({
    filters: {
      cdkMajor: get(cdkMajorState),
      cdkType: get(cdkTypeState),
      keywords: get(keywordsState),
      languages: get(languagesState),
      tags: get(tagsState),
    },
    query: get(queryState),
    sort: get(sortState),
  }),
  set: ({ set }, params) => {
    if (!(params instanceof DefaultValue)) {
      const { query, sort, filters } = params;
      const { cdkMajor, cdkType, keywords, languages, tags } = filters ?? {};

      set(queryState, query ?? "");
      set(sortState, sort);
      set(cdkMajorState, cdkMajor);
      set(cdkTypeState, cdkType);
      set(keywordsState, keywords ?? []);
      set(languagesState, languages ?? []);
      set(tagsState, tags ?? []);
    }
  },
});

export const searchResultsSelector = selector<{
  page: ExtendedCatalogPackage[];
  pageLimit: number;
  results: ExtendedCatalogPackage[];
}>({
  key: "search-searchResultsSelector",
  get: ({ get }) => ({
    page: get(pageState),
    pageLimit: get(pageLimitState),
    results: get(resultsState),
  }),
  set: ({ set }, params) => {
    console.info("searchResultsSelector.set(params) - params", params);
    if (!(params instanceof DefaultValue)) {
      set(pageState, params.page);
      set(pageLimitState, params.pageLimit);
      set(resultsState, params.results);
    }
  },
});
