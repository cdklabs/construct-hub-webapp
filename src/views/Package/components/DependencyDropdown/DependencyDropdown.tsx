import { ChevronDownIcon, LinkIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuItem, MenuList } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { sanitizeVersion } from "api/package/util";
import { NavLink } from "components/NavLink";

export interface DependencyDropdownProps {
  dependencies: {
    /**
     * Key is a dep name, value is a version
     */
    [key: string]: string;
  };
}

export const DependencyDropdown: FunctionComponent<DependencyDropdownProps> = ({
  dependencies,
}) => {
  const depEntries = Object.entries(dependencies);

  if (!depEntries.length) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        color="blue.500"
        leftIcon={<LinkIcon />}
        rightIcon={<ChevronDownIcon h={6} w={6} />}
        size="md"
        variant="outline"
      >
        Dependencies
      </MenuButton>
      <MenuList>
        {depEntries.map(([name, version]) => (
          <MenuItem key={`${name}/${version}`} p={0}>
            <NavLink
              h="100%"
              href={`/packages/${name}/v/${sanitizeVersion(version)}`}
              p={2}
              w="100%"
            >
              {`${name} - ${version}`}
            </NavLink>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
