import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import testIds from "./testIds";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { PackageCard } from "../../components/PackageCard";

export const PackageGrid: FunctionComponent<{
  "data-event"?: string;
  packages: ExtendedCatalogPackage[];
}> = ({ "data-event": dataEvent, packages }) => {
  return (
    <Grid
      data-testid={testIds.packageGrid}
      gap={4}
      mt={8}
      templateColumns={{ base: "1fr", xl: "1fr 1fr" }}
    >
      {packages.map((pkg) => (
        <PackageCard
          data-event={dataEvent}
          key={`${pkg.name}-${pkg.version}`}
          pkg={pkg}
        />
      ))}
    </Grid>
  );
};
