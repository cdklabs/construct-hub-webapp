import { FunctionComponent } from "react";
import { Markdown } from "../../components/Markdown";
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

  return <Markdown repository={assembly.repository}>{readme}</Markdown>;
};
