import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("packageCard", [
  "author",
  "compactContainer",
  "description",
  "languages",
  "published",
  "title",
  "version",
  "wideContainer",
] as const);

export default testIds;
