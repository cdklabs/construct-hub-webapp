import {
  forwardRef,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuListProps,
} from "@chakra-ui/react";
import { Fragment, FunctionComponent } from "react";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import type { IMenuItems, ILink } from "./types";

export interface NavPopoverContentProps extends MenuListProps {
  items: IMenuItems;
}

const Link: FunctionComponent<ILink> = ({ display, isNavLink, url }) =>
  isNavLink ? (
    <NavLink color="blue.500" to={url} w="100%">
      {display}
    </NavLink>
  ) : (
    <ExternalLink
      alignItems="center"
      display="flex"
      hasWarning={false}
      href={url}
      justifyContent="space-between"
      w="100%"
    >
      {display}
    </ExternalLink>
  );

export const NavPopoverContent = forwardRef<NavPopoverContentProps, "div">(
  ({ items, ...menuProps }, ref) => {
    return (
      <MenuList {...menuProps} ref={ref}>
        {items.map((item, idx) => {
          if ("links" in item) {
            return (
              <Fragment key={`${item.display}-${idx}`}>
                <MenuGroup align="left" title={item.display}>
                  {item.links.map((link, linkIdx) => (
                    <MenuItem key={`${link.display}-${linkIdx}`}>
                      <Link {...link} />
                    </MenuItem>
                  ))}
                </MenuGroup>
                {idx !== items.length - 1 && <MenuDivider />}
              </Fragment>
            );
          }

          return (
            <MenuItem key={`${item.display}-${idx}`}>
              <Link {...item} />
            </MenuItem>
          );
        })}
      </MenuList>
    );
  }
);
