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
    <NavLink to={url}>{display}</NavLink>
  ) : (
    <ExternalLink href={url}>{display}</ExternalLink>
  );

export const NavPopoverContent = forwardRef<NavPopoverContentProps, "div">(
  ({ items, ...menuProps }, ref) => {
    return (
      <MenuList {...menuProps} ref={ref}>
        {items.map((item, idx) => {
          if ("links" in item) {
            return (
              <Fragment key={item.display}>
                <MenuGroup align="left" title={item.display}>
                  {item.links.map((link) => (
                    <MenuItem key={item.display}>
                      <Link {...link} />
                    </MenuItem>
                  ))}
                </MenuGroup>
                {idx !== items.length - 1 && <MenuDivider />}
              </Fragment>
            );
          }

          return (
            <MenuItem key={item.display}>
              <Link {...item} />
            </MenuItem>
          );
        })}
      </MenuList>
    );
  }
);
