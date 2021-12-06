import { Center, Spinner } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Packages } from "../../api/package/packages";
import { getFullPackageName, findPackage } from "../../api/package/util";
import { useCatalog } from "../../contexts/Catalog";
import NotFound from "../NotFound";

interface RouteParams {
  name: string;
  scope?: string;
}

const buildRedirectUrl = (catalog: Packages, name: string, scope?: string) => {
  const prefix = "/packages/";
  const packageName = getFullPackageName(name, scope);
  const pkg = findPackage(catalog, packageName);

  if (!pkg) {
    return undefined;
  }

  const { version } = pkg;
  const suffix = `/v/${version}`;
  return `${prefix}${packageName}${suffix}`;
};

export const PackageLatest: FunctionComponent = () => {
  const { name, scope }: RouteParams = useParams();
  const catalog = useCatalog();

  if (catalog.isLoading || !catalog.data) {
    return (
      <Center minH="16rem">
        <Spinner size="xl" />
      </Center>
    );
  }

  const url = buildRedirectUrl(catalog.data, name, scope);

  return url ? <Redirect to={url} /> : <NotFound />;
};
