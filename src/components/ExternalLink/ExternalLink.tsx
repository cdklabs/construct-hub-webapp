import { forwardRef, Link, LinkProps } from "@chakra-ui/react";

export interface ExternalLinkProps extends LinkProps {}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">((props, ref) => {
  return (
    <Link
      color="blue.500"
      ref={ref}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    />
  );
});

ExternalLink.displayName = "ExternalLink";
