import { useQuery, UseQueryResult } from "react-query";
import { fetchVersions, PackageVersions } from "../../api/versions";

export type VersionsQuery = UseQueryResult<PackageVersions, Error | undefined>;

export const useVersions = () => {
  const versions: VersionsQuery = useQuery("Versions", fetchVersions);
  return versions;
};
