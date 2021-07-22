import { ExternalLinkIcon } from "@chakra-ui/icons";
import { forwardRef, Link, LinkProps } from "@chakra-ui/react";

export interface ExternalLinkProps extends LinkProps {
  hasIcon?: boolean;
}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">(
  ({ hasIcon = true, children, ...props }, ref) => {
    return (
      <Link
        color="blue.500"
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children} {hasIcon && <ExternalLinkIcon mb={1} />}
      </Link>
    );
  }
);

ExternalLink.displayName = "ExternalLink";
