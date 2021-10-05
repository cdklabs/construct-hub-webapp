import { ROUTES } from "../../constants/url";

export type Link = {
  display: string;
  url: string;
  testId: string;
  isExternal?: boolean;
};

export const FOOTER_LINKS: Record<string, Link> = {
  SERVICE_TERMS: {
    display: "AWS Service Terms",
    url: "https://aws.amazon.com/service-terms/",
    testId: "service-terms",
  },
  PRIVACY: {
    display: "Privacy",
    url: "https://aws.amazon.com/privacy/",
    testId: "privacy",
  },
  SITE_TERMS: {
    display: "Construct Hub Site Terms",
    url: ROUTES.SITE_TERMS,
    testId: "site-terms",
    isExternal: false,
  },
  LEGAL: {
    display: "Legal",
    url: "https://aws.amazon.com/legal/",
    testId: "legal",
  },
} as const;

export const DISCLAIMER = "2021 Amazon Web Services, Inc. All rights reserved.";
