import { Select } from "@chakra-ui/react";
import { FunctionComponent, useMemo } from "react";
import { useHistory } from "react-router-dom";
import semver from "semver";
import { useSearchContext } from "../../../contexts/Search";
import { getPackagePath } from "../../../util/url";
import { PACKAGE_ANALYTICS } from "../constants";
import { usePackageState } from "../PackageState";
import testIds from "../testIds";

export const SelectVersion: FunctionComponent = () => {
  const {
    scope,
    name,
    version: currentVersion,
    allVersions,
    language,
  } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;

  const searchAPI = useSearchContext()!;
  const { push } = useHistory();

  const packages = searchAPI.findByName(pkgName);

  const versions = useMemo(() => {
    // include major versions from catalog.json as a fallback if
    // allVersions request fails
    const majorVersions = packages.map((pkg) => pkg.version);
    const result = [
      ...new Set([...(allVersions ?? []), ...majorVersions, currentVersion]),
    ];

    // display highest versions first
    result.sort(semver.rcompare);
    return result;
  }, [packages, currentVersion, allVersions]);

  const onChangeVersion: React.ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    push(
      getPackagePath({
        name: pkgName,
        version: evt.target.value,
        language,
      })
    );
  };

  return (
    <Select
      data-event={PACKAGE_ANALYTICS.SELECT_VERSION}
      data-testid={testIds.selectVersionDropdown}
      fontWeight="500"
      onChange={onChangeVersion}
      size="sm"
      value={currentVersion}
      width="10rem"
    >
      {versions.map((ver) => (
        <option
          data-testid={testIds.selectVersionItem}
          data-value={ver}
          key={ver}
          value={ver}
        >{`v${ver}`}</option>
      ))}
    </Select>
  );
};
