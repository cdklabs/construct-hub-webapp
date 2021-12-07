import {
  useContext,
  useCallback,
  useRef,
  createContext,
  FunctionComponent,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { ClickEventConfig, PageViewConfig } from "./types";
import { clickEvent } from "./util";

export interface AnalyticsAPI {
  trackCustomEvent: (opts: ClickEventConfig) => void;
  trackPageView: (opts: PageViewConfig) => void;
}

const AnalyticsContext = createContext<AnalyticsAPI>({
  trackCustomEvent: () => {},
  trackPageView: () => {},
});

const dispatchAnalyticsEvent = (
  detail: PageViewConfig | ClickEventConfig,
  cb?: () => void
) => {
  window?.AWSMA?.ready?.(() => {
    if (process.env.NODE_ENV === "development") {
      console.info(detail.event.name, detail);
    }
    document.dispatchEvent(
      new CustomEvent(window.AWSMA.TRIGGER_EVENT, { detail })
    );

    cb?.();
  });
};

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider: FunctionComponent = ({ children }) => {
  const { pathname } = useLocation();

  const prevPath = useRef<null | string>(null);

  const trackPageView: AnalyticsAPI["trackPageView"] = useCallback(
    (opts) => {
      if (prevPath.current === pathname) {
        return;
      }

      dispatchAnalyticsEvent(opts, () => {
        prevPath.current = pathname;
      });
    },
    [pathname]
  );

  // Tracks click events for elements with a `data-event` attr or elements which are nested within a data-event item
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (e.target) {
        let eventName: string | null = null;
        let target: HTMLElement | null = e.target as HTMLElement;

        while (target && !eventName) {
          if (target.hasAttribute?.("data-event")) {
            eventName = target.getAttribute?.("data-event");
          } else if (target.parentElement) {
            target = target.parentElement;
          } else {
            target = null;
          }
        }

        if (eventName) {
          dispatchAnalyticsEvent(clickEvent({ name: eventName }));
        }
      }
    };

    window.addEventListener("click", listener);

    return () => window.removeEventListener("click", listener);
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ trackPageView, trackCustomEvent: dispatchAnalyticsEvent }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
