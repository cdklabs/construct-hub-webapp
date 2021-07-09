import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, IconButton, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "../NavLink";

export interface NavItemConfig {
  children?: NavItemConfig[];
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
  children,
  display,
  url,
  onOpen,
}) => {
  const { pathname, hash } = useLocation();
  const isHashUrl = url.startsWith("#");
  const linkIsActive = isHashUrl ? hash === url : pathname === url;
  const disclosure = useDisclosure({ onOpen });

  const isRoot = !onOpen;
  const showToggle = (children?.length ?? 0) > 0;
  const showChildren = disclosure.isOpen && showToggle;

  const LinkComponent = isHashUrl ? Link : NavLink;

  useEffect(() => {
    if (linkIsActive) {
      disclosure.onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkIsActive]);

  return (
    <Flex
      borderLeft={isRoot ? "none" : "1px solid"}
      borderLeftColor="gray.100"
      direction="column"
      pl={2}
    >
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
            ml={-2}
            onClick={disclosure.onToggle}
            size="xs"
            variant="link"
            w={2}
          />
        )}
        <LinkComponent
          href={url}
          overflow="hidden"
          pl={!showToggle ? 4 : 0}
          textOverflow="ellipsis"
          title={display}
          to={url}
          whiteSpace="nowrap"
        >
          {display}
        </LinkComponent>
      </Flex>
      <Box display={showChildren ? "initial" : "none"}>
        {children?.map((item, idx) => {
          return <NavItem {...item} key={idx} onOpen={disclosure.onOpen} />;
        })}
      </Box>
    </Flex>
  );
};

export const NavTree: FunctionComponent<NavTreeProps> = ({ items }) => {
  return (
    <Flex direction="column" maxWidth="100%" overflowX="hidden">
      {items.map((item, idx) => {
        return <NavItem {...item} key={idx} onOpen={undefined} />;
      })}
    </Flex>
  );
};
