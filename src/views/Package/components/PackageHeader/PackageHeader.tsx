import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { PackageTag } from "../../../../components/PackageTag";
import { KEYWORD_IGNORE_LIST } from "../../../../constants/keywords";
import { useLanguage } from "../../../../hooks/useLanguage";

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
  const [currentLanguage] = useLanguage();
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
          {title.startsWith("@aws-cdk/") ? (
            <PackageTag
              key="official"
              label="official"
              language={currentLanguage}
              mr={2}
              value="@aws-cdk"
              variant="official"
            >
              Official
            </PackageTag>
          ) : null}
          {tags
            .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
            .slice(0, 3)
            .map((tag) => (
              <PackageTag
                key={tag}
                language={currentLanguage}
                mr={2}
                value={tag}
              >
                {tag}
              </PackageTag>
            ))}
        </Flex>
      )}
    </Flex>
  );
};
