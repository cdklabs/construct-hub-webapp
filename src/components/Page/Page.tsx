import { FunctionComponent, useEffect } from "react";
import { pageInfo } from "../../constants/pageInfo";
import { usePageView } from "../../contexts/Analytics";

export interface PageProps {
  pageName: keyof typeof pageInfo;
}

export const Page: FunctionComponent<PageProps> = ({ children, pageName }) => {
  const trackPageView = usePageView(pageInfo[pageName]);

  useEffect(() => {
    // trackPageView();
  }, [trackPageView]);

  return <>{children}</>;
};
