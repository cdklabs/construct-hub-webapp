import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export interface PackageHeaderProps {
  title: string;
  description: string;
  tags: string[];
}

export function PackageHeader({
  description,
  tags,
  title,
}: PackageHeaderProps) {
  return (
    <Flex bg="white" direction="column" borderRadius="md" p={2} width="100%">
      <Box mb={5}>
        <Heading>{title}</Heading>
      </Box>

      <Box>
        <Text>{description}</Text>
      </Box>

      {tags.length && (
        <Flex direction="row" mt={3}>
          {tags.map((tag) => (
            <Flex bg="gray.100" borderRadius="sm" justify="center" mr={4} p={2}>
              <Text>{tag.toUpperCase()}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
