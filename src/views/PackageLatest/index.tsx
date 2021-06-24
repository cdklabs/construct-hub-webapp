import { Center, Spinner } from "@chakra-ui/react";
import { Redirect, useParams } from "react-router-dom";
import { Packages } from "../../api/package/packages";
import { getFullPackageName } from "../../api/package/util";
import { useCatalog } from "../../contexts/Catalog";

interface RouteParams {
  name: string;
  scope?: string;
}

export function PackageLatest() {
  const { name, scope }: RouteParams = useParams();
  const catalog = useCatalog();

  if (catalog.loading || !catalog.data) {
    return (
      <Center minH="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return <Redirect to={buildRedirectUrl(catalog.data, name, scope)} />;
}

export function buildRedirectUrl(
  catalog: Packages,
  name: string,
  scope?: string
) {
  const prefix = "/packages/";
  const packageName = getFullPackageName(name, scope);
  const version = findPackage(catalog, packageName).version;
  const suffix = `/v/${version}`;
  return `${prefix}${packageName}${suffix}`;
}

function findPackage(catalog: Packages, pkg: string) {
  const packages = catalog.packages.filter((p) => p.name === pkg);

  if (packages.length === 0) {
    throw new Error(`Package ${pkg} does not exist in catalog`);
  }

  if (packages.length > 1) {
    throw new Error(`Multiple packages found for ${pkg} in catalog`);
  }

  return packages[0];
}
