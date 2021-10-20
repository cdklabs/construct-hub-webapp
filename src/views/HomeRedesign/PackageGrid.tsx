import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCard } from "../../components/PackageCard";

export const PackageGrid: FunctionComponent<{ packages: CatalogPackage[] }> = ({
  packages,
}) => {
  return (
    <Grid gap={4} mt={8} templateColumns={{ base: "1fr", lg: "1fr 1fr" }}>
      {packages.map((pkg) => (
        <PackageCard key={pkg.name} pkg={pkg} />
      ))}
    </Grid>
  );
};
