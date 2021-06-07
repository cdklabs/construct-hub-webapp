import { Center, Divider, Flex, Grid, Spinner } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import type { Metadata } from "../../api/package/metadata";
import type { UseRequestResponse } from "../../hooks/useRequest";
import { GettingStarted } from "../GettingStarted";
import { OperatorArea } from "../OperatorArea";
import { PublisherArea } from "../PublisherArea";

interface PackageDetailsProps {
  assembly: UseRequestResponse<Assembly>;
  metadata: UseRequestResponse<Metadata>;
  // Likely will be needed for version dropdown
  version: string;
}

/**
 * Renders the header section of a package. This includes
 * the Getting Started, Operator Area, and Publisher Area sections
 */
export function PackageDetails({ assembly, metadata }: PackageDetailsProps) {
  const targets: string[] = Object.keys(assembly.data?.targets ?? {});
  const isLoading = assembly.loading || metadata.loading;

  if (isLoading || !metadata.data) {
    return (
      <Center bg="gray.100" minH="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Grid
      bg="gray.100"
      borderBottom="1px solid"
      borderColor="gray.200"
      gap={2}
      pt={4}
      templateColumns="auto 1fr 1fr"
      templateRows="1fr"
    >
      {/* Where to get logo? empty div to preserve layout for now */}
      <div />
      <Flex direction="column">
        <PublisherArea metadata={metadata.data} />
        <Divider borderColor="initial" color="gray.300" my={5} />
        <OperatorArea assembly={assembly.data} metadata={metadata.data} />
      </Flex>
      <GettingStarted targets={targets} />
    </Grid>
  );
}
