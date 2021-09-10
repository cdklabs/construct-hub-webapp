import { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet";
import { pageInfo } from "../../constants/pageInfo";
import { usePageView } from "../../contexts/Analytics";

export interface PageProps {
  pageName: keyof typeof pageInfo;
  meta: {
    suffix?: boolean;
    title: string;
    description: string;
  };
}

export const Page: FunctionComponent<PageProps> = ({
  children,
  meta,
  pageName,
}) => {
  const trackPageView = usePageView(pageInfo[pageName]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const { suffix = true, title, description } = meta;
  const formattedTitle = suffix ? `${title} - Construct Hub` : title;

  return (
    <>
      <Helmet>
        <title>{formattedTitle}</title>
        <meta content={formattedTitle} property="og:title" />
        <meta content={formattedTitle} name="twitter:title" />
        <meta content="summary" name="twitter:card" />

        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content={description} name="twitter:description" />
      </Helmet>
      {children}
    </>
  );
};
