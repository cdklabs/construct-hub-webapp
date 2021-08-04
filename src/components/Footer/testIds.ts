import { FOOTER_LINKS } from "./constants";
import { createTestIds } from "util/createTestIds";

const testIds = createTestIds("footer", [
  "container",
  "links",
  "disclaimer",
  "manageCookies",
  ...Object.values(FOOTER_LINKS).map(({ testId }) => testId),
] as const);

export default testIds;
