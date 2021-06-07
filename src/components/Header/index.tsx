import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <Box bg="purple.600" borderRadius="md" color="white" px={1} py={3} w="100%">
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Box>
          <Heading as="h1" color="white" size="xl">
            Construct Hub
          </Heading>
        </Box>
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
