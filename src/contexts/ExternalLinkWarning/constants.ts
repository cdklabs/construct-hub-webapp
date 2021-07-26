import type { MouseEventHandler } from "react";

export interface ExternalLinkPromptOptions {
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type ExternalLinkPrompt = ({
  href,
  onClick,
}: ExternalLinkPromptOptions) => typeof onClick;

export const PREFERS_WARN_ON_EXTERNAL_LINK_CLICK =
  "prefersWarnOnExternalLinkClick";
