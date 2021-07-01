import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/url";
import { Logo } from "../../icons/Logo";
import { GettingStartedDropdown } from "../GettingStartedDropdown";
import { HeaderSearch } from "./HeaderSearch";

export const Header: FunctionComponent = () => {
  const { pathname } = useLocation();
  return (
    <Box
      bg="white"
      boxShadow="base"
      data-testid="header"
      position="sticky"
      px={2}
      py={3}
      top={0}
      w="100%"
      zIndex={10}
    >
      <Flex
        alignItems="center"
        as="header"
        justifyContent="space-between"
        w="100%"
      >
        <Flex as={Link} to="/">
          <Logo height={12} mr={4} width={12} />
          <Heading as="h1" size="xl">
            Construct Hub
          </Heading>
        </Flex>
        {pathname.startsWith(ROUTES.PACKAGES) && (
          <Box width={0.3}>
            <HeaderSearch />
          </Box>
        )}
        <Flex>
          <GettingStartedDropdown />
          <Box px={1}>
            <Text>Browse</Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
