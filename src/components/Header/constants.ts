import { eventName } from "../../contexts/Analytics/util";

const headerEvent: typeof eventName = (...e) => eventName("Header", ...e);

export const HEADER_ANALYTICS = {
  DOCUMENTATION: {
    MENU: headerEvent("Documentation", "Menu"),
    LINK: headerEvent("Documentation", "Link"),
  },
  GETTING_STARTED: {
    MENU: headerEvent("Getting Started", "Menu"),
    LINK: headerEvent("Getting Started", "Link"),
  },
  CONTRIBUTE_LINK: headerEvent("Contribute"),
  LOGO: headerEvent("Logo"),
  SEARCH: headerEvent("Search"),
};
