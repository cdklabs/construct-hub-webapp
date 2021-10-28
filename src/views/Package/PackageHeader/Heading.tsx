import {
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

interface HeadingProps extends StackProps {
  assembly: Assembly;
  name: string;
  description?: string;
  metadata: Metadata;
}

export const Heading: FunctionComponent<HeadingProps> = ({
  assembly,
  name,
  description,
  metadata,
  ...stackProps
}) => {
  const tags: PackageTagConfig[] = [
    ...(metadata.packageTags ?? []).filter((tag) => Boolean(tag.keyword)),
    ...(assembly.keywords ?? [])
      .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
      .map((label) => ({
        id: label,
        keyword: {
          label,
        },
      })),
  ];

  return (
    <Stack lineHeight="1.5" spacing={2} {...stackProps}>
      <ChakraHeading color="blue.800" fontSize="1.5rem">
        {name}
      </ChakraHeading>

      <Text fontSize="1rem">{description}</Text>

      <Stack align="center" direction="row" pt={3} spacing={2}>
        <CDKTypeIcon metadata={metadata} />
        <CDKTypeText
          color="gray.700"
          fontSize=".75rem"
          fontWeight="semibold"
          metadata={metadata}
        />
        {tags.slice(0, 3).map(({ id, keyword: { label, color } = {} }) => (
          <PackageTag key={id} mr={1} value={id} variant={color}>
            {label}
          </PackageTag>
        ))}
      </Stack>
    </Stack>
  );
};
