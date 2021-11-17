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
import { Metadata } from "../../../api/package/metadata";
import { CDKTypeIcon, CDKTypeText } from "../../../components/CDKType";
import { PackageTag } from "../../../components/PackageTag";
import { tagObjectsFrom } from "../../../util/package";

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
  const tags = tagObjectsFrom({
    packageTags: metadata?.packageTags ?? [],
    keywords: assembly?.keywords ?? [],
  });

  const cdkTypeProps = metadata.constructFramework ?? {};

  return (
    <Stack
      lineHeight="1.5"
      maxW="full"
      overflow="hidden"
      spacing={2}
      {...stackProps}
    >
      <Flex align="center" wrap="wrap">
        <ChakraHeading
          color="blue.800"
          flexShrink={1}
          fontSize="1.5rem"
          isTruncated
          mr={4}
        >
          {name}
        </ChakraHeading>
        <Box as="span" flex={1} fontSize="sm">
          {version}
        </Box>
      </Flex>

      <Text fontSize="1rem">{description}</Text>

      <Flex
        align="center"
        direction="row"
        pt={3}
        // Chakra doesn't yet support css gap via style props
        sx={{ gap: "0.5rem" }}
        wrap="wrap"
      >
        <CDKTypeIcon {...cdkTypeProps} />
        <CDKTypeText
          color="gray.700"
          fontSize=".75rem"
          fontWeight="semibold"
          {...cdkTypeProps}
        />
        {tags.map(({ id, isKeyword, keyword: { label, color } = {} }) => (
          <PackageTag isKeyword={isKeyword} key={id} value={id} variant={color}>
            {label}
          </PackageTag>
        ))}
      </Flex>
    </Stack>
  );
};
