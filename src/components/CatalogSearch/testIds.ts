import { createTestIds } from "../../util/createTestIds";

const testIds = createTestIds("catalogSearch", [
  "form",
  "input",
  "languageDropdown",
  "languageDropdownMenu",
  "languageDropdownValue",
  "languageItem",
  "submit",
] as const);

export default testIds;
