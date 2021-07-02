import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "../NavLink";

export interface NavItemConfig {
  items?: NavItemConfig[];
  display: string;
  url: string;
}

export interface NavItemProps extends NavItemConfig {
  // The following props don't need to be explicitly defined - they are passed internally
  onOpen?: () => void;
}

export interface NavTreeProps {
  /**
   * Items to render
   */
  items: NavItemConfig[];
}

const iconProps = {
  color: "gray.900",
  h: 4,
  w: 4,
};

export const NavItem: FunctionComponent<NavItemProps> = ({
  items,
  display,
  url,
  onOpen,
}) => {
  const { pathname, hash } = useLocation();
  const linkIsActive = url.startsWith("#") ? hash === url : pathname === url;
  const disclosure = useDisclosure({ onOpen });

  const showToggle = items?.length ?? 0 > 0;
  const showChildren = disclosure.isOpen && showToggle;

  useEffect(() => {
    if (linkIsActive) {
      disclosure.onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkIsActive]);

  return (
    <Flex direction="column">
      <Flex align="center" color={linkIsActive ? "blue.500" : "gray.800"}>
        {showToggle && (
          <IconButton
            aria-label="expand-toggle"
            borderRadius="md"
            h={2}
            icon={
              disclosure.isOpen ? (
                <ChevronDownIcon {...iconProps} />
              ) : (
                <ChevronRightIcon {...iconProps} />
              )
            }
            onClick={disclosure.onToggle}
            size="xs"
            variant="link"
            w={2}
          />
        )}
        <NavLink pl={!showToggle ? 2 : 0} to={url}>
          {display}
        </NavLink>
      </Flex>
      <Box display={showChildren ? "initial" : "none"} pl={6}>
        {items?.map((item, idx) => {
          return <NavItem {...item} key={idx} onOpen={disclosure.onOpen} />;
        })}
      </Box>
    </Flex>
  );
};

export const NavTree: FunctionComponent<NavTreeProps> = ({ items }) => {
  return (
    <Flex direction="column">
      {items.map((item, idx) => {
        return <NavItem {...item} key={idx} />;
      })}
    </Flex>
  );
};
