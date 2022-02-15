import { FunctionComponent, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GetIsActiveItemFunction, NavTree } from "../../components/NavTree";
import {
  API_URL_RESOURCE,
  PACKAGE_ANALYTICS,
  README_ITEM_ID,
} from "./constants";
import { usePackageState } from "./PackageState";
import type { MenuItem } from "./util";

export const PrimaryDocNavigation: FunctionComponent = () => {
  const { menuItems } = usePackageState();
  const { pathname, hash } = useLocation();

  const primaryNavItems = useMemo(
    () =>
      menuItems.reduce((items, item, i) => {
        // Omit README children which will be displayed on secondary nav
        if (i === 0 && item?.id === README_ITEM_ID) {
          const { children, ...readme } = item;

          items.push({ ...readme, children: [] });
        } else {
          items.push(item);
        }

        return items;
      }, [] as MenuItem[]),
    [menuItems]
  );

  const getIsActiveItem: GetIsActiveItemFunction = useCallback(
    ({ path }) => {
      const pathUrl = new URL(path ?? "", window.origin);

      return Boolean(
        path?.includes(`/${API_URL_RESOURCE}/`)
          ? pathUrl.pathname === pathname
          : pathUrl.hash && hash && pathUrl.hash === hash
      );
    },
    [hash, pathname]
  );

  return (
    <NavTree
      data-event={PACKAGE_ANALYTICS.SCOPE}
      getIsActiveItem={getIsActiveItem}
      items={primaryNavItems}
    />
  );
};
