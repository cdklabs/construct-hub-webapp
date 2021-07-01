import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { GETTING_STARTED } from "../../constants/links";
import { ExternalLink } from "../ExternalLink";

export const GettingStartedDropdown = (): JSX.Element => {
  return (
    <Menu colorScheme="blue.800">
      <MenuButton
        as={Button}
        bg="white"
        color="blue.800"
        rightIcon={<ChevronDownIcon color="blue.800" h={6} w={6} />}
        size="md"
        variant="link"
      >
        Getting Started
      </MenuButton>
      <MenuList color="blue.800">
        {GETTING_STARTED.map((item, idx) => {
          if ("links" in item) {
            return (
              <>
                <MenuGroup key={item.display} title={item.display}>
                  {item.links.map((link) => (
                    <MenuItem key={link.display}>
                      <ExternalLink href={link.url}>
                        {link.display}
                      </ExternalLink>
                    </MenuItem>
                  ))}
                </MenuGroup>
                {idx !== GETTING_STARTED.length - 1 && <MenuDivider />}
              </>
            );
          }
          return (
            <MenuItem key={item.display}>
              <ExternalLink href={item.url}>{item.display}</ExternalLink>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};
