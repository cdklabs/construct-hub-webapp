import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCard } from "../../components/PackageCard";
import testIds from "./testIds";

export const PackageGrid: FunctionComponent<{
  "data-event"?: string;
  packages: CatalogPackage[];
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
