import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createAssembly } from "../../api/package/assemblies";
import { fetchMetadata } from "../../api/package/metadata";
import { parseSearch } from "../../api/package/util";
import { PackageDetails } from "../../components/PackageDetails";
import { PackageDocs } from "../../components/PackageDocs";
import { useRequest } from "../../hooks/useRequest";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();
  const [requestAssembly, assemblyResponse] = useRequest(createAssembly);
  const [requestMetadata, metadataResponse] = useRequest(fetchMetadata);
  const q = parseSearch(useLocation().search);

  useEffect(() => {
    void requestAssembly(name, version, scope);
    void requestMetadata(name, version, scope);
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
      <PackageDocs
        assembly={assemblyResponse}
        language={q.language ?? "python"}
        submodule={q.submodule}
      />
    </Box>
  );
}
