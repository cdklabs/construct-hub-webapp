import { createContext, FunctionComponent, useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { fetchVersions, PackageVersions } from "../../api/versions";

export type VersionsQuery = UseQueryResult<PackageVersions, Error | undefined>;

const VersionsContext = createContext<VersionsQuery | undefined>(undefined);

export const useVersions = () => useContext(VersionsContext)!;

export const VersionsProvider: FunctionComponent = ({ children }) => {
  const Versions: VersionsQuery = useQuery("Versions", fetchVersions);

  return (
    <VersionsContext.Provider value={Versions}>
      {children}
    </VersionsContext.Provider>
  );
};
