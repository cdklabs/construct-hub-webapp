import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useMemo, ReactNode } from "react";
import { NavLink } from "../NavLink";

export interface NavItemConfig {
  children: NavItemConfig[];
  title: string;
  path?: string;
}

export interface NavItemProps extends NavItemConfig {
  // The following props don't need to be explicitly defined - they are passed internally
  onOpen?: () => void;
  level: number;
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

interface NavItemWrapperProps {
  path?: string;
  title: string;
  showToggle: boolean;
  children: ReactNode;
}

const NavItemWrapper: FunctionComponent<NavItemWrapperProps> = ({
  children,
  path,
  title,
  showToggle,
}) => {
  const sharedProps = {
    _hover: { bg: "rgba(0, 124, 253, 0.05)" },
    overflow: "hidden",
    pl: 1,
    py: showToggle ? 2 : 1,
    marginLeft: showToggle ? 0 : 1,
    fontWeight: showToggle ? "bold" : undefined,
    textOverflow: "ellipsis",
    w: "100%",
  };

  return path ? (
    <NavLink title={title} to={path} {...sharedProps}>
      {children}
    </NavLink>
  ) : (
    <Text {...sharedProps}>{children}</Text>
  );
};

export const NavItem: FunctionComponent<NavItemProps> = ({
  children,
  title,
  path,
  level,
  onOpen,
}) => {
  const linkIsActive = false;
  const defaultIsOpen = level < 2; // only show first two levels by default
  const disclosure = useDisclosure({ onOpen, defaultIsOpen });

  const showToggle = (children?.length ?? 0) > 0;
  const showChildren = disclosure.isOpen && showToggle;

  const nestedItems = useMemo(
    () =>
      children?.map((item, idx) => {
        return (
          <NavItem
            {...item}
            key={idx}
            level={level + 1}
            onOpen={disclosure.onOpen}
          />
        );
      }),
    [children, disclosure.onOpen, level]
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
            w={0}
          />
        )}
        <NavItemWrapper path={path} showToggle={showToggle} title={title}>
          {title}
        </NavItemWrapper>
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
        mr={2}
        pl={2}
        position="relative"
      >
        {nestedItems}
      </Box>
    </Flex>
  );
};

export const NavTree: FunctionComponent<NavTreeProps> = ({ items }) => {
  return (
    <Flex direction="column" maxWidth="100%">
      {items.map((item, idx) => {
        return <NavItem {...item} key={idx} level={0} onOpen={undefined} />;
      })}
    </Flex>
  );
};
