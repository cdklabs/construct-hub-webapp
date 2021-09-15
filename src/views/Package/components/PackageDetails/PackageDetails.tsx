import { Center, Divider, Flex, Grid, Spinner, Stack } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent } from "react";
import { Config } from "../../../../api/config";
import type { Metadata } from "../../../../api/package/metadata";
import { Card } from "../../../../components/Card";
import type { UseRequestResponse } from "../../../../hooks/useRequest";
import { LanguageSelection } from "../LanguageSelection";
import { OperatorArea } from "../OperatorArea";
import { PackageHeader } from "../PackageHeader";
import { UseConstruct } from "../UseConstruct";

interface PackageDetailsProps {
  config: UseRequestResponse<Config>;
  assembly: UseRequestResponse<Assembly>;
  metadata: UseRequestResponse<Metadata>;
  version: string;
}

/**
 * Renders the header section of a package. This includes
 * the Getting Started, Operator Area, and Publisher Area sections
 */
export const PackageDetails: FunctionComponent<PackageDetailsProps> = ({
  assembly,
  config,
  metadata,
  version,
}) => {
  const isLoading = assembly.loading || metadata.loading;

  if (isLoading || !assembly.data || !metadata.data) {
    return (
      <Center minH="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex as={Card} direction="column">
      <Grid
        gap={4}
        overflow="hidden"
        templateColumns={{ base: "1fr", md: "3fr auto 2fr" }}
        templateRows="auto"
      >
        <PackageHeader
          description={assembly.data.description}
          tags={assembly.data.keywords ?? []}
          title={assembly.data.name}
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
        {config.loading ? (
          <Center minH="200px">
            <Spinner size="xl" />
          </Center>
        ) : (
          <OperatorArea
            assembly={assembly.data}
            linksConfig={config.data?.packageLinks}
            metadata={metadata.data}
          />
        )}
      </Grid>
      <Stack
        align="center"
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        px={2}
        py={4}
        spacing={4}
      >
        <Stack direction="row" spacing={2}>
          <LanguageSelection assembly={assembly.data} />
        </Stack>
        <UseConstruct assembly={assembly.data} />
      </Stack>
    </Flex>
  );
};
