import { createTestIds } from "../../util/createTestIds";

export default createTestIds("searchRedesign", [
  "page",
  // Results
  "searchDetails",
  "nextPage",
  "prevPage",
  "goToPage",
  // Sorting
  "sortButton",
  "sortDropdown",
  "sortItem",
  // Filters Panel
  "filtersPanel",
  "cdkTypeFilter",
  "cdkVersionFilter",
  "filterItem",
  "languagesFilter",
] as const);
