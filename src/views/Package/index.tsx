import { Box } from "@chakra-ui/react";
import * as reflect from "jsii-reflect";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createAssembly, fetchMetadata, Metadata } from "../../api/package";
import { PackageDetails } from "../../components/PackageDetails";
import { PackageDocs } from "../../components/PackageDocs";
import { useRequest } from "../../hooks/useRequest";
import { parseSearch } from "../../utils/url";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();

  const [requestMetadata, metadataResponse] = useRequest<Metadata>(() =>
    fetchMetadata(name, version, scope)
  );

  const [requestAssembly, assemblyResponse] = useRequest<reflect.Assembly>(() =>
    createAssembly(name, version, scope)
  );
  const q = parseSearch(useLocation().search);

  useEffect(() => {
    void requestMetadata();
    void requestAssembly();
  }, []);

  // TODO: If there isn't an assembly, we have nothing to show. Show an error?
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
