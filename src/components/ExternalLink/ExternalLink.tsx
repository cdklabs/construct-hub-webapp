import { ExternalLinkIcon } from "@chakra-ui/icons";
import { forwardRef, Link, LinkProps } from "@chakra-ui/react";
import { useExternalLinkWarning } from "../../contexts/ExternalLinkWarning";

export interface ExternalLinkProps extends LinkProps {
  /**
   * Shows an external link icon. `true` by default
   */
  hasIcon?: boolean;
  /**
   * Prompts the user to confirm leaving the site. `true` by default
   */
  hasWarning?: boolean;
}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">(
  (
    { children, hasIcon = true, hasWarning = true, href, onClick, ...props },
    ref
  ) => {
    const withPrompt = useExternalLinkWarning();

    return (
      <Link
        color="blue.500"
        href={href}
        isExternal
        onClick={hasWarning ? withPrompt({ href, onClick }) : onClick}
        ref={ref}
        {...props}
      >
        {children} {hasIcon && <ExternalLinkIcon mb={1} />}
      </Link>
    );
  }
);

ExternalLink.displayName = "ExternalLink";
