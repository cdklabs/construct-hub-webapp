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
  /**
   * Adds the nofollow annotation to the anchor's rel attribute
   */
  noFollow?: boolean;
}

export const ExternalLink = forwardRef<ExternalLinkProps, "a">(
  (
    {
      children,
      hasIcon = true,
      hasWarning = true,
      href,
      onClick,
      noFollow,
      ...props
    },
    ref
  ) => {
    const withPrompt = useExternalLinkWarning();

    let rel = "noopener noreferrer";

    if (hasWarning || noFollow) {
      rel += " nofollow";
    }

    return (
      <Link
        color="blue.500"
        href={href}
        isExternal
        onClick={hasWarning ? withPrompt({ href, onClick }) : onClick}
        ref={ref}
        rel={rel}
        {...props}
      >
        {children} {hasIcon && <ExternalLinkIcon mb={1} ml={0} />}
      </Link>
    );
  }
);

ExternalLink.displayName = "ExternalLink";
