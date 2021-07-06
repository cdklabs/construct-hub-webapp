import { Center, Grid, Spinner } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { FunctionComponent } from "react";
import type { Metadata } from "../../../../api/package/metadata";
import type { UseRequestResponse } from "../../../../hooks/useRequest";
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
    <Grid rowGap={4} templateColumns="1fr" templateRows="auto">
      <Grid columnGap={4} templateColumns="3fr 2fr">
        <PackageHeader
          description={assembly.data.spec.description}
          tags={assembly.data.spec.keywords ?? []}
          title={assembly.data.spec.name}
        />
        <OperatorArea assembly={assembly.data} metadata={metadata.data} />
      </Grid>
    </Grid>
  );
};
