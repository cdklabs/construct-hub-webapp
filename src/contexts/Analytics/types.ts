/**
 * Object sent to pageview event. The hook will only require a sub-set of this data
 */
export interface PageViewConfig {
  page: {
    pageURL: string; // Can allow hook to infer this
    pageName: string;
    pageType?: "errorPage"; // Only use for 404
  };
  event: {
    type: "pageview";
    name: string; // i.e Search Page Load
    description?: string; // Opt description, 100chars or less
  };
  /**
   * Custom Variables that may be passed for a pageview call.
   */
  data?: Record<string, any>;
}

export interface PageViewOptions {
  page: Omit<PageViewConfig["page"], "pageURL">;
  event?: {
    name?: string; // If not defined, will use `${page.pageName} Load`
    description?: string;
  };
}
