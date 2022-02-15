import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { NavItem } from "./NavItem";
import type { GetIsActiveItemFunction, NavItemConfig } from "./types";

export interface NavTreeProps {
  "data-event"?: string;
  /**
   * Function to evaluate if an item is currently active
   */
  getIsActiveItem?: GetIsActiveItemFunction;
  /**
   * Items to render
   */
  items: NavItemConfig[];
  variant?: "sm" | "md";
}

export const NavTree: FunctionComponent<NavTreeProps> = ({
  "data-event": dataEvent,
  getIsActiveItem,
  items,
  variant,
}) => {
  return (
    <Flex direction="column" maxWidth="100%">
      {items.map((item, idx) => {
        return (
          <NavItem
            {...item}
            data-event={dataEvent}
            getIsActiveItem={getIsActiveItem}
            key={idx}
            level={0}
            onOpen={undefined}
            variant={variant}
          />
        );
      })}
    </Flex>
  );
};
