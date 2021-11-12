import {
  Box,
  Flex,
  Stack,
  StackProps,
  Heading as ChakraHeading,
  Text,
} from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import type { FunctionComponent } from "react";
import { PackageTagConfig } from "../../../api/config";
import { Metadata } from "../../../api/package/metadata";
import { CDKTypeIcon, CDKTypeText } from "../../../components/CDKType";
import { PackageTag } from "../../../components/PackageTag";
import { KEYWORD_IGNORE_LIST } from "../../../constants/keywords";

interface TagObject extends PackageTagConfig {
  isKeyword?: boolean;
}

interface HeadingProps extends StackProps {
  assembly: Assembly;
  name: string;
  description?: string;
  metadata: Metadata;
  version: string;
}

export const Heading: FunctionComponent<HeadingProps> = ({
  assembly,
  name,
  description,
  metadata,
  version,
  ...stackProps
}) => {
  const tags: TagObject[] = [
    ...(metadata.packageTags ?? []).filter((tag) => Boolean(tag.keyword)),

    ...(assembly.keywords ?? [])
      .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
      .map((label) => ({
        isKeyword: true,
        id: label,
        keyword: {
          label,
        },
      })),
  ];

  const cdkTypeProps = metadata.constructFramework ?? {};

  return (
    <Stack
      lineHeight="1.5"
      maxW="full"
      overflow="hidden"
      spacing={2}
      {...stackProps}
    >
      <Flex align="center">
        <ChakraHeading
          color="blue.800"
          flexShrink={1}
          fontSize="1.5rem"
          isTruncated
        >
          {name}
        </ChakraHeading>
        <Box as="span" flex={1} fontSize="sm" ml={4}>
          {version}
        </Box>
      </Flex>

      <Text fontSize="1rem">{description}</Text>

      <Stack align="center" direction="row" pt={3} spacing={2}>
        <CDKTypeIcon {...cdkTypeProps} />
        <CDKTypeText
          color="gray.700"
          fontSize=".75rem"
          fontWeight="semibold"
          {...cdkTypeProps}
        />
        {tags
          .slice(0, 3)
          .map(({ id, isKeyword, keyword: { label, color } = {} }) => (
            <PackageTag
              isKeyword={isKeyword}
              key={id}
              value={id}
              variant={color}
            >
              {label}
            </PackageTag>
          ))}
      </Stack>
    </Stack>
  );
};
