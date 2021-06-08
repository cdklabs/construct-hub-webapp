import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { Logo } from "../../icons/Logo";

export function Header() {
  return (
    <Box
      bg="white"
      boxShadow="base"
      data-test="header"
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
        <Flex>
          <Logo height={12} mr={4} width={12} />
          <Heading as="h1" size="xl">
            Construct Hub
          </Heading>
        </Flex>
        <Box width={0.3}>
          <Input id="search" name="search" placeholder="search" />
        </Box>
        <Flex>
          <Box px={1}>
            <Text>Getting Started</Text>
          </Box>
          <Box px={1}>
            <Text>Browse</Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
