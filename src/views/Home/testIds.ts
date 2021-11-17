import { createTestIds } from "../../util/createTestIds";

export default createTestIds("homeRedesign", [
  "page",
  "packageGrid",
  // Hero Section
  "heroHeader",
  "heroSubtitle",
  // Info Section
  "infoContainer",
  "infoSection",
  "infoSectionHeading",
  "infoSectionDescription",
  "infoSectionIcon",
  // Featured / Recently Updated Section
  "featuredContainer",
  "featuredHeader",
  "featuredGrid",
  // CDK Type Section
  "cdkTypeSection",
  "cdkTypeSectionHeading",
  "cdkTypeSectionDescription",
  "cdkTypeTab",
  "cdkTypeGrid",
  "cdkTypeSeeAllButton",
  "categoriesContainer",
  "categoriesHeader",
  "categoriesDescription",
] as const);
