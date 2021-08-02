import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Language } from "../../../../constants/languages";

export interface PackageDocsUnsupportedProps {
  readonly language: Language;
}

export const PackageDocsUnsupported: FunctionComponent<PackageDocsUnsupportedProps> =
  ({ language }) => {
    return (
      <Text
        align="center"
        fontSize="xl"
        fontStyle="oblique"
        px={4}
        wordBreak="break-word"
      >
        This package does not support {language}. If you are interested to use
        this package in {language}, please contact the package author to request
        they publish a {language} version.
      </Text>
    );
  };
