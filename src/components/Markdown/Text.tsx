import { Box, PropsOf, Text } from "@chakra-ui/react";
import { Language } from "prism-react-renderer";
import type { FunctionComponent } from "react";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import { Code } from "./Code";

type AnchorComponent = FunctionComponent<
  PropsOf<typeof NavLink> | PropsOf<typeof ExternalLink>
>;

export const A: AnchorComponent = ({ children, href, ...linkProps }) => {
  const sharedProps = {
    color: "link",
    // If we are rendering an img within the link (specifically stability banners),
    // do not display the external link Icon
    sx: { "> img + svg": { display: "none" } },
  };

  try {
    if (href && href.startsWith("http")) {
      // new URL() throws if the url is invalid
      const hostname = new URL(href).hostname;

      if (hostname !== window.location.hostname) {
        return (
          <ExternalLink href={href} {...sharedProps} {...linkProps}>
            {children}
          </ExternalLink>
        );
      }
    }
  } catch {}

  return (
    <NavLink to={href} {...sharedProps} {...linkProps}>
      {children}
    </NavLink>
  );
};

export const Blockquote: FunctionComponent = ({ children }) => (
  <Box
    as="blockquote"
    borderLeft="5px solid"
    borderLeftColor="borderColor"
    marginX="2"
    px="2"
    wordBreak="break-word"
  >
    {children}
  </Box>
);

export const Em: FunctionComponent = ({ children }) => (
  <Box as="em" fontStyle="normal" fontWeight="bold">
    {children}
  </Box>
);

export const P: FunctionComponent = ({ children }) => (
  <Text lineHeight="1.5" mx={2} my={4}>
    {children}
  </Text>
);

export const Pre: FunctionComponent<{ lang?: Language }> = ({
  children,
  lang,
}) => {
  if (lang) {
    return <Code language={lang}>{children}</Code>;
  }

  return <Box as="pre">{children}</Box>;
};

export const Sup: FunctionComponent = ({ children }) => {
  let color: string | undefined = undefined;
  let text = "";

  if (Array.isArray(children)) {
    const [first] = children;

    if (typeof first === "string") {
      text = first;
    }
  }

  if (text === "Required") {
    color = "orange.700";
  } else if (text === "Optional") {
    color = "green.700";
  }

  return (
    <Box as="sup" color={color} fontSize="xs" ml={-1} top={-1}>
      {children}
    </Box>
  );
};
