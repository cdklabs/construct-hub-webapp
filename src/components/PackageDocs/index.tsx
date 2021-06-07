import { Box } from "@chakra-ui/react";
import ReactMarkdown from "@uiw/react-markdown-preview";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import type { Assembly } from "jsii-reflect";
import { Documentation } from "../../api/docgen/view/documentation";
import type { UseRequestResponse } from "../../hooks/useRequest";

export interface PackageDocsProps {
  assembly: UseRequestResponse<Assembly>;
  language: string;
  submodule?: string;
}

export function PackageDocs({
  assembly,
  language,
  submodule,
}: PackageDocsProps) {
  if (!assembly.data || assembly.loading) return null;

  const doc = new Documentation({
    assembly: assembly.data,
    language: language,
    submoduleName: submodule,
  });

  const source = doc.render().render();

  return (
    <Box width="100%">
      <ReactMarkdown skipHtml components={ChakraUIRenderer()} source={source} />
    </Box>
  );
}
