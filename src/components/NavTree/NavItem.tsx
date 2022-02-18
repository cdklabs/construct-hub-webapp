import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useMemo } from "react";
import { clickEvent, eventName, useAnalytics } from "../../contexts/Analytics";
import { NavItemWrapper } from "./NavItemWrapper";
import type { GetIsActiveItemFunction, NavItemConfig } from "./types";

const navTreeEvent = (scope: string, event: string) =>
  eventName(scope, "NavTree", event);

const iconProps = {
  color: "textTertiary",
  h: 4,
  w: 4,
};

export interface NavItemProps extends NavItemConfig {
  // The following props don't need to be explicitly defined - they are passed internally
  getIsActiveItem?: GetIsActiveItemFunction;
  onOpen?: () => void;
  level: number;
  variant?: "sm" | "md";
}
export const NavItem: FunctionComponent<NavItemProps> = ({
  children,
  "data-event": dataEvent,
  getIsActiveItem,
  id,
  title,
  path,
  level,
  onOpen,
  variant,
}) => {
  const { trackCustomEvent } = useAnalytics();
  const defaultIsOpen = level < 2; // only show first two levels by default
  const disclosure = useDisclosure({ onOpen, defaultIsOpen });

  const linkIsActive =
    getIsActiveItem?.({
      id,
      title,
      path,
      children,
    }) ?? false;

  const showToggle = (children?.length ?? 0) > 0;
  const showChildren = disclosure.isOpen && showToggle;

  const nestedItems = useMemo(
    () =>
      children?.map((item, idx) => {
        return (
          <NavItem
            data-event={dataEvent}
            {...item}
            getIsActiveItem={getIsActiveItem}
            key={idx}
            level={level + 1}
            onOpen={disclosure.onOpen}
            variant={variant}
          />
        );
      }),
    [children, dataEvent, getIsActiveItem, level, disclosure.onOpen, variant]
  );

  return (
    <Flex direction="column">
      <Flex align="center" color={linkIsActive ? "link" : "textPrimary"}>
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
            onClick={() => {
              disclosure.onToggle();

              if (dataEvent) {
                trackCustomEvent(
                  clickEvent({
                    name: navTreeEvent(dataEvent, "Toggle"),
                  })
                );
              }
            }}
            size="xs"
            variant="link"
            w={0}
          />
        )}
        <NavItemWrapper
          data-event={dataEvent ? navTreeEvent(dataEvent, "Link") : undefined}
          path={path}
          showToggle={showToggle}
          title={title}
          variant={variant}
        >
          {title}
        </NavItemWrapper>
      </Flex>
      <Box
        _before={{
          // Creates a border without taking up any box space
          // This is important to keep items perfectly aligned
          bg: "borderColor",
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
