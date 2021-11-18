import { CatalogSearchFilters, ExtendedCatalogPackage } from ".";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { CatalogSearchSort } from "./constants";

type SortFunction = (
  p1: ExtendedCatalogPackage,
  p2: ExtendedCatalogPackage
) => number;

type FilterFunctionBuilder<T> = (
  filter: T
) => undefined | ((pkg: ExtendedCatalogPackage) => boolean);

const getStrSort = (isAscending: boolean): SortFunction => {
  return (p1, p2) => p1.name.localeCompare(p2.name) * (isAscending ? 1 : -1);
};

const getDateSort =
  (isAscending: boolean): SortFunction =>
  (p1, p2) => {
    const d1 = new Date(p1.metadata.date).getTime();
    const d2 = new Date(p2.metadata.date).getTime();

    if (d1 === d2) {
      return getStrSort(true)(p1, p2);
    }

    if (isAscending) {
      return d2 < d1 ? 1 : -1;
    }

    return d1 < d2 ? 1 : -1;
  };

const getDownloadsSort = (isAscending: boolean): SortFunction => {
  return (p1, p2) => {
    if (p1.downloads !== p2.downloads) {
      return (p1.downloads - p2.downloads) * (isAscending ? 1 : -1);
    } else {
      // break ties by alphabetical
      return getStrSort(!isAscending)(p1, p2);
    }
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
    const isMatched = Object.keys(pkg.languages ?? {}).some((lang) =>
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
  if (typeof cdkMajor !== "number") return undefined;
  return (pkg) => pkg.metadata?.constructFramework?.majorVersion === cdkMajor;
};

const getKeywordsFilter: FilterFunctionBuilder<
  CatalogSearchFilters["keywords"]
> = (keywords) => {
  if (!keywords?.length) return undefined;

  return (pkg) => {
    const set = new Set<string>();

    for (const kw of pkg.keywords ?? []) {
      set.add(kw.toLocaleLowerCase());
    }

    for (const tag of pkg.metadata?.packageTags ?? []) {
      const label = tag.keyword?.label;
      if (label) {
        set.add(label.toLocaleLowerCase());
      }
    }

    for (const query of keywords) {
      if (set.has(query.toLocaleLowerCase())) {
        return true;
      }
    }

    return false;
  };
};

const getTagsFilter: FilterFunctionBuilder<CatalogSearchFilters["tags"]> = (
  tags
) => {
  if (!tags || !tags.length) {
    return undefined;
  }

  return (pkg) => {
    return (
      pkg.metadata?.packageTags?.some((tag) => {
        return tags.includes(tag.id);
      }) ?? false
    );
  };
};

export const SORT_FUNCTIONS: Record<CatalogSearchSort, SortFunction> = {
  [CatalogSearchSort.NameAsc]: getStrSort(true),
  [CatalogSearchSort.NameDesc]: getStrSort(false),
  [CatalogSearchSort.PublishDateAsc]: getDateSort(true),
  [CatalogSearchSort.PublishDateDesc]: getDateSort(false),
  [CatalogSearchSort.DownloadsAsc]: getDownloadsSort(true),
  [CatalogSearchSort.DownloadsDesc]: getDownloadsSort(false),
};

export const FILTER_FUNCTIONS: {
  [key in keyof Required<CatalogSearchFilters>]: FilterFunctionBuilder<
    CatalogSearchFilters[key]
  >;
} = {
  cdkType: getCDKTypeFilter,
  cdkMajor: getCDKMajorFilter,
  keywords: getKeywordsFilter,
  languages: getLanguagesFilter,
  tags: getTagsFilter,
};

/**
 * Returns a set of all the keywords associated with a package. This includes
 * publisher-based keywords and keywords from package tags.
 *
 * The set contains a single entry for each keyword, and all keywords are lowercased.
 *
 * Filters out all keywords that are in the ignore list.
 *
 * @param pkg The package
 * @returns The set of keywords
 */
export const renderAllKeywords = (pkg: CatalogPackage) => {
  const allKeywords = new Set<string>();
  const publisherKeywords = pkg.keywords ?? [];
  const tagKeywords = (pkg.metadata?.packageTags ?? [])
    .filter((t) => t.keyword)
    .map((t) => t.keyword!.label);

  for (const kw of [...publisherKeywords, ...tagKeywords]) {
    if (KEYWORD_IGNORE_LIST.has(kw)) {
      continue;
    }

    allKeywords.add(kw.toLocaleLowerCase());
  }

  return Array.from(allKeywords);
};
