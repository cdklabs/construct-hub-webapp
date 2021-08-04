import { createTestIds } from "util/createTestIds";

const testIds = createTestIds("catalogCard", [
  "container",
  "title",
  "version",
  "tag",
  "description",
  "date",
  "author",
  "languages",
] as const);

export default testIds;
