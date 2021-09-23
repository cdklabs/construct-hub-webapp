import type { FunctionComponent } from "react";
import { PackageLanguages } from "../PackageLanguages";
import { usePackageCard } from "./PackageCard";

export const Languages: FunctionComponent = () => {
  const pkg = usePackageCard();
  return <PackageLanguages {...pkg} size="sm" />;
};
