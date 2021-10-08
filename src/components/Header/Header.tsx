import { Box, Grid, GridItem, GridItemProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Documentation } from "./Documentation";
import { HeaderSearch } from "./HeaderSearch";
import { NavButton } from "./NavButton";
import { Resources } from "./Resources";
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
      bg="white"
      boxShadow="base"
      data-testid={testIds.container}
      gap={6}
      gridTemplateColumns={{
        base: "1fr max-content 1fr",
        md: "max-content minmax(200px, 500px) auto",
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
        <HeaderSearch />
      </HeaderItem>

      {/* Navigation */}
      <HeaderItem
        colStart={{ base: 1, md: 3 }}
        justifySelf={{ base: "start", md: "end" }}
      >
        <Grid
          display={{ base: "none", md: "grid" }}
          gap={4}
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="1fr"
          placeItems="center"
          w="100%"
        >
          <Box>
            <Documentation />
          </Box>
          <Box>
            <Resources />
          </Box>
        </Grid>
        <NavButton />
      </HeaderItem>
    </Grid>
  );
};
