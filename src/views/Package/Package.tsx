import { Box, Stack } from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import Head from "next/head";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { PackageDetails } from "./components/PackageDetails";
import { PackageDocs } from "./components/PackageDocs";
import { PackageDocsError } from "./components/PackageDocsError";
import { PackageDocsUnsupported } from "./components/PackageDocsUnsupported";
import { Metadata } from "api/package/metadata";
import { Page } from "components/Page";
import { Language } from "constants/languages";
import { useLanguage } from "hooks/useLanguage";

export interface PackageProps {
  assembly: Assembly;
  markdown: string | null;
  metadata: Metadata;
}

export const Package: FunctionComponent<PackageProps> = ({
  assembly,
  markdown,
  metadata,
}) => {
  const {
    query: { version },
  } = useRouter();
  const [language] = useLanguage();

  const hasError = !assembly || !markdown;
  const hasDocs = assembly && markdown;
  // This will also be true if it cannot be verified (assembly not there)
  const isSupported =
    language === Language.TypeScript ||
    assembly?.targets?.[language.toString()] != null;

  return (
    <Page pageName="packageProfile">
      <Head>
        <title>
          {assembly.name}@{assembly.version} - Construct Hub
        </title>
        <meta
          content={
            assembly.description ||
            `View the ${assembly.name} construct on Construct Hub`
          }
          name="description"
        />
      </Head>
      <Stack maxW="100vw" pt={4} spacing={4}>
        {/* Operator Area */}
        <Box px={4}>
          <PackageDetails
            assembly={assembly}
            metadata={metadata}
            version={version as string}
          />
        </Box>
        {/* Readme and Api Reference Area */}
        {isSupported ? (
          hasError ? (
            <PackageDocsError language={language}></PackageDocsError>
          ) : (
            hasDocs && <PackageDocs assembly={assembly!} markdown={markdown!} />
          )
        ) : (
          <PackageDocsUnsupported language={language}></PackageDocsUnsupported>
        )}
      </Stack>
    </Page>
  );
};
