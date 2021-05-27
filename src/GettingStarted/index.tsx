import { Box, Divider, Flex, Text } from "@chakra-ui/react";

export interface GettingStartedProps {
  targets: string[];
}

export default function GettingStarted({ targets }: GettingStartedProps) {
  return (
    <Flex bg="gray.200" width="100%">
      {targets.map((targetName) => {
        return (
          <Box key={targetName} padding={2}>
            <Text>{targetName}</Text>
          </Box>
        );
      })}
      <Divider />
    </Flex>
  );
}
