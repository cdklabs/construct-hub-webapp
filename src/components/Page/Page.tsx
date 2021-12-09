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

// Should be the same as the "real" CSP, except most things come from HTTP
// instead of HTTPS (because it is protocol-relative, and the dev site is
// served over plain HTTP).
const csp = [
  "default-src 'self' 'unsafe-inline' http://*.awsstatic.com;",
  "connect-src 'self' https://*.shortbread.aws.dev http://*.shortbread.aws.dev http://a0.awsstatic.com/ http://amazonwebservices.d2.sc.omtrdc.net http://aws.demdex.net http://dpm.demdex.net http://cm.everesttech.net;",
  "frame-src http://aws.demdex.net http://dpm.demdex.net;",
  "img-src 'self' https://* http://a0.awsstatic.com/ http://amazonwebservices.d2.sc.omtrdc.net http://aws.demdex.net http://dpm.demdex.net http://cm.everesttech.net;",
  "object-src 'none';",
  "style-src 'self' 'unsafe-inline';",
].join(" ");

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
          <meta content={csp} httpEquiv="Content-Security-Policy" />
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
