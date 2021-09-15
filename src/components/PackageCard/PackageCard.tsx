import {
  createContext,
  FunctionComponent,
  useContext,
  lazy,
  Suspense,
} from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCardType } from "./constants";

export interface PackageCardProps {
  pkg: CatalogPackage;
  variant?: PackageCardType;
}

const PackageCardContext = createContext<CatalogPackage | null>(null);

export const usePackageCard = () => useContext(PackageCardContext)!;

const CompactCard = lazy(() => import("./CompactCard"));
const WideCard = lazy(() => import("./WideCard"));

export const PackageCard: FunctionComponent<PackageCardProps> = ({
  pkg,
  variant = PackageCardType.Wide,
}) => {
  return (
    <PackageCardContext.Provider value={pkg}>
      {variant === PackageCardType.Wide && (
        <Suspense fallback={null}>
          <WideCard />
        </Suspense>
      )}
      {variant === PackageCardType.Compact && (
        <Suspense fallback={null}>
          <CompactCard />
        </Suspense>
      )}
    </PackageCardContext.Provider>
  );
};
