import { Box } from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import { FunctionComponent } from "react";
import ReactMarkdown, { PluggableList } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Code } from "./Code";
import { Headings } from "./Headings";
import { Hr } from "./Hr";
import { Img } from "./Img";
import { Ul, Ol, Li } from "./List";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "./Table";
import { A, Blockquote, Em, P, Pre, Sup } from "./Text";
import { ExperimentalMarkdownRenderer } from "./ExperimentalMd";

const components = {
  a: A,
  blockquote: Blockquote,
  caption: TableCaption,
  code: Code,
  em: Em,
  h1: Headings,
  h2: Headings,
  h3: Headings,
  h4: Headings,
  h5: Headings,
  h6: Headings,
  hr: Hr,
  img: Img,
  li: Li,
  ol: Ol,
  p: P,
  pre: Pre,
  sup: Sup,
  table: Table,
  tbody: Tbody,
  td: Td,
  tfoot: Tfoot,
  th: Th,
  thead: Thead,
  tr: Tr,
  ul: Ul,
};

// see https://github.com/rehypejs/rehype-sanitize#use
// eslint-disable-next-line @typescript-eslint/no-require-imports
var ghSchema = require("hast-util-sanitize/lib/github");

// jsii-docgen adds these attributes to <span> elements embedded inside
// headings in order to configure custom anchor ids.
// tell rehype not to strip those out.
ghSchema.attributes.span = (ghSchema.attributes.span ?? []).concat([
  "dataHeadingTitle",
  "dataHeadingId",
]);

// Note - the default schema for rehypeSanitize is GitHub-style, which is what we need!
const rehypePlugins: PluggableList = [
  [rehypeRaw],
  // ALWAYS keep rehypeSanitize LAST!
  [rehypeSanitize, ghSchema],
];
const remarkPlugins = [remarkGfm];

const GITHUB_REPO_REGEX =
  /^(?:(?:git@)?github\.com:|(?:https?:\/\/)github\.com\/)([^/]+)\/([^/]+)(?:\.git)?$/;

/**
 * Parses out a GitHub repository owner and repo name from the `repository`
 * configuration of a jsii Assembly.
 *
 * @returns the `owner` and `repo` for the configured repository, if it looks
 *          like a GitHub repository URL.
 */
const parseGitHubRepository = ({ type, url }: Assembly["repository"]) => {
  if (type !== "git") {
    return undefined;
  }
  // git@github.com:<owner>/<repo>.git
  // https://github.com/<owner>/<repo>.git
  const match = GITHUB_REPO_REGEX.exec(url);
  if (match == null) {
    return undefined;
  }

  const [, owner, repo] = match;
  return { owner, repo };
};

export const Markdown: FunctionComponent<{
  children: string;
  repository: Assembly["repository"];
}> = ({ children, repository }) => {
  const repoConfig = parseGitHubRepository(repository);

  const toAbsoluteUri = (githubPrefix: string, githubSuffix = "HEAD") =>
    repoConfig == null
      ? ReactMarkdown.uriTransformer
      : (uri: string) => {
          const url = ReactMarkdown.uriTransformer(uri);

          // If this is an anchor or absolute URL, return it.
          const [first] = url;
          if (first === "#" || first === "/") {
            return url;
          }

          // If there is a protocol element, then return the URL as-is.
          if (url.includes("://")) {
            return url;
          }

          const owner = repoConfig.owner;
          const repo = repoConfig.repo.replace(/\.git$/, "");
          return `https://${githubPrefix}/${owner}/${repo}/${githubSuffix}/${url}`;
        };

  return (
    <Box sx={{ "& > *": { mb: 4 }, "& > :first-child": { mt: 0 } }}>
      <ExperimentalMarkdownRenderer
        components={components}
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins}
        transformImageUri={toAbsoluteUri("raw.githubusercontent.com")}
        transformLinkUri={toAbsoluteUri("github.com", "blob/HEAD")}
      >
        {children}
      </ExperimentalMarkdownRenderer>
    </Box>
  );
};
