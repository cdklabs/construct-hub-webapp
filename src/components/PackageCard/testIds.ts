import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("packageCard", [
  "author",
  "description",
  "downloads",
  "languages",
  "published",
  "title",
  "version",
  "comment",
  "wideContainer",
] as const);

export default testIds;
