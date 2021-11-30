import {
  Box,
  Flex,
  FlexProps,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import type { Language as PrismLanguage } from "prism-react-renderer";
import type { FunctionComponent } from "react";
import { Code } from "../../../components/Code";
import { Language } from "../../../constants/languages";
import { usePackageState } from "../PackageState";
import { ToggleButton } from "./ToggleButton";

const getCodeSample = ({
  language,
  assembly,
}: {
  language: Language;
  assembly: Assembly;
}): string | undefined => {
  const version = assembly.version;
  if (language === Language.TypeScript) {
    const packageName = assembly.name;

    return `npm install ${packageName}@${version}`;
  } else if (language === Language.Python) {
    const packageName = assembly.targets?.python?.distName;

    if (!packageName) {
      return undefined;
    }

    return `pip install ${packageName}==${version}`;
  } else if (language === Language.Java) {
    const groupId = assembly.targets?.java?.maven?.groupId;
    const artifactId = assembly.targets?.java?.maven?.artifactId;

    if (!groupId || !artifactId) return undefined;

    return [
      "// add this to your pom.xml",
      "<dependency>",
      `    <groupId>${groupId}</groupId>`,
      `    <artifactId>${artifactId}</artifactId>`,
      `    <version>${version}</version>`,
      "</dependency>",
    ].join("\n");
  } else if (language === Language.DotNet) {
    const packageId = assembly.targets?.dotnet?.packageId;
    if (!packageId) return undefined;
    return `dotnet add package ${packageId} --version ${version}`;
  }

  return undefined;
};

export const Install: FunctionComponent<FlexProps> = (props) => {
  const {
    language,
    assembly: { data: assembly },
  } = usePackageState();

  const collapse = useDisclosure();

  if (!assembly) return null;

  const code = getCodeSample({ language, assembly });

  if (!code || !language) return null;

  return (
    <Flex
      align="start"
      direction="column"
      fontSize=".75rem"
      w="full"
      {...props}
    >
      {language === Language.Java ? (
        <>
          <ToggleButton
            closeText="Hide"
            fontSize="inherit"
            isOpen={collapse.isOpen}
            mt={2}
            onClick={collapse.onToggle}
            openText="Install"
          />
          <Box maxW="full" overflow="hidden">
            <Collapse in={collapse.isOpen}>
              <Code
                boxShadow="none"
                code={code}
                fontSize="inherit"
                language={language as PrismLanguage}
                mt={2}
              />
            </Collapse>
          </Box>
        </>
      ) : (
        <Code
          boxShadow="none"
          code={code}
          fontSize="inherit"
          language={language as PrismLanguage}
          lineHeight="2"
          w="full"
        />
      )}
    </Flex>
  );
};
