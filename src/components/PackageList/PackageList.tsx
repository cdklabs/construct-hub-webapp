import { Center, Spinner } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCardType } from "../PackageCard";
import { CompactCardList } from "./CompactCardList";
import { WideCardList } from "./WideCardList";

const listViews = {
  [PackageCardType.Compact]: CompactCardList,
  [PackageCardType.Wide]: WideCardList,
};

export interface PackageListViewProps {
  items: CatalogPackage[];
}

export interface PackageListProps extends Partial<PackageListViewProps> {
  cardView?: PackageCardType;
  loading?: boolean;
  title?: string;
}

export const PackageList: FunctionComponent<PackageListProps> = ({
  cardView = PackageCardType.Wide,
  items,
  loading,
  // title,
}) => {
  if (loading || !(items && items.length > 0)) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  const View = listViews[cardView];

  return <View items={items} />;
};
