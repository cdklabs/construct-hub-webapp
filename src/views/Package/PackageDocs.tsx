import { Box, Flex, Grid } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { Route, Switch, useRouteMatch, useLocation } from "react-router-dom";
import { NavTree } from "../../components/NavTree";
import { ChooseSubmodule } from "./ChooseSubmodule";
import { PackageReadme } from "./PackageReadme";
import { usePackageState } from "./PackageState";
import { PackageTypeDocs } from "./PackageTypeDocs";

// We want the nav to be sticky, but it should account for the sticky heading as well, which is 72px
const TOP_OFFSET = "4.5rem";

const SubmoduleSelector: FunctionComponent = () => {
  const {
    assembly: { data },
  } = usePackageState();

  return Object.keys(data?.submodules ?? {}).length > 0 ? (
    <Flex
      borderBottom="1px solid"
      borderColor="blue.50"
      justify="center"
      py={4}
    >
      <ChooseSubmodule assembly={data} />
    </Flex>
  ) : null;
};
export const PackageDocs: FunctionComponent = () => {
  const { path } = useRouteMatch();
  const { menuItems } = usePackageState();

  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(`${hash}`) as HTMLElement;
      target?.scrollIntoView(true);
    } else {
      window.scrollTo(0, 0);
    }
  });

  return (
    <Grid
      bg="white"
      columnGap={4}
      h="100%"
      templateColumns={{ base: "1fr", md: "1fr 3fr" }}
      width="100%"
    >
      <Flex
        alignSelf="stretch"
        borderRight="1px solid"
        borderRightColor="blue.50"
        direction="column"
        display={{ base: "none", md: "flex" }}
        maxHeight={`calc(100vh - ${TOP_OFFSET})`}
        overflow="hidden auto"
        pl={6}
        position="sticky"
        pr={4}
        top={TOP_OFFSET}
      >
        <SubmoduleSelector />
        <Box overflowY="auto" py={4}>
          <NavTree items={menuItems} />
        </Box>
      </Flex>
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
          <Route exact path={path}>
            <PackageReadme />
          </Route>
          <Route exact path={`${path}/api/:typeId`}>
            <PackageTypeDocs />
          </Route>
        </Switch>
      </Box>
    </Grid>
  );
};
