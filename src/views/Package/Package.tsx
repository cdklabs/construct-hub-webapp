import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchMarkdown } from "../../api/package/docs";
import { fetchMetadata } from "../../api/package/metadata";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest } from "../../hooks/useRequest";
import { LanguageSelection } from "./components/LanguageSelection";
import { PackageDetails } from "./components/PackageDetails";
import { PackageDocs } from "./components/PackageDocs";

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
    void requestMarkdown(name, version, language, scope, submodule);
    void requestAssembly(name, version, scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, scope, version, language]);

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
      <Box px={4}>
        {assemblyResponse.data && (
          <LanguageSelection assembly={assemblyResponse.data} />
        )}
      </Box>
      {/* Readme and Api Reference Area */}
      {markdownResponse.data &&
        !markdownResponse.loading &&
        assemblyResponse.data &&
        !assemblyResponse.loading && (
          <PackageDocs
            assembly={assemblyResponse.data}
            markdown={markdownResponse.data}
          />
        )}
    </Stack>
  );
};
