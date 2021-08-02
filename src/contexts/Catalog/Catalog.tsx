import { createContext, FunctionComponent, useContext } from "react";
import { Packages } from "api/package/packages";

const CatalogContext = createContext<Packages>({
  packages: [],
});

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider: FunctionComponent<{ packages: Packages }> = ({
  children,
  packages,
}) => {
  return (
    <CatalogContext.Provider value={packages}>
      {children}
    </CatalogContext.Provider>
  );
};
