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

export default function GettingStartedDropdown(): JSX.Element {
  return (
    <Menu colorScheme="#002954">
      <MenuButton
        as={Button}
        bg="white"
        color="#002954"
        size="md"
        rightIcon={<ChevronDownIcon color="#002954" h={6} w={6} />}
      >
        Getting Started
      </MenuButton>
      <MenuList color="#002954">
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
}
