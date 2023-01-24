import { Center, Spinner } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import { WideCardList } from "./WideCardList";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { PackageCardType } from "../PackageCard";

const listViews = {
  [PackageCardType.Wide]: WideCardList,
};

export interface PackageListViewProps {
  "data-event"?: string;
  items: ExtendedCatalogPackage[];
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
