import { Heading } from "@chakra-ui/react";
import { Fragment, FunctionComponent, useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { SORT_FUNCTIONS } from "../../api/catalog-search/util";
import type { CatalogPackage } from "../../api/package/packages";
import { findPackage } from "../../api/package/util";
import { PackageList } from "../../components/PackageList";
import { useCatalog } from "../../contexts/Catalog";

export interface HomeSectionProps {
  name: string;
  showLastUpdated?: number;
  showPackages?: string[];
}

export const HomeSection: FunctionComponent<HomeSectionProps> = ({
  name,
  showLastUpdated,
  showPackages,
}) => {
  const { data, loading, error } = useCatalog();

  const results = useMemo(() => {
    if (loading || error || !data?.packages) return [];

    if (showLastUpdated) {
      return data.packages
        .sort(SORT_FUNCTIONS[CatalogSearchSort.PublishDateDesc])
        .slice(0, showLastUpdated);
    } else if (showPackages) {
      return showPackages
        .map((p) => findPackage(data, p))
        .filter((pkg) => pkg !== undefined) as CatalogPackage[];
    } else {
      return undefined;
    }
  }, [data, error, loading, showLastUpdated, showPackages]);

  if (!results) {
    console.warn(
      "config.json is invalid - a section must specify showLastUpdated or showPackages."
    );
    return null;
  }

  return (
    <Fragment>
      <Heading as="h3" color="blue.800" size="md">
        {name}
      </Heading>

      <PackageList items={results} loading={loading} />
    </Fragment>
  );
};
