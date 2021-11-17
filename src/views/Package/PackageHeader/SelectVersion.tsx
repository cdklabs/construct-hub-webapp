import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { FunctionComponent, useMemo } from "react";
import { useHistory } from "react-router-dom";
import semver from "semver";
import { useSearchContext } from "../../../contexts/Search";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";
import testIds from "../testIds";

export const SelectVersion: FunctionComponent = () => {
  const { scope, name, version: currentVersion, language } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;

  const searchAPI = useSearchContext()!;
  const { push } = useHistory();

  const packages = searchAPI.findByName(pkgName);

  const versions = useMemo(() => {
    const majorVersions = packages.map((pkg) => pkg.version);
    const allVersions = [...new Set([...majorVersions, currentVersion])];
    allVersions.sort(semver.compare);
    return allVersions;
  }, [packages, currentVersion]);

  const onChangeVersion = (selectedVersion: string) => {
    push(
      getPackagePath({
        name: pkgName,
        version: selectedVersion,
        language,
      })
    );
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        color="blue.500"
        data-testid={testIds.selectVersionButton}
        mt={1}
        py={1}
        rightIcon={<ChevronDownIcon />}
        variant="link"
      >
        {`v${currentVersion}`}
      </MenuButton>
      <MenuList
        data-testid={testIds.selectVersionDropdown}
        minW="180"
        zIndex="sticky"
      >
        {versions.map((ver) => (
          <MenuItem
            data-testid={testIds.selectVersionItem}
            data-value={ver}
            key={ver}
            onClick={() => onChangeVersion(ver)}
          >{`v${ver}`}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
