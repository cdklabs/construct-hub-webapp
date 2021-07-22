import { FunctionComponent, useEffect } from "react";
import { pageInfo } from "../../constants/pageInfo";
import { usePageView } from "../../contexts/Analytics";

export interface PageProps {
  pageName: keyof typeof pageInfo;
  hasAnalytics?: boolean; // Enables pageview tracking. Defaults to `true`
}

export const Page: FunctionComponent<PageProps> = ({
  children,
  hasAnalytics = true,
  pageName,
}) => {
  const trackPageView = usePageView(pageInfo[pageName]);

  useEffect(() => {
    if (hasAnalytics) {
      trackPageView();
    }
  }, [hasAnalytics, trackPageView]);

  return <>{children}</>;
};
