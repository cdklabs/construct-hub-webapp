import { Box } from "@chakra-ui/react";
import ReactMarkdown from "@uiw/react-markdown-preview";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

export interface PackageDocsProps {
  readme: string;
}

export function PackageDocs({ readme }: PackageDocsProps) {
  return (
    <Box width="100%">
      <ReactMarkdown skipHtml components={ChakraUIRenderer()} source={readme} />
    </Box>
  );
}
