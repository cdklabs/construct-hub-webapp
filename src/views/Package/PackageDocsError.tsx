import { FunctionComponent } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";
import { DocsError } from "./DocsError";
import { usePackageState } from "./PackageState";

export const PackageDocsError: FunctionComponent = () => {
  const { language } = usePackageState();

  const issueLink = (
    <ExternalLink href={`${CONSTRUCT_HUB_REPO_URL}/issues/new`}>
      issue
    </ExternalLink>
  );
  return (
    <DocsError>
      Documentation in {language} is still not ready for this package. Come back
      soon. If this issue persists, please let us know by creating an{" "}
      {issueLink}.
    </DocsError>
  );
};
