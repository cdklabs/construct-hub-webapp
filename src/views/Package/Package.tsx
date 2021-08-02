import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchMarkdown } from "../../api/package/docs";
import { fetchMetadata } from "../../api/package/metadata";
import { Page } from "../../components/Page";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest } from "../../hooks/useRequest";
import { NotFound } from "../NotFound";
import { PackageDetails } from "./components/PackageDetails";
import { PackageDocs } from "./components/PackageDocs";
import { PackageDocsError } from "./components/PackageDocsError";
import { PackageDocsUnsupported } from "./components/PackageDocsUnsupported/PackageDocsUnsupported";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

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

  const hasError = markdownResponse.error || assemblyResponse.error;
  const hasDocs =
    !markdownResponse.loading &&
    !assemblyResponse.loading &&
    markdownResponse.data &&
    assemblyResponse.data;
  // This will also be true if it cannot be verified (assembly not there)
  const isSupported =
    language === Language.TypeScript ||
    assemblyResponse.loading ||
    assemblyResponse.error ||
    assemblyResponse.data!.targets?.[language.toString()] != null;

  return (
    <Page pageName="packageProfile">
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
        {isSupported ? (
          hasError ? (
            <PackageDocsError language={language}></PackageDocsError>
          ) : (
            hasDocs && (
              <PackageDocs
                assembly={assemblyResponse.data!}
                markdown={markdownResponse.data!}
              />
            )
          )
        ) : (
          <PackageDocsUnsupported language={language}></PackageDocsUnsupported>
        )}
      </Stack>
    </Page>
  );
};
