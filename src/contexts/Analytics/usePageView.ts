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
        pageURL: window.location.href.replace(
          "localhost:3000",
          "constructs.dev"
        ),
        ...opts.page,
      },
      event: {
        type: "pageview",
        name: opts.event.name,
        description: opts.event.description,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, opts]
  );

  const track = useCallback(() => {
    return trackPageView(options);
  }, [trackPageView, options]);

  return track;
};
