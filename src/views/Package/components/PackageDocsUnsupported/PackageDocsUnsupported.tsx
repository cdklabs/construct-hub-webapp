import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Language, LANGUAGE_NAME_MAP } from "../../../../constants/languages";

export interface PackageDocsUnsupportedProps {
  readonly language: Language;
}

export const PackageDocsUnsupported: FunctionComponent<PackageDocsUnsupportedProps> =
  ({ language }) => {
    const languageName = LANGUAGE_NAME_MAP[language];
    return (
      <Text
        align="center"
        fontSize="xl"
        fontStyle="oblique"
        px={4}
        wordBreak="break-word"
      >
        This package does not currently support {languageName}. Select one of
        the supported languages above, or ask the author to add support for{" "}
        {languageName} in a future release.
      </Text>
    );
  };
