import { Menu, MenuButton, Button, MenuItem, MenuList } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { NavLink } from "../../../components/NavLink";
import { LIMITS } from "../constants";

export interface LimitDropdownProps {
  limit: number;
  getPageUrl: (param: { offset: number; limit: number }) => string;
}

export const LimitDropdown: FunctionComponent<LimitDropdownProps> = ({
  limit,
  getPageUrl,
}) => (
  <Menu>
    <MenuButton as={Button} colorScheme="blue" mx={2}>
      Show: {limit}
    </MenuButton>
    <MenuList>
      {LIMITS.map((l) => (
        <NavLink key={`limit-${l}`} to={getPageUrl({ offset: 0, limit: l })}>
          <MenuItem>{l}</MenuItem>
        </NavLink>
      ))}
    </MenuList>
  </Menu>
);
