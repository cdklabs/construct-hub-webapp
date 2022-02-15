import { Box, Flex, Grid } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useMemo } from "react";
import {
  Route,
  Switch,
  useRouteMatch,
  useLocation,
  Redirect,
} from "react-router-dom";
import { NavTree } from "../../components/NavTree";
import { ChooseSubmodule } from "./ChooseSubmodule";
import {
  API_URL_RESOURCE,
  README_ITEM_ID,
  PACKAGE_ANALYTICS,
} from "./constants";
import { NavDrawer } from "./NavDrawer";
import { PackageReadme } from "./PackageReadme";
import { usePackageState } from "./PackageState";
import { PackageTypeDocs } from "./PackageTypeDocs";
import { StickyNavContainer } from "./StickyNavContainer";
import { useSectionItems } from "./useSectionItems";
import { isApiPath, MenuItem } from "./util";

// We want the nav to be sticky, but it should account for the sticky heading as well, which is 72px
const TOP_OFFSET = "4.5rem";
const DOCS_ROOT_ID = "apidocs_header";

const SubmoduleSelector: FunctionComponent = () => {
  const {
    assembly: { data },
  } = usePackageState();

  return Object.keys(data?.submodules ?? {}).length > 0 ? (
    <Flex
      borderBottom="1px solid"
      borderColor="borderColor"
      justify="center"
      py={4}
    >
      <ChooseSubmodule />
    </Flex>
  ) : null;
};

export const PackageDocs: FunctionComponent = () => {
  const { path } = useRouteMatch();
  const { menuItems, markdownDocs } = usePackageState();
  const sectionItems = useSectionItems();

  const { hash, pathname, search } = useLocation();

  const primaryNavItems = useMemo(() => {
    return menuItems.reduce((items, item, i) => {
      // Omit README children which will be displayed on secondary nav
      if (i === 0 && item?.id === README_ITEM_ID) {
        const { children, ...readme } = item;

        items.push({ ...readme, children: [] });
      } else {
        items.push(item);
      }

      return items;
    }, [] as MenuItem[]);
  }, [menuItems]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.querySelector(
          `[data-heading-id="${hash}"]`
        ) as HTMLElement;

        target?.scrollIntoView(true);
      } else if (isApiPath(pathname)) {
        const target = document.getElementById(DOCS_ROOT_ID) as HTMLElement;
        target?.scrollIntoView(true);
      } else {
        window.scrollTo(0, 0);
      }
    });
    // Subscribe to doc loading state so that we run this effect after docs load as well
  }, [hash, pathname, markdownDocs.isLoading]);

  return (
    <Grid
      columnGap={4}
      h="full"
      templateColumns={{
        base: "1fr",
        lg: "minmax(20rem, 1fr) 3fr minmax(16rem, 0.9fr)",
      }}
      width="100%"
    >
      {/* Primary Nav */}
      <StickyNavContainer
        borderRight="1px solid"
        borderRightColor="borderColor"
        offset={TOP_OFFSET}
        pl={6}
        pr={4}
        top={TOP_OFFSET}
      >
        <SubmoduleSelector />
        <Box overflowY="auto" py={4}>
          <NavTree
            data-event={PACKAGE_ANALYTICS.SCOPE}
            items={primaryNavItems}
          />
        </Box>
      </StickyNavContainer>

      {/* Docs */}
      <Box
        h="max-content"
        maxWidth="100%"
        overflow="hidden"
        py={4}
        sx={{
          a: {
            scrollMarginTop: TOP_OFFSET,
          },
        }}
      >
        <Switch>
          <Redirect
            exact
            from={`${path}/${API_URL_RESOURCE}`}
            to={{ pathname: path, search }}
          />
          <Route exact path={path}>
            <PackageReadme />
          </Route>
          <Route exact path={`${path}/${API_URL_RESOURCE}/:typeId`}>
            <PackageTypeDocs rootId={DOCS_ROOT_ID} />
          </Route>
        </Switch>
      </Box>

      {/* Secondary Nav */}
      <StickyNavContainer
        borderLeft="1px solid"
        borderLeftColor="borderColor"
        offset={TOP_OFFSET}
        pl={6}
        pr={4}
        top={TOP_OFFSET}
      >
        <Box overflowY="auto" py={4}>
          <NavTree
            data-event={PACKAGE_ANALYTICS.SCOPE}
            items={sectionItems}
            variant="sm"
          />
        </Box>
      </StickyNavContainer>
      <NavDrawer />
    </Grid>
  );
};
