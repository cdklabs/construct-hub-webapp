import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Code } from "./Code";
import { Headings } from "./Headings";

const components = {
  h1: Headings,
  h2: Headings,
  h3: Headings,
  h4: Headings,
  h5: Headings,
  h6: Headings,
  code: Code,
};

const rehypePlugins = [rehypeRaw];

export const Markdown: FunctionComponent<{ children: string }> = ({
  children,
}) => {
  return (
    <ReactMarkdown components={components} rehypePlugins={rehypePlugins}>
      {children}
    </ReactMarkdown>
  );
};
