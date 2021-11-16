import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useCatalogResults } from "../../../hooks/useCatalogResults";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";

export const SelectVersion: FunctionComponent = () => {
  const { scope, name, version, language } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;
  const packages = useCatalogResults({
    query: pkgName,
    exactMatch: true,
    limit: 20,
  });
  const { push } = useHistory();

  const packageMajorVersions = packages.results.map((pkg) => ({
    major: pkg.major,
    version: pkg.version,
  }));
  packageMajorVersions.sort((a, b) => a.major - b.major);
  const defaultMajor = packageMajorVersions.find(
    (mv) => mv.version === version
  );

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
    <Box as="span" display="flex">
      <Menu>
        <MenuButton
          as={Button}
          color="blue.500"
          // data-testid={testIds.sortButton}
          mt={1}
          // pl={2} // For some reason, the px shorthand doesn't work on this Button
          // pr={2}
          py={1}
          rightIcon={<ChevronDownIcon />}
          variant="link"
        >
          {`v${defaultMajor?.version}`}
        </MenuButton>
        <MenuList
          // data-testid={testIds.sortDropdown}
          minW="180"
          zIndex="sticky"
        >
          {packageMajorVersions.map((mv) => (
            <MenuItem
              data-value={mv.version}
              key={mv.version}
              onClick={() => onChangeVersion(mv.version)}
            >{`v${mv.version}`}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
