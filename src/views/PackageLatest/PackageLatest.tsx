import { Center, Spinner } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Packages } from "../../api/package/packages";
import { getFullPackageName, sanitizeVersion } from "../../api/package/util";
import { useCatalog } from "../../contexts/Catalog";

interface RouteParams {
  name: string;
  scope?: string;
}

const extractMajor = (ver: string) => {
  let sanitized = sanitizeVersion(ver);
  return sanitized.split(".")[0];
};

const findPackage = (catalog: Packages, pkg: string) => {
  const packages = catalog.packages.filter((p) => p.name === pkg);

  if (packages.length === 0) {
    throw new Error(`Package ${pkg} does not exist in catalog`);
  }

  if (packages.length > 1) {
    return packages.sort((p1, p2) => {
      const mv1 = extractMajor(p1.version);
      const mv2 = extractMajor(p2.version);
      return mv2.localeCompare(mv1);
    })[0];
  }

  return packages[0];
};

export const buildRedirectUrl = (
  catalog: Packages,
  name: string,
  scope?: string
) => {
  const prefix = "/packages/";
  const packageName = getFullPackageName(name, scope);
  const version = findPackage(catalog, packageName).version;
  const suffix = `/v/${version}`;
  return `${prefix}${packageName}${suffix}`;
};

export const PackageLatest: FunctionComponent = () => {
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
};
