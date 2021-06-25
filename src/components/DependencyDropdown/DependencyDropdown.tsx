import { ChevronDownIcon, LinkIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuItem, MenuList } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { NavLink } from "../NavLink";

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
        bg="white"
        leftIcon={<LinkIcon color="purple.600" />}
        rightIcon={<ChevronDownIcon color="purple.600" h={6} w={6} />}
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
              p={2}
              to={`/packages/${name}/v/${version}`}
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
