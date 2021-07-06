import { LinkIcon } from "@chakra-ui/icons";
import { Heading, As } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Children, FunctionComponent, ReactNode, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { sanitize } from "../../../../util/sanitize-anchor";

type HeadingResolverProps = {
  level: number;
  children: ReactNode;
};

const Headings: FunctionComponent<HeadingResolverProps> = ({
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
  const title =
    dataElement?.dataset.headingTitle ??
    Children.toArray(children)
      .reduce((accum: string, child): string => {
        if (typeof child === "string") {
          return `${accum}${child}`;
        }
        return accum;
      }, "")
      .trim();

  const id = dataElement?.dataset.headingId ?? sanitize(title);

  return (
    <Heading as={elem} level={level} my={4} size={size}>
      {level < 100 && (
        <a
          data-heading-id={id}
          data-heading-level={level}
          data-heading-title={title}
          href={`#${id}`}
          id={id}
        >
          <LinkIcon color="gray.500" h={4} mr={2} w={4} />
        </a>
      )}
      {children}
    </Heading>
  );
};

const components = ChakraUIRenderer({
  h1: Headings,
  h2: Headings,
  h3: Headings,
  h4: Headings,
  h5: Headings,
  h6: Headings,
});

const rehypePlugins = [rehypeRaw];

export const Body: FunctionComponent<{ children: string }> = ({ children }) => {
  const body = useMemo(() => {
    return (
      <ReactMarkdown components={components} rehypePlugins={rehypePlugins}>
        {children}
      </ReactMarkdown>
    );
  }, [children]);

  return body;
};
