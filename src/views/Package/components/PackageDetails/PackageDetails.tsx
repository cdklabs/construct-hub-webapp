import { Center, Divider, Flex, Grid, Spinner } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { FunctionComponent } from "react";
import type { Metadata } from "../../../../api/package/metadata";
import { Card } from "../../../../components/Card";
import type { UseRequestResponse } from "../../../../hooks/useRequest";
import { LanguageSelection } from "../LanguageSelection";
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
export const PackageDetails: FunctionComponent<PackageDetailsProps> = ({
  assembly,
  metadata,
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
        templateColumns={["1fr", null, "3fr auto 2fr"]}
        templateRows="auto"
      >
        <PackageHeader
          description={assembly.data.spec.description}
          tags={assembly.data.spec.keywords ?? []}
          title={assembly.data.spec.name}
        />
        <Divider display={["none", null, "initial"]} orientation="vertical" />
        <Divider
          display={["initial", "initial", "none"]}
          orientation="horizontal"
        />
        <OperatorArea assembly={assembly.data} metadata={metadata.data} />
      </Grid>
      <Flex justify={["center", null, "start"]} px={2} py={4}>
        <LanguageSelection assembly={assembly.data} />
      </Flex>
    </Flex>
  );
};
