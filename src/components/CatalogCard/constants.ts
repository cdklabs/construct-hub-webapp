import { createTestIds } from "util/createTestIds";

export const testIds = createTestIds("catalogCard", [
  "container",
  "title",
  "version",
  "tag",
  "description",
  "date",
  "author",
  "languages",
] as const);
