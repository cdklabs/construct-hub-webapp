import { createTestIds } from "util/createTestIds";

const testIds = createTestIds("home", [
  "headings",
  "results",
  "nextPageBtn",
  "nextIcon",
  "prevIcon",
] as const);

export default testIds;
