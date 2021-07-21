import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface PackageHeaderProps {
  title: string;
  description: string;
  tags: string[];
  version: string;
}

export const PackageHeader: FunctionComponent<PackageHeaderProps> = ({
  description,
  tags,
  title,
  version,
}) => {
  return (
    <Flex
      direction="column"
      maxWidth="100%"
      overflowX="hidden"
      p={2}
      textAlign={{ base: "center", md: "initial" }}
    >
      <Stack
        align="center"
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "start" }}
        mb={4}
        spacing={4}
      >
        <Heading wordBreak="break-word">{title}</Heading>
        <Text color="blue.500" fontSize="md">
          {version}
        </Text>
      </Stack>

      <Text wordBreak="break-word">{description}</Text>

      {!!tags.length && (
        <Flex
          direction="row"
          justify={{ base: "center", md: "initial" }}
          mt={3}
        >
          {tags
            .filter(Boolean)
            .slice(0, 3)
            .map((tag) => (
              <Flex
                bg="gray.100"
                borderRadius="sm"
                justify="center"
                key={tag}
                mr={4}
                p={2}
              >
                <Text>{tag.toUpperCase()}</Text>
              </Flex>
            ))}
        </Flex>
      )}
    </Flex>
  );
};
