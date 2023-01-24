import type { FunctionComponent } from "react";
import { usePackageCard } from "./PackageCard";
import { PackageLanguages } from "../PackageLanguages";

export const Languages: FunctionComponent = () => {
  const pkg = usePackageCard();
  return <PackageLanguages {...pkg} size="sm" />;
};
