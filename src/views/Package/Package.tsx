import { Box } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMarkdown, fetchAssembly } from "../../api/package/assemblies";
import { fetchMetadata } from "../../api/package/metadata";
import { PackageDetails } from "../../components/PackageDetails";
import { PackageDocs } from "../../components/PackageDocs";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest } from "../../hooks/useRequest";

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
    void requestMarkdown(name, version, scope, language, submodule);
    void requestAssembly(name, version, scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, scope, version, language]);

  return (
    <Box w="100%">
      {/* Operator Area */}
      <PackageDetails
        assembly={assemblyResponse}
        metadata={metadataResponse}
        version={version}
      />
      {/* Readme and Api Reference Area */}
      {assemblyResponse.data &&
        !assemblyResponse.loading &&
        markdownResponse.data &&
        !markdownResponse.loading && (
          <PackageDocs
            assembly={assemblyResponse.data}
            markdown={markdownResponse.data}
          />
        )}
    </Box>
  );
};
