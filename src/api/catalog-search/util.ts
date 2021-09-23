import { CatalogPackage } from "../package/packages";
import { CatalogSearchSort } from "./constants";

type SortFunction = (p1: CatalogPackage, p2: CatalogPackage) => number;

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
  return (p1, p2) =>
    isAscending
      ? p1.name.localeCompare(p2.name)
      : p2.name.localeCompare(p1.name);
};

export const SORT_FUNCTIONS: Record<CatalogSearchSort, SortFunction> = {
  [CatalogSearchSort.NameAsc]: getStrSort(true),
  [CatalogSearchSort.NameDesc]: getStrSort(false),
  [CatalogSearchSort.PublishDateAsc]: getDateSort(true),
  [CatalogSearchSort.PublishDateDesc]: getDateSort(false),
};
