import { ExternalLinkIcon } from "@chakra-ui/icons";
import { forwardRef, Link, LinkProps } from "@chakra-ui/react";

export interface ExternalLinkProps extends LinkProps {
  hasIcon?: boolean;
}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">(
  ({ hasIcon = true, children, ...props }, ref) => {
    return (
      <Link color="blue.500" isExternal ref={ref} {...props}>
        {children} {hasIcon && <ExternalLinkIcon mb={1} />}
      </Link>
    );
  }
);

ExternalLink.displayName = "ExternalLink";
