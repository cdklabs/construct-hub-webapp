import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <Box borderRadius="md" w="100%" px={1} py={3} color="white" bg="purple.600">
      <Flex w="100%" alignItems="center" justifyContent="space-between">
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
