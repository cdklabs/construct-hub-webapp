import { Box, Grid, GridItem, GridItemProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { ROUTES } from "../../constants/url";
import { NavLink } from "../NavLink";
import { HEADER_ANALYTICS } from "./constants";
import { DocumentationDropdown } from "./DocumentationDropdown";
import { GettingStartedDropdown } from "./GettingStartedDropdown";
import { HeaderSearch } from "./HeaderSearch";
import { NavButton } from "./NavButton";
import testIds from "./testIds";
import { Title } from "./Title";

const HeaderItem: FunctionComponent<GridItemProps> = (props) => (
  <GridItem align="center" justify="center" rowStart={1} {...props} />
);

export const Header: FunctionComponent = () => {
  return (
    <Grid
      alignItems="center"
      as="header"
      bg="bgSecondary"
      boxShadow="base"
      data-testid={testIds.container}
      gap={6}
      gridTemplateColumns={{
        base: "1fr max-content 1fr",
        lg: "max-content minmax(12rem, 31rem) auto",
      }}
      gridTemplateRows="1fr"
      maxW="100vw"
      position="sticky"
      px={4}
      py={4}
      top={0}
      w="100%"
      zIndex="sticky"
    >
      {/* Logo / Header */}
      <HeaderItem
        colStart={{ base: 2, lg: 1 }}
        justifySelf={{ base: "center", lg: "start" }}
      >
        <Title />
      </HeaderItem>

      {/* Search Trigger */}
      <HeaderItem
        colStart={{ base: 3, lg: 2 }}
        justifySelf={{ base: "end", lg: "stretch" }}
      >
        <HeaderSearch />
      </HeaderItem>

      {/* Navigation */}
      <HeaderItem
        colStart={{ base: 1, lg: 3 }}
        justifySelf={{ base: "start", lg: "end" }}
      >
        <Grid
          display={{ base: "none", lg: "grid" }}
          gap={4}
          gridTemplateRows="1fr"
          placeItems="center"
          templateColumns="1fr 1fr auto"
          w="100%"
        >
          <Box>
            <GettingStartedDropdown />
          </Box>
          <Box>
            <DocumentationDropdown />
          </Box>

          <NavLink
            color="textPrimary"
            data-event={HEADER_ANALYTICS.CONTRIBUTE_LINK}
            fontWeight="500"
            to={ROUTES.CONTRIBUTE}
          >
            Contribute
          </NavLink>
        </Grid>
        <NavButton />
      </HeaderItem>
    </Grid>
  );
};
