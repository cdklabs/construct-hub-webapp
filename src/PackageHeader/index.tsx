import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";

export interface PackageHeaderProps {
  title: string;
  description: string;
  tags: string[];
}

export default function PackageHeader({
  description,
  title,
}: PackageHeaderProps) {
  return (
    <Flex bg="gray.200" direction="column" width="100%">
      <Box>
        <Heading>{title}</Heading>
      </Box>

      <Box>
        <Text>{description}</Text>
      </Box>

      <Divider />
    </Flex>
  );
}
