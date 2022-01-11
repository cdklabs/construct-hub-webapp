import { FunctionComponent } from "react";
import { Markdown } from "../../components/Markdown";
import { DocsError } from "./DocsError";
import { usePackageState } from "./PackageState";

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
