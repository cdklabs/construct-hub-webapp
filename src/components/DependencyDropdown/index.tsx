import { ChevronDownIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  PropsOf,
} from "@chakra-ui/react";
import { NavLink } from "../NavLink";

export interface DependencyDropownProps {
  dependencies: {
    /**
     * Key is a dep name, value is a version
     */
    [key: string]: string;
  };
}

function DropdownButton(props: PropsOf<typeof Button>) {
  return <Button {...props} bg="white" variant="outline" size="md" />;
}

export function DependencyDropdown({ dependencies }: DependencyDropownProps) {
  const depEntries = Object.entries(dependencies);

  if (!depEntries.length) return null;

  return (
    <Menu>
      <MenuButton
        as={DropdownButton}
        leftIcon={<LinkIcon color="purple.600" />}
        rightIcon={<ChevronDownIcon color="purple.600" h={6} w={6} />}
      >
        Dependencies
      </MenuButton>
      <MenuList>
        {depEntries.map(([name, version]) => (
          <MenuItem>
            <NavLink to={`/packages/${name}/v/${version}`}>
              {`${name} - ${version}`}
            </NavLink>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
