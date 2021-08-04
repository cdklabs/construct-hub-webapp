import { createTestIds } from "util/createTestIds";

export const testIds = createTestIds("home", [
  "headings",
  "results",
  "nextPageBtn",
  "nextIcon",
  "prevIcon",
] as const);
