import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, IconButton, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

export interface NavItemConfig {
  children?: NavItemConfig[];
  display: string;
  url: string;
}

export interface NavItemProps extends NavItemConfig {
  // The following props don't need to be explicitly defined - they are passed internally
  location: {
    pathname: string;
    hash: string;
  } | null;
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
  location,
  children,
  display,
  onOpen,
  url,
}) => {
  const isHashLink = url.startsWith("#");
  const linkIsActive = isHashLink
    ? location?.hash === url
    : location?.pathname === url;
  const disclosure = useDisclosure({ onOpen });

  const showToggle = (children?.length ?? 0) > 0;
  const showChildren = disclosure.isOpen && showToggle;

  useEffect(() => {
    if (linkIsActive) {
      disclosure.onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkIsActive]);

  const nestedItems = useMemo(
    () =>
      children?.map((item, idx) => {
        return (
          <NavItem
            {...item}
            key={idx}
            location={location}
            onOpen={disclosure.onOpen}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, children, disclosure.onOpen]
  );

  return (
    <Flex direction="column">
      <Flex align="center" color={linkIsActive ? "blue.500" : "gray.800"}>
        {showToggle && (
          <IconButton
            aria-label="expand-toggle"
            borderRadius="md"
            h={4}
            icon={
              disclosure.isOpen ? (
                <ChevronDownIcon {...iconProps} />
              ) : (
                <ChevronRightIcon {...iconProps} />
              )
            }
            ml={-1}
            onClick={disclosure.onToggle}
            size="xs"
            variant="link"
            w={4}
          />
        )}
        <Link
          _hover={{ bg: "rgba(0, 124, 253, 0.05)" }}
          href={url}
          overflow="hidden"
          pl={showToggle ? 1 : 2}
          py={1.5}
          textOverflow="ellipsis"
          title={display}
          w="100%"
          whiteSpace="nowrap"
        >
          {display}
        </Link>
      </Flex>
      <Box
        _before={{
          // Creates a border without taking up any box space
          // This is important to keep items perfectly aligned
          bg: "gray.100",
          bottom: 0,
          content: `""`,
          left: 0,
          position: "absolute",
          top: 0,
          w: "1px",
        }}
        display={showChildren ? "initial" : "none"}
        ml={2}
        pl={2}
        position="relative"
      >
        {nestedItems}
      </Box>
    </Flex>
  );
};

export const NavTree: FunctionComponent<NavTreeProps> = ({ items }) => {
  const [location, setLocation] = useState<NavItemProps["location"]>(null);

  useEffect(() => {
    const listener = () => {
      setLocation({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });
    };

    // Call listener to update on first render
    listener();

    window.addEventListener("hashchange", listener);

    return () => window.removeEventListener("hashchange", listener);
  }, []);

  return (
    <Flex direction="column" maxWidth="100%">
      {items.map((item, idx) => {
        return (
          <NavItem {...item} key={idx} location={location} onOpen={undefined} />
        );
      })}
    </Flex>
  );
};
