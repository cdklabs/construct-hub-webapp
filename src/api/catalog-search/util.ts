import { CatalogSearchFilters } from ".";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { CatalogSearchSort } from "./constants";

type SortFunction = (p1: CatalogPackage, p2: CatalogPackage) => number;

type FilterFunctionBuilder<T> = (
  filter: T
) => undefined | ((pkg: CatalogPackage) => boolean);

const getDateSort =
  (isAscending: boolean): SortFunction =>
  (p1, p2) => {
    const d1 = new Date(p1.metadata.date);
    const d2 = new Date(p2.metadata.date);
    if (d1 === d2) {
      return 0;
    }

    if (isAscending) {
      return d2 < d1 ? 1 : -1;
    }

    return d1 < d2 ? 1 : -1;
  };

const getStrSort = (isAscending: boolean): SortFunction => {
  return (p1, p2) => p1.name.localeCompare(p2.name) * (isAscending ? 1 : -1);
};

const getLanguageFilter: FilterFunctionBuilder<
  CatalogSearchFilters["language"]
> = (language) => {
  if (!(language && language !== Language.TypeScript)) {
    return undefined;
  }

  return (pkg) => {
    return pkg.languages[language] !== undefined;
  };
};

const getLanguagesFilter: FilterFunctionBuilder<
  CatalogSearchFilters["languages"]
> = (languages) => {
  const languageSet =
    (languages?.length ?? 0) > 0 ? new Set(languages) : undefined;

  if (!languageSet || languageSet.has(Language.TypeScript)) {
    return undefined;
  }

  return (pkg) => {
    const isMatched = Object.keys(pkg.languages).some((lang) =>
      languageSet.has(lang as Language)
    );

    return isMatched;
  };
};

const getCDKTypeFilter: FilterFunctionBuilder<CatalogSearchFilters["cdkType"]> =
  (cdkType) => {
    if (!cdkType) return undefined;
    return (pkg) => pkg.metadata?.constructFramework?.name === cdkType;
  };

const getCDKMajorFilter: FilterFunctionBuilder<
  CatalogSearchFilters["cdkMajor"]
> = (cdkMajor) => {
  if (!cdkMajor) return undefined;
  return (pkg) => pkg.metadata?.constructFramework?.majorVersion === cdkMajor;
};

export const SORT_FUNCTIONS: Record<CatalogSearchSort, SortFunction> = {
  [CatalogSearchSort.NameAsc]: getStrSort(true),
  [CatalogSearchSort.NameDesc]: getStrSort(false),
  [CatalogSearchSort.PublishDateAsc]: getDateSort(true),
  [CatalogSearchSort.PublishDateDesc]: getDateSort(false),
};

export const FILTER_FUNCTIONS: {
  [key in keyof Required<CatalogSearchFilters>]: FilterFunctionBuilder<
    CatalogSearchFilters[key]
  >;
} = {
  cdkType: getCDKTypeFilter,
  cdkMajor: getCDKMajorFilter,
  language: getLanguageFilter,
  languages: getLanguagesFilter,
};
