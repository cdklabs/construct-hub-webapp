import { eventName } from "../../contexts/Analytics/util";

export const SECTION_PADDING = {
  X: [4, 8, 12, 16, 20],
  Y: [4, 6, 8],
};

const homeEvent: typeof eventName = (...e) => eventName("Home", ...e);

export const HOME_ANALYTICS = {
  SEARCH: homeEvent("Search"),

  INFO: {
    eventName: (iconName: string) => homeEvent("Info", iconName),
  },

  USE_CASE: {
    eventName: (useCase: string) => homeEvent("Use Cases", useCase),
  },

  PUBLISHER: {
    eventName: (publisher: string) => homeEvent("Publisher", publisher),
  },

  FEATURED: homeEvent("Featured"),
};
