import { Divider, Flex, Grid } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import type { Metadata } from "../../api/package";
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

  return (
    <Grid
      bg="gray.100"
      gap={2}
      templateColumns="auto 1fr 1fr"
      templateRows="1fr"
      pt={2}
    >
      {/* Where to get logo? empty div to preserve layout for now */}
      <div />
      <Flex direction="column">
        <PublisherArea metadata={metadata} />
        <Divider borderColor="initial" color="gray.300" my={5} />
        <OperatorArea metadata={metadata} />
      </Flex>
      <GettingStarted targets={targets} />
    </Grid>
  );
}
