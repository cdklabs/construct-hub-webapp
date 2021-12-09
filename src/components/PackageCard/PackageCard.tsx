import { createContext, FunctionComponent, useContext } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCardType } from "./constants";
import { WideCard } from "./WideCard";

export interface PackageCardProps {
  "data-event"?: string;
  pkg: CatalogPackage;
  variant?: PackageCardType;
}

interface PackageCardState extends CatalogPackage {
  comment?: string;
  dataEvent?: string;
}

const PackageCardContext = createContext<PackageCardState | null>(null);

export const usePackageCard = () => useContext(PackageCardContext)!;

export const PackageCard: FunctionComponent<PackageCardProps> = ({
  "data-event": dataEvent,
  pkg,
  variant = PackageCardType.Wide,
}) => {
  return (
    <PackageCardContext.Provider value={{ ...pkg, dataEvent }}>
      {variant === PackageCardType.Wide && <WideCard />}
    </PackageCardContext.Provider>
  );
};
