import { Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageCard, PackageCardType } from "../PackageCard";
import { PackageListViewProps } from "./PackageList";

export const CompactCardList: FunctionComponent<PackageListViewProps> = ({
  items,
}) => {
  return (
    <Grid
      autoRows="auto"
      gap={5}
      templateColumns="repeat(auto-fit, minmax(320px, 1fr))"
    >
      {items.map((pkg) => (
        <PackageCard
          key={`${pkg.name}-${pkg.version}`}
          pkg={pkg}
          variant={PackageCardType.Compact}
        />
      ))}
    </Grid>
  );
};
