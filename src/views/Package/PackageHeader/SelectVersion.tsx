import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { FunctionComponent, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useSearchContext } from "../../../contexts/Search";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";

export const SelectVersion: FunctionComponent = () => {
  const { scope, name, version, language } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;

  const searchAPI = useSearchContext()!;
  const { push } = useHistory();

  const packages = searchAPI.findByName(pkgName);

  const { majors, defaultMajor } = useMemo(() => {
    const majorVersions = packages.map((pkg) => ({
      major: pkg.major,
      version: pkg.version,
    }));
    majorVersions.sort((a, b) => a.major - b.major);
    const defaultMajorVersion = majorVersions.find(
      (mv) => mv.version === version
    );
    return { majors: majorVersions, defaultMajor: defaultMajorVersion };
  }, [packages, version]);

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
        mt={1}
        py={1}
        rightIcon={<ChevronDownIcon />}
        variant="link"
      >
        {`v${defaultMajor?.version}`}
      </MenuButton>
      <MenuList minW="180" zIndex="sticky">
        {majors.map((mv) => (
          <MenuItem
            data-value={mv.version}
            key={mv.version}
            onClick={() => onChangeVersion(mv.version)}
          >{`v${mv.version}`}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
