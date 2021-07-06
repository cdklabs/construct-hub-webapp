import { Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAssembly } from "../../api/package/assemblies";
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
  const [requestAssembly, assemblyResponse] = useRequest(createAssembly);
  const [requestMetadata, metadataResponse] = useRequest(fetchMetadata);
  const q = useQueryParams();
  const [language] = useLanguage();

  useEffect(() => {
    void requestMetadata(name, version, scope);
    void requestAssembly(name, version, scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, scope, version]);

  return (
    <Stack p={4} spacing={4} w="100%">
      {/* Operator Area */}
      <PackageDetails
        assembly={assemblyResponse}
        metadata={metadataResponse}
        version={version}
      />
      {assemblyResponse.data && (
        <LanguageSelection assembly={assemblyResponse.data} />
      )}
      {/* Readme and Api Reference Area */}
      {assemblyResponse.data && !assemblyResponse.loading && (
        <PackageDocs
          assembly={assemblyResponse.data}
          language={language}
          submodule={q.get(QUERY_PARAMS.SUBMODULE) ?? ""}
        />
      )}
    </Stack>
  );
};
