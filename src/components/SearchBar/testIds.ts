import { createTestIds } from "../../util/createTestIds";

export default createTestIds("searchBar", [
  "input",
  "searchIcon",
  "searchButton",
  "overlay",
  "suggestionsList",
  "suggestion",
] as const);
