import { Flex, Heading, Text } from "@chakra-ui/react";
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
      maxWidth="100%"
      overflowX="hidden"
      p={2}
      textAlign={{ base: "center", md: "initial" }}
    >
      <Heading mb={5} wordBreak="break-word">
        {title}
      </Heading>

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
