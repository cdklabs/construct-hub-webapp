import { FunctionComponent } from "react";
import { ExternalLink } from "../../components/ExternalLink";

export interface FAQLinkProps {
  href: string;
}

export const FAQLink: FunctionComponent<FAQLinkProps> = ({
  href,
  children,
}) => (
  <ExternalLink
    color="inherit"
    hasWarning={false}
    href={href}
    textDecoration="underline"
  >
    {children}
  </ExternalLink>
);
