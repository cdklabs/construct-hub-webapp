import { Center, Divider, Flex, Grid, Spinner } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import type { Metadata } from "../../api/package/metadata";
import { Language } from "../../constants/languages";
import type { UseRequestResponse } from "../../hooks/useRequest";
import { GettingStarted } from "../GettingStarted";
import { OperatorArea } from "../OperatorArea";
import { PackageHeader } from "../PackageHeader";

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
  const targets = Object.keys(assembly.data?.targets ?? {}) as Language[];
  const isLoading = assembly.loading || metadata.loading;

  if (isLoading || !metadata.data) {
    return (
      <Center bg="gray.100" minH="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Grid bg="gray.50" columnGap={4} p={4} templateColumns="2fr 1fr">
      <Flex direction="column">
        <PackageHeader
          description={metadata.data.description}
          tags={metadata.data.keywords}
          title={metadata.data.name}
        />
        <Divider borderColor="initial" color="gray.300" my={5} />
        <OperatorArea assembly={assembly.data} metadata={metadata.data} />
      </Flex>
      <GettingStarted targets={targets} />
    </Grid>
  );
}
