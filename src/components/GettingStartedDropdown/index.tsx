import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  forwardRef,
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  PropsOf,
} from "@chakra-ui/react";
import { GETTING_STARTED, ILink } from "../../constants/links";

function ExternalLink({ display, url }: ILink): JSX.Element {
  return (
    <MenuItem>
      <a href={url}>{display}</a>
    </MenuItem>
  );
}

const GettingStartedButton = forwardRef(
  (props: PropsOf<typeof Button>, ref) => {
    return <Button bg="white" ref={ref} size="md" {...props} />;
  }
);

GettingStartedButton.displayName = "GettingStartedButton";

export default function GettingStartedDropdown(): JSX.Element {
  return (
    <Menu>
      <MenuButton
        as={GettingStartedButton}
        rightIcon={<ChevronDownIcon color="black.600" h={6} w={6} />}
      >
        Getting Started
      </MenuButton>
      <MenuList>
        {GETTING_STARTED.map((item) => {
          if ("links" in item) {
            return (
              <MenuGroup key={item.display} title={item.display}>
                {item.links.map((link) => (
                  <ExternalLink key={link.display} {...link} />
                ))}
              </MenuGroup>
            );
          }
          return <ExternalLink key={item.display} {...item} />;
        })}
      </MenuList>
    </Menu>
  );
}
