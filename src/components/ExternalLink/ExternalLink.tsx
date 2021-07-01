import { forwardRef, Link, LinkProps } from "@chakra-ui/react";

export interface ExternalLinkProps extends LinkProps {}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">((props, ref) => {
  return (
    <Link ref={ref} target="_blank" rel="noopener noreferrer" {...props} />
  );
});
