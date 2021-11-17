import { forwardRef } from "@chakra-ui/react";
import spdx from "spdx-license-list";
import { ExternalLink, ExternalLinkProps } from "../ExternalLink";

export interface LicenseLinkOptions {
  license: string;
}

export interface LicenseLinkProps
  extends ExternalLinkProps,
    LicenseLinkOptions {}

export const LicenseLink = forwardRef<LicenseLinkProps, "a">(
  ({ license, ...linkProps }, ref) => {
    const url = spdx[license].url;

    return (
      <ExternalLink href={url} ref={ref} {...linkProps}>
        {license}
      </ExternalLink>
    );
  }
);

LicenseLink.displayName = "LicenseLink";
