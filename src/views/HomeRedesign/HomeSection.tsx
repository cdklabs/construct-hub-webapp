import { Heading } from "@chakra-ui/react";
import { Fragment, FunctionComponent, useMemo } from "react";
import { CatalogPackage } from "../../api/package/packages";
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

    let packages = data.packages;

    if (showLastUpdated) {
      // sort packages by date
      packages = [...packages]
        .sort((p1, p2) => {
          const d1 = new Date(p1.metadata.date);
          const d2 = new Date(p2.metadata.date);
          if (d1 === d2) {
            return 0;
          }
          return d1 < d2 ? 1 : -1;
        })
        .slice(0, showLastUpdated);
    } else if (showPackages) {
      // find the specific packages from the catalog and
      // return them in the same order
      const filteredMap = [...packages].reduce(
        (accum: { [key: string]: CatalogPackage }, p) => {
          if (showPackages.includes(p.name)) {
            return {
              [p.name]: p,
              ...accum,
            };
          } else {
            return accum;
          }
        },
        {}
      );
      packages = showPackages.map((p) => filteredMap[p]);
    }

    return packages;
  }, [data?.packages, error, loading, showLastUpdated, showPackages]);

  return (
    <Fragment key={name}>
      <Heading as="h3" color="blue.800" size="md">
        {name}
      </Heading>

      <PackageList items={results} loading={loading} />
    </Fragment>
  );
};
