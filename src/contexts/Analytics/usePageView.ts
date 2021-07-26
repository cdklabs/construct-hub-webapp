import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "./Analytics";
import type { PageViewOptions, PageViewConfig } from "./types";

export const usePageView = (opts: PageViewOptions) => {
  const { trackPageView } = useAnalytics();
  const { pathname } = useLocation();

  const options: PageViewConfig = useMemo(
    () => ({
      page: {
        pageURL: pathname,
        ...opts.page,
      },
      event: {
        type: "pageview",
        name: opts.event?.name ?? `${opts.page.pageName} Load`,
        description: opts.event?.description,
      },
    }),
    [pathname, opts]
  );

  const track = useCallback(() => {
    return trackPageView(options);
  }, [trackPageView, options]);

  return track;
};
