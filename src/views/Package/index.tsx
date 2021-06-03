import { Box } from "@chakra-ui/react";
import * as reflect from "jsii-reflect";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createAssembly, getFullPackageName } from "../../api/package";
import { PackageDetails, PackageDocs, PackageHeader } from "../../components";
import { parseSearch } from "../../utils/url";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

interface PackageDocsHomeState {
  assembly?: reflect.Assembly;
  error?: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();
  const [{ assembly }, setState] = useState<PackageDocsHomeState>({});
  const q = parseSearch(useLocation().search);

  useEffect(() => {
    createAssembly(name, version, scope)
      .then((asm: reflect.Assembly) => {
        setState({ assembly: asm });
      })
      .catch((err) => {
        console.error(err);
        setState((s) => ({ ...s, error: err }));
      });
  }, []);

  // TODO: The rendered content from this component is dependent on an assembly being defined.
  // If there isn't one, it would likely be a good idea to display an error or notfound so that we don't render blank content
  return (
    <Box w="100%">
      {/* Operator Area */}
      {assembly && (
        <>
          <PackageHeader
            title={getFullPackageName(name, scope)}
            description={assembly?.description}
            tags={[]}
          />
          <PackageDetails />
        </>
      )}

      {/* Readme and Api Reference Area */}
      {assembly && (
        <PackageDocs
          assembly={assembly}
          language={q.language ?? "python"}
          submodule={q.submodule}
        />
      )}
    </Box>
  );
}
