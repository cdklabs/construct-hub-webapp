import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const rehypePlugins = [rehypeRaw];

const components = ChakraUIRenderer({});

export const Markdown: FunctionComponent<{ children: string }> = ({
  children,
}) => {
  return (
    <ReactMarkdown components={components} rehypePlugins={rehypePlugins}>
      {children}
    </ReactMarkdown>
  );
};
