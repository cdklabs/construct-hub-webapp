import { eventName } from "../../contexts/Analytics";

const headerEvent: typeof eventName = (...e) => eventName("Header", ...e);

const searchModalEvent: typeof eventName = (...e) =>
  headerEvent("Search Modal", ...e);

const documentationEvent: typeof eventName = (...e) =>
  headerEvent("Documentation", ...e);

const gettingStartedEvent: typeof eventName = (...e) =>
  headerEvent("Getting Started", ...e);

export const HEADER_ANALYTICS = {
  CONTRIBUTE_LINK: headerEvent("Contribute"),

  DOCUMENTATION: documentationEvent(),

  DOCUMENTATION_DROPDOWN: {
    MENU: documentationEvent("Menu"),
    LINK: documentationEvent("Link"),
  },

  GETTING_STARTED: gettingStartedEvent(),

  GETTING_STARTED_DROPDOWN: {
    MENU: gettingStartedEvent("Menu"),
    LINK: gettingStartedEvent("Link"),
  },

  LOGO: headerEvent("Logo"),

  MOBILE_NAV: {
    OPEN: headerEvent("Mobile Nav", "Open"),
    CLOSE: headerEvent("Mobile Nav", "Close"),
  },

  SEARCH: headerEvent("Search"),

  SEARCH_MODAL: {
    CLOSE: searchModalEvent("Close"),
    OPEN: searchModalEvent("Open"),
    SEARCH: searchModalEvent("Search"),
  },
};
