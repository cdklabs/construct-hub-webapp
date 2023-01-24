import { FunctionComponent } from "react";
import { DocsError } from "./DocsError";
import { usePackageState } from "./PackageState";
import { Markdown } from "../../components/Markdown";

export const PackageReadme: FunctionComponent = () => {
  const {
    isLoadingDocs,
    readme,
    assembly: { data: assembly },
  } = usePackageState();

  if (isLoadingDocs || !readme || !assembly) {
    return null;
  }

  if (readme === "\n") {
    return (
      <DocsError>No readme available for this module or submodule</DocsError>
    );
  }

  return <Markdown repository={assembly.repository}>{readme}</Markdown>;
};
