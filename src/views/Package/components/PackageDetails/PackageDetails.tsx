import { Divider, Flex, Grid, Stack } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent } from "react";
import { OperatorArea } from "../OperatorArea";
import { PackageHeader } from "../PackageHeader";
import { UseConstruct } from "../UseConstruct";
import type { Metadata } from "api/package/metadata";
import { Card } from "components/Card";
import { LanguageBar } from "components/LanguageBar";

interface PackageDetailsProps {
  assembly: Assembly;
  metadata: Metadata;
  version: string;
}

/**
 * Renders the header section of a package. This includes
 * the Getting Started, Operator Area, and Publisher Area sections
 */
export const PackageDetails: FunctionComponent<PackageDetailsProps> = ({
  assembly,
  metadata,
  version,
}) => {
  return (
    <Flex as={Card} direction="column">
      <Grid
        gap={4}
        overflow="hidden"
        templateColumns={{ base: "1fr", md: "3fr auto 2fr" }}
        templateRows="auto"
      >
        <PackageHeader
          description={assembly.description}
          tags={assembly.keywords ?? []}
          title={assembly.name}
          version={version}
        />
        <Divider
          display={{ base: "none", md: "initial" }}
          orientation="vertical"
        />
        <Divider
          display={{ base: "initial", md: "none" }}
          orientation="horizontal"
        />
        <OperatorArea assembly={assembly} metadata={metadata} />
      </Grid>
      <Stack
        align="center"
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        px={2}
        py={4}
        spacing={4}
      >
        <LanguageBar assembly={assembly} />
        <UseConstruct assembly={assembly} />
      </Stack>
    </Flex>
  );
};
