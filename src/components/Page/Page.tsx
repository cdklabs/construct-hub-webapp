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
        {process.env.NODE_ENV === "development" && (
          <meta
            content="default-src 'self' 'unsafe-inline' https://*.awsstatic.com https://amazonwebservices.d2.sc.omtrdc.net; connect-src 'self' https://*.shortbread.aws.dev ws://localhost:3000 https://*.awsstatic.com https://amazonwebservices.d2.sc.omtrdc.net; frame-src 'none'; img-src 'self' https://* http://*.omtrdc.net; object-src 'none'; style-src 'self' 'unsafe-inline';"
            httpEquiv="Content-Security-Policy"
          />
        )}

        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta charSet="utf-8" />

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
