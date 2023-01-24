import { FunctionComponent } from "react";
import { DocsError } from "./DocsError";
import { usePackageState } from "./PackageState";
import { LANGUAGE_NAME_MAP } from "../../constants/languages";

export const PackageDocsUnsupported: FunctionComponent = () => {
  const { language } = usePackageState();
  const languageName = LANGUAGE_NAME_MAP[language];
  return (
    <DocsError>
      This package does not currently support {languageName}. Select one of the
      supported languages above, or ask the author to add support for{" "}
      {languageName} in a future release.
    </DocsError>
  );
};
