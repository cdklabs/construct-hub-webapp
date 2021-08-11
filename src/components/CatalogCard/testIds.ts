import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("catalogCard", [
  "container",
  "name",
  "version",
  "tags",
  "description",
  "date",
  "author",
  "languages",
] as const);

export default testIds;
