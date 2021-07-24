import { Box, Stack, Text } from "@chakra-ui/react";
import * as spec from "@jsii/spec";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchMarkdown } from "../../api/package/docs";
import { fetchMetadata } from "../../api/package/metadata";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";
import { NotFound } from "../NotFound";
import { PackageDetails } from "./components/PackageDetails";
import { PackageDocs } from "./components/PackageDocs";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

const docsOrError = (
  markdown: UseRequestResponse<string>,
  assembly: UseRequestResponse<spec.Assembly>,
  language: string
) => {
  if (markdown.error || assembly.error) {
    return (
      <Text
        align="center"
        fontSize="xl"
        fontStyle="oblique"
        wordBreak="break-word"
      >
        Oops, Looks like {language} documentation is not available yet. Checkout
        other languages in the meantime!
      </Text>
    );
  }

  if (markdown.loading || assembly.loading) {
    return null;
  }

  if (!markdown.data || !assembly.data) {
    return null;
  }

  return <PackageDocs assembly={assembly.data} markdown={markdown.data} />;
};

export const Package: FunctionComponent = () => {
  const { name, scope, version }: PathParams = useParams();
  const [requestMarkdown, markdownResponse] = useRequest(fetchMarkdown);
  const [requestAssembly, assemblyResponse] = useRequest(fetchAssembly);
  const [requestMetadata, metadataResponse] = useRequest(fetchMetadata);

  const q = useQueryParams();
  const [language] = useLanguage();
  const submodule = q.get(QUERY_PARAMS.SUBMODULE) ?? "";

  useEffect(() => {
    void requestMetadata(name, version, scope);
    void requestAssembly(name, version, scope);
  }, [name, requestAssembly, requestMetadata, scope, version]);

  useEffect(() => {
    void requestMarkdown(name, version, language, scope, submodule);
  }, [name, scope, version, language, submodule, requestMarkdown]);

  // Handle missing JSON for assembly
  if (assemblyResponse.error) {
    return <NotFound />;
  }

  return (
    <Stack maxW="100vw" pt={4} spacing={4}>
      {/* Operator Area */}
      <Box px={4}>
        <PackageDetails
          assembly={assemblyResponse}
          metadata={metadataResponse}
          version={version}
        />
      </Box>
      {/* Readme and Api Reference Area */}
      {docsOrError(markdownResponse, assemblyResponse, language)}
    </Stack>
  );
};
