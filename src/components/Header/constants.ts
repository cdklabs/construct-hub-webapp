import { createTestIds } from "util/createTestIds";

export const testIds = createTestIds("header", [
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
