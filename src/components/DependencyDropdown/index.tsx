import { ChevronDownIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  PropsOf,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { NavLink } from "../NavLink";

export interface DependencyDropownProps {
  dependencies: {
    /**
     * Key is a dep name, value is a version
     */
    [key: string]: string;
  };
}

const DropdownButton = forwardRef((props: PropsOf<typeof Button>, ref) => {
  return (
    <Button
      {...props}
      bg="white"
      ref={ref as any}
      size="md"
      variant="outline"
    />
  );
});

DropdownButton.displayName = "DropdownButton";

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
}
