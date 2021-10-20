import { CatalogSearchSort } from "../../api/catalog-search/constants";

export const SORT_RENDER_MAP = {
  [CatalogSearchSort.NameAsc]: "A-Z",
  [CatalogSearchSort.NameDesc]: "Z-A",
  [CatalogSearchSort.PublishDateAsc]: "Oldest first",
  [CatalogSearchSort.PublishDateDesc]: "Newest first",
  [CatalogSearchSort.DownloadsDesc]: "Most downloads",
  [CatalogSearchSort.DownloadsAsc]: "Least downloads",
};
