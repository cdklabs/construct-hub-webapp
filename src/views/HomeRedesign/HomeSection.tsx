import { Heading } from "@chakra-ui/react";
import { Fragment, FunctionComponent } from "react";
import { FeaturedPackagesDetail } from "../../api/config";
import { PackageList } from "../../components/PackageList";
import { useCatalog } from "../../contexts/Catalog";
import { useSection } from "./useSection";

export interface HomeSectionProps {
  name: string;
  showLastUpdated?: number;
  showPackages?: FeaturedPackagesDetail[];
}

export const HomeSection: FunctionComponent<HomeSectionProps> = ({
  name,
  showLastUpdated,
  showPackages,
}) => {
  const { loading } = useCatalog();

  const results = useSection({ showLastUpdated, showPackages });

  if (!results) {
    console.warn(
      "config.json is invalid - a section must specify showLastUpdated or showPackages."
    );
    return null;
  }

  return (
    <Fragment>
      <Heading as="h3" color="blue.800" my="4" size="md">
        {name}
      </Heading>

      <PackageList items={results} loading={loading} />
    </Fragment>
  );
};
