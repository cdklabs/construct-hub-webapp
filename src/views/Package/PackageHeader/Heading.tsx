import {
  Flex,
  Stack,
  StackProps,
  Heading as ChakraHeading,
  Text,
} from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import type { FunctionComponent } from "react";
import { Metadata } from "../../../api/package/metadata";
import { CDKTypeBadge } from "../../../components/CDKType";
import { PackageTag } from "../../../components/PackageTag";
import { tagObjectsFrom } from "../../../util/package";
import { PACKAGE_ANALYTICS } from "../constants";
import testIds from "../testIds";
import { SelectVersion } from "./SelectVersion";

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
          color="textPrimary"
          flexShrink={1}
          fontSize="1.5rem"
          isTruncated
          mr={4}
        >
          {name}
        </ChakraHeading>
        <SelectVersion />
      </Flex>

      <Text data-testid={testIds.description} fontSize="1rem">
        {description}
      </Text>

      <Flex
        align="center"
        direction="row"
        pt={1}
        // Chakra doesn't yet support css gap via style props
        sx={{ gap: "0.5rem" }}
        wrap="wrap"
      >
        <CDKTypeBadge
          data-event={PACKAGE_ANALYTICS.CDK_BADGE.eventName(
            `${cdkTypeProps.name}${
              cdkTypeProps.majorVersion !== undefined
                ? ` v${cdkTypeProps.majorVersion}`
                : ""
            }`
          )}
          {...cdkTypeProps}
        />
        {tags.map(({ id, keyword: { label, color } = {} }) => (
          <PackageTag
            data-event={PACKAGE_ANALYTICS.KEYWORD.eventName(label!)}
            key={id}
            value={id}
            variant={color}
          >
            {label}
          </PackageTag>
        ))}
      </Flex>
    </Stack>
  );
};
