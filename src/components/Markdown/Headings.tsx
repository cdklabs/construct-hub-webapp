import { LinkIcon } from "@chakra-ui/icons";
import { Flex, Heading, As } from "@chakra-ui/react";
import { Children, FunctionComponent, ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { sanitize } from "../../util/sanitize-anchor";
import { NavLink } from "../NavLink";

interface HeadingResolverProps {
  level: number;
  children: ReactNode;
}

/**
 * Extracts the string leaves from the provided ReactNode.
 *
 * @param node the node from which string data should be fetched.
 *
 * @returns the visible string content from the node.
 */
const stringContent = (node: ReactNode): string => {
  return Children.toArray(node)
    .reduce((acc: string, child) => {
      if (typeof child === "string") {
        return acc + child;
      }
      if (typeof child === "object" && "props" in child) {
        return acc + stringContent(child.props.children);
      }
      return acc;
    }, "")
    .trim();
};

const HeadingLink: FunctionComponent<{
  id: string;
  level: number;
  title: string;
}> = ({ id, level, title }) => (
  <NavLink
    _active={{ visibility: "initial" }}
    _focus={{ visibility: "initial" }}
    alignItems="center"
    data-heading-id={`#${id}`}
    data-heading-level={level}
    data-heading-title={title}
    display="flex"
    id={id}
    lineHeight={1}
    opacity="hidden"
    replace
    to={`#${id}`}
    visibility="hidden"
  >
    <LinkIcon boxSize={4} />
  </NavLink>
);

export const Headings: FunctionComponent<HeadingResolverProps> = ({
  level,
  children,
}) => {
  const size: string = ["2xl", "xl", "lg", "md", "sm", "xs"][level - 1];
  const elem = `h${level}` as As<any>;

  // Use DOMParser to look for data attribute for link ID
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    ReactDOMServer.renderToStaticMarkup(children as React.ReactElement),
    "text/html"
  );

  const dataElement = doc.querySelector(
    "span[data-heading-title][data-heading-id]"
  ) as HTMLElement;
  const title = dataElement?.dataset.headingTitle ?? stringContent(children);

  const id = dataElement?.dataset.headingId ?? sanitize(title);

  return (
    <Flex
      _hover={{
        "> a": {
          visibility: "initial",
        },
      }}
      align="stretch"
      borderBottom="base"
      justify="space-between"
      mb={4}
      mt={level >= 4 ? "1.5em" : 4}
      px={level >= 4 ? 2 : undefined}
      py={2}
    >
      <Heading
        as={elem}
        color="textPrimary"
        level={level}
        size={size}
        sx={{ "> code": { fontSize: "inherit" } }}
      >
        {children}
      </Heading>

      <HeadingLink id={id} level={level} title={title} />
    </Flex>
  );
};
