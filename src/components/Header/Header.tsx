import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/url";
import { HeaderSearch } from "./HeaderSearch";

export const Header: FunctionComponent = () => {
  const { pathname } = useLocation();
  return (
    <Grid
      as="header"
      bg="white"
      boxShadow="base"
      data-testid="header"
      gridTemplateColumns="auto 1fr auto"
      gridTemplateRows="1fr"
      position="sticky"
      px={4}
      py={4}
      top={0}
      w="100%"
      zIndex={10}
    >
      <Flex as={Link} to="/">
        <Heading as="h1" size="lg">
          <Box as="span" color="blue.500">
            Construct
          </Box>{" "}
          Hub
        </Heading>
      </Flex>
      <Box maxWidth="50%" ml={6}>
        {pathname.startsWith(ROUTES.PACKAGES) && <HeaderSearch />}
      </Box>
      <Flex alignSelf="center">
        <Box px={1}>
          <Text>Getting Started</Text>
        </Box>
        <Box px={1}>
          <Text>Browse</Text>
        </Box>
      </Flex>
    </Grid>
  );
};
