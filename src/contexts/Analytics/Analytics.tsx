import {
  useContext,
  useCallback,
  useRef,
  createContext,
  FunctionComponent,
} from "react";
import { useLocation } from "react-router-dom";
import { PageViewConfig } from "./types";

export interface AnalyticsAPI {
  trackPageView: (opts: PageViewConfig) => void;
}

const AnalyticsContext = createContext<AnalyticsAPI>({
  trackPageView: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider: FunctionComponent = ({ children }) => {
  const { pathname } = useLocation();

  const prevPath = useRef<null | string>(null);

  const trackPageView = useCallback(
    (opts: PageViewConfig) => {
      if (prevPath.current === pathname) {
        return;
      }

      window?.AWSMA?.ready(() => {
        document.dispatchEvent(
          new CustomEvent(window.AWSMA.TRIGGER_EVENT, { detail: opts })
        );

        prevPath.current = pathname;
      });
    },
    [pathname]
  );

  return (
    <AnalyticsContext.Provider value={{ trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
