import { Box, Grid, GridItem, GridItemProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Community } from "./Community";
import { GettingStarted } from "./GettingStarted";
import { NavButton } from "./NavButton";
import { SearchButton } from "./SearchButton";
import { Title } from "./Title";

const HeaderItem: FunctionComponent<GridItemProps> = (props) => (
  <GridItem align="center" justify="center" rowStart={1} {...props} />
);

export const Header: FunctionComponent = () => {
  return (
    <Grid
      alignItems="center"
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderBottomColor="blue.100"
      boxShadow="base"
      data-testid="header"
      gap={4}
      gridTemplateColumns={{
        base: "1fr 3fr 1fr",
        md: "minmax(200px, 2fr) minmax(200px, 3fr) 2fr",
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
        colStart={{ base: 2, md: 1 }}
        justifySelf={{ base: "center", md: "start" }}
      >
        <Title />
      </HeaderItem>

      {/* Search Trigger */}
      <HeaderItem
        colStart={{ base: 3, md: 2 }}
        justifySelf={{ base: "end", md: "stretch" }}
      >
        <SearchButton />
      </HeaderItem>

      {/* Navigation */}
      <HeaderItem
        colStart={{ base: 1, md: 3 }}
        justifySelf={{ base: "start", md: "end" }}
      >
        <Grid
          display={{ base: "none", md: "grid" }}
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="1fr"
          placeItems="center"
          w="100%"
        >
          <Box>
            <GettingStarted />
          </Box>
          <Box>
            <Community />
          </Box>
        </Grid>
        <NavButton />
      </HeaderItem>
    </Grid>
  );
};
