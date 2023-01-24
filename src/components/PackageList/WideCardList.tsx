import { Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageListViewProps } from "./PackageList";
import { PackageCard, PackageCardType } from "../PackageCard";

export const WideCardList: FunctionComponent<PackageListViewProps> = ({
  "data-event": dataEvent,
  items,
}) => {
  return (
    <Stack spacing={4}>
      {items.map((pkg) => (
        <PackageCard
          data-event={dataEvent}
          key={`${pkg.name}-${pkg.version}`}
          pkg={pkg}
          variant={PackageCardType.Wide}
        />
      ))}
    </Stack>
  );
};
