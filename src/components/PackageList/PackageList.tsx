import { Center, Spinner } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCardType } from "../PackageCard";
import { WideCardList } from "./WideCardList";

const listViews = {
  [PackageCardType.Wide]: WideCardList,
};

export interface PackageListViewProps {
  "data-event"?: string;
  items: CatalogPackage[];
}

export interface PackageListProps extends Partial<PackageListViewProps> {
  cardView?: PackageCardType;
  loading?: boolean;
  title?: string;
}

export const PackageList: FunctionComponent<PackageListProps> = memo(
  ({
    "data-event": dataEvent,
    cardView = PackageCardType.Wide,
    items,
    loading,
    // title,
  }) => {
    if (loading || !items) {
      return (
        <Center>
          <Spinner size="xl" />
        </Center>
      );
    }

    const View = listViews[cardView];

    return <View data-event={dataEvent} items={items} />;
  }
);

PackageList.displayName = "PackageList";
