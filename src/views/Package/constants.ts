import { eventName } from "../../contexts/Analytics/util";

const packageEvent: typeof eventName = (...e) =>
  eventName("Package Page", ...e);

export const PACKAGE_ANALYTICS = {
  SCOPE: packageEvent(),

  SELECT_VERSION: packageEvent("Select Version"),

  CDK_BADGE: {
    eventName: (badge: string) => packageEvent("CDK Badge", badge),
  },

  KEYWORD: {
    eventName: (kw: string) => packageEvent("Keyword", kw),
  },

  LANGUAGE: {
    eventName: (lang: string) => packageEvent("Language", lang),
  },

  DOCUMENTATION: {
    TAB: packageEvent("Documentation", "Tab"),
  },

  DEPENDENCIES: {
    TAB: packageEvent("Dependencies", "Tab"),
  },

  FEEDBACK: {
    PUBLISHER: packageEvent("Feedback", "Publisher"),
    CONSTRUCT_HUB: packageEvent("Feedback", "Construct Hub"),
    ABUSE: packageEvent("Feedback", "Abuse"),
  },
};

export const API_URL_RESOURCE = "api";
