import { Box } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMarkdown, fetchAssembly } from "../../api/package/assemblies";
import { fetchMetadata } from "../../api/package/metadata";
import { PackageDetails } from "../../components/PackageDetails";
import { PackageDocs } from "../../components/PackageDocs";
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

  useEffect(() => {
    void requestMetadata(name, version, scope);
    void requestMarkdown(name, version, scope);
    void requestAssembly(name, version, scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, scope, version]);

  return (
    <Box w="100%">
      {/* Operator Area */}
      <PackageDetails
        assembly={assemblyResponse}
        metadata={metadataResponse}
        version={version}
      />
      {/* Readme and Api Reference Area */}
      {markdownResponse.data && !markdownResponse.loading && (
        <PackageDocs markdown={markdownResponse.data} />
      )}
    </Box>
  );
};
