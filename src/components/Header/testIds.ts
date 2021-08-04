import { createTestIds } from "util/createTestIds";

const testIds = createTestIds("header", [
  "container",
  "title",
  "gettingStartedTrigger",
  "gettingStartedMenu",
  "resourcesTrigger",
  "resourcesMenu",
  "navOpen",
  "navClose",
  "searchButton",
  "searchIcon",
  "mobileNav",
] as const);

export default testIds;
