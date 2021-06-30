import { forwardRef } from "@chakra-ui/react";
import { ExternalLink, ExternalLinkProps } from "../ExternalLink";
import { LICENSE_LINKS } from "./constants";

export interface LicenseLinkOptions {
  license: keyof typeof LICENSE_LINKS;
}

export interface LicenseLinkProps
  extends ExternalLinkProps,
    LicenseLinkOptions {}

export const LicenseLink = forwardRef<LicenseLinkProps, "a">(
  ({ license, ...linkProps }, ref) => {
    const url = LICENSE_LINKS[license];

    return (
      <ExternalLink href={url} ref={ref} {...linkProps}>
        {license}
      </ExternalLink>
    );
  }
);
