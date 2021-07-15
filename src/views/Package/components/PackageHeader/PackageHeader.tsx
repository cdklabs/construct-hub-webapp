import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface PackageHeaderProps {
  title: string;
  description: string;
  tags: string[];
}

export const PackageHeader: FunctionComponent<PackageHeaderProps> = ({
  description,
  tags,
  title,
}) => {
  return (
    <Flex
      direction="column"
      p={2}
      textAlign={{ base: "center", md: "initial" }}
    >
      <Box mb={5}>
        <Heading>{title}</Heading>
      </Box>

      <Box>
        <Text>{description}</Text>
      </Box>

      {!!tags.length && (
        <Flex
          direction="row"
          justify={{ base: "center", md: "initial" }}
          mt={3}
        >
          {tags.map((tag) => (
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
