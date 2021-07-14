import { Box } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Code } from "./Code";
import { Headings } from "./Headings";
import { Hr } from "./Hr";
import { Ul, Ol, Li } from "./List";
import { A, Blockquote, Em, P, Pre, Sup } from "./Text";

const components = ChakraUIRenderer(
  {
    a: A,
    blockquote: Blockquote,
    code: Code,
    em: Em,
    h1: Headings,
    h2: Headings,
    h3: Headings,
    h4: Headings,
    h5: Headings,
    h6: Headings,
    hr: Hr,
    li: Li,
    ol: Ol,
    p: P,
    pre: Pre,
    sup: Sup,
    ul: Ul,
  },
  true
);

const rehypePlugins = [rehypeRaw];

export const Markdown: FunctionComponent<{ children: string }> = ({
  children,
}) => {
  return (
    <Box sx={{ "& > *": { mb: 4 } }}>
      <ReactMarkdown components={components} rehypePlugins={rehypePlugins}>
        {children}
      </ReactMarkdown>
    </Box>
  );
};
