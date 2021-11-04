import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("header", [
  "container",
  "title",
  "gettingStartedTrigger",
  "gettingStartedMenu",
  "documentationTrigger",
  "documentationMenu",
  "navOpen",
  "navClose",
  "searchInput",
  "searchIcon",
  "mobileNav",
] as const);

export default testIds;
