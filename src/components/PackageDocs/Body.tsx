import { LinkIcon } from "@chakra-ui/icons";
import { Heading, As } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import { sanitize } from "../../util/sanitize-anchor";

type HeadingResolverProps = {
  level: number;
  children: React.ReactNode;
};

function Headings({ level, children }: HeadingResolverProps) {
  const size: string = ["2xl", "xl", "lg", "md", "sm", "xs"][level - 1];
  const elem = `h${level}` as As<any>;

  // Use DOMParser to look for data attribute for link ID
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    React.Children.toArray(children).join(""),
    "text/html"
  );

  const dataElement = doc.querySelector(
    "span[data-heading-title][data-heading-id]"
  ) as HTMLElement;
  const title =
    dataElement?.dataset.headingTitle ??
    React.Children.toArray(children)
      .reduce((accum: string, child): string => {
        if (typeof child === "string") {
          return `${accum}${child}`;
        }
        return accum;
      }, "")
      .trim();
  const id = dataElement?.dataset.headingId ?? sanitize(title);

  return (
    <Heading my={4} level={level} as={elem} size={size}>
      {level < 4 && (
        <a
          data-heading-title={title}
          data-heading-id={id}
          data-heading-level={level}
          id={id}
          href={`#${id}`}
        >
          <LinkIcon w={4} h={4} color="gray.500" mr={2} />
        </a>
      )}
      {children}
    </Heading>
  );
}

const components = ChakraUIRenderer({
  h1: Headings,
  h2: Headings,
  h3: Headings,
  h4: Headings,
  h5: Headings,
  h6: Headings,
});

export function Body({ children }: { children: string }) {
  return <ReactMarkdown skipHtml children={children} components={components} />;
}
