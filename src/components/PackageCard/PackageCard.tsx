import { createContext, FunctionComponent, useContext } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { CompactCard } from "./CompactCard";
import { PackageCardType } from "./constants";
import { WideCard } from "./WideCard";

export interface PackageCardProps {
  pkg: CatalogPackage;
  variant?: PackageCardType;
}

const PackageCardContext = createContext<CatalogPackage | null>(null);

export const usePackageCard = () => useContext(PackageCardContext)!;

export const PackageCard: FunctionComponent<PackageCardProps> = ({
  pkg,
  variant = PackageCardType.Wide,
}) => {
  return (
    <PackageCardContext.Provider value={pkg}>
      {variant === PackageCardType.Wide && <WideCard />}
      {variant === PackageCardType.Compact && <CompactCard />}
    </PackageCardContext.Provider>
  );
};
