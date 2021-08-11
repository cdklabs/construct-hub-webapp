import { createTestIds } from "../../util/createTestIds";
import { FOOTER_LINKS } from "./constants";

const testIds = createTestIds("footer", [
  "container",
  "links",
  "disclaimer",
  "manageCookies",
  ...Object.values(FOOTER_LINKS).map(({ testId }) => testId),
] as const);

export default testIds;
