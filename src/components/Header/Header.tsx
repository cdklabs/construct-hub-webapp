import { Grid, GridItem, GridItemProps } from "@chakra-ui/react";
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
      boxShadow="base"
      data-testid="header"
      gap={4}
      gridTemplateColumns={["1fr 3fr 1fr", null, "2fr 3fr 2fr", "1fr 2fr 1fr"]}
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
        colStart={[2, null, 1]}
        justifySelf={["center", null, "start"]}
      >
        <Title />
      </HeaderItem>

      {/* Search Trigger */}
      <HeaderItem
        colStart={[3, null, 2]}
        justifySelf={["end", null, "stretch"]}
      >
        <SearchButton />
      </HeaderItem>

      {/* Navigation */}
      <HeaderItem colStart={[1, null, 3]} justifySelf={["start", null, "end"]}>
        <Grid
          alignItems="center"
          display={["none", null, "grid"]}
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="1fr"
          w="100%"
        >
          <GettingStarted />
          <Community />
        </Grid>
        <NavButton />
      </HeaderItem>
    </Grid>
  );
};
