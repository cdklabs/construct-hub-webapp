import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { ExternalLink } from "components/ExternalLink";
import { Language } from "constants/languages";

export interface PackageDocsErrorProps {
  readonly language: Language;
}

export const PackageDocsError: FunctionComponent<PackageDocsErrorProps> = ({
  language,
}) => {
  const issueLink = (
    <ExternalLink href="https://github.com/cdklabs/construct-hub-webapp/issues/new">
      issue
    </ExternalLink>
  );
  return (
    <Text
      align="center"
      fontSize="xl"
      fontStyle="oblique"
      px={4}
      wordBreak="break-word"
    >
      Documentation in {language} is still not ready for this package. Come back
      soon. If this issue persists, please let us know by creating an{" "}
      {issueLink}.
    </Text>
  );
};
