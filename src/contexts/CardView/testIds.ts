import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("cardView", [
  "controls",
  "gridView",
  "listView",
] as const);

export default testIds;
