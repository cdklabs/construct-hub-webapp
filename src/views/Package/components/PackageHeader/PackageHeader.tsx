import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { PackageTagConfig } from "../../../../api/config";
import { PackageTag } from "../../../../components/PackageTag";
import { useLanguage } from "../../../../hooks/useLanguage";

export interface PackageHeaderProps {
  title: string;
  description: string;
  tags: PackageTagConfig[];
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
          {tags.slice(0, 3).map(({ label, color }) => (
            <PackageTag
              key={label}
              language={currentLanguage}
              mr={2}
              value={label}
              variant={color}
            >
              {label}
            </PackageTag>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
