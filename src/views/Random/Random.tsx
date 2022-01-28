import { Center, Spinner } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import type { CatalogPackage, Packages } from "../../api/package/packages";
import { useCatalog } from "../../hooks/useCatalog";
import { getPackagePath } from "../../util/url";

const getRandomPkg = (catalog: Packages): CatalogPackage => {
  const packages = catalog.packages;
  const idx = Math.floor(Math.random() * packages.length);
  return packages[idx];
};

export const Random: FunctionComponent = () => {
  const catalog = useCatalog();

  if (catalog.isLoading || !catalog.data) {
    return (
      <Center minH="16rem">
        <Spinner size="xl" />
      </Center>
    );
  }

  const pkg = getRandomPkg(catalog.data);
  const url = getPackagePath({
    name: pkg.name,
    version: pkg.version,
  });

  return <Redirect to={url} />;
};
