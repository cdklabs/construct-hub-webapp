import { Box, HTMLChakraProps, Link, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ExternalLink } from "../ExternalLink";

type AnchorComponent = FunctionComponent<HTMLChakraProps<"a">>;

export const A: AnchorComponent = ({ children, href, ...linkProps }) => {
  let Component: AnchorComponent = Link;

  try {
    if (href && href.startsWith("http")) {
      const hostname = new URL(href).hostname;

      if (hostname !== window.location.hostname) {
        const External: AnchorComponent = (props) => (
          <ExternalLink {...props} />
        );

        Component = External;
      }
    }
  } catch {
    Component = Link;
  }

  return (
    <Component
      color="blue.500"
      href={href}
      // If we are rendering an img within the link (specifically stability banners),
      // do not display the external link Icon
      sx={{ "> img + svg": { display: "none" } }}
      {...linkProps}
    >
      {children}
    </Component>
  );
};

export const Blockquote: FunctionComponent = ({ children }) => (
  <Box
    as="blockquote"
    borderLeft="5px solid"
    borderLeftColor="gray.100"
    marginTop="2em"
    marginX="0.5em"
    px="1em"
    wordBreak="break-word"
  >
    {children}
  </Box>
);

export const Em: FunctionComponent = ({ children }) => (
  <Box as="em" color="gray.600" fontStyle="normal" fontWeight="semibold">
    {children}
  </Box>
);

export const P: FunctionComponent = ({ children }) => (
  <Text lineHeight="1.5" marginBottom="2em" marginTop="1em" marginX="0.5em">
    {children}
  </Text>
);

export const Pre: FunctionComponent = ({ children }) => (
  <Box as="pre">{children}</Box>
);

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
    color = "orange.500";
  } else if (text === "Optional") {
    color = "green.500";
  }

  return (
    <Box as="sup" color={color} ml={2} top={-1}>
      {children}
    </Box>
  );
};
