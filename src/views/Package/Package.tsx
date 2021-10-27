import { FunctionComponent } from "react";
import { PackageLayout } from "./PackageLayout";
import { PackageStateProvider } from "./PackageState";

export const Package: FunctionComponent = () => {
  return (
    <PackageStateProvider>
      <PackageLayout />
    </PackageStateProvider>
  );
};
