export interface AppConfig {
  /**
   * A URL to point app requests to. By default this can be
   * omitted as a cloudfront proxy will be used.
   */
  apiUrl?: string;
  /**
   * Reflects if the app will collect usage data
   * @default false
   */
  hasAnalytics?: boolean;

  /**
   * Defines content or pages which will be disabled. Disabled routes will 404
   */
  disableContent?: {
    faq?: boolean;
  };
}
