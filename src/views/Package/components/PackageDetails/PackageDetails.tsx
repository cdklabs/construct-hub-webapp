import { Center, Divider, Flex, Grid, Spinner, Stack } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent } from "react";
import { Config, PackageTagConfig } from "../../../../api/config";
import type { Metadata } from "../../../../api/package/metadata";
import { Card } from "../../../../components/Card";
import { KEYWORD_IGNORE_LIST } from "../../../../constants/keywords";
import type { UseRequestResponse } from "../../../../hooks/useRequest";
import { LanguageSelection } from "../LanguageSelection";
import { OperatorArea } from "../OperatorArea";
import { PackageHeader } from "../PackageHeader";
import { UseConstruct } from "../UseConstruct";

interface PackageDetailsProps {
  config: UseRequestResponse<Config>;
  assembly: UseRequestResponse<Assembly>;
  metadata: UseRequestResponse<Metadata>;
  version: string;
}

/**
 * Renders the header section of a package. This includes
  //     },
 */
export const PackageDetails: FunctionComponent<PackageDetailsProps> = ({
  assembly,
  config,
  metadata,
  version,
}) => {
  const isLoading = assembly.loading || metadata.loading;

  if (isLoading || !assembly.data || !metadata.data) {
    return (
      <Center minH="16rem">
        <Spinner size="xl" />
      </Center>
    );
  }

  // const tags: PackageKeyword[] = [
  //   ...(metadata?.data?.packageTags?.reduce(
  //     (accum: PackageKeyword[], tag: PackageTagConfig): PackageKeyword[] => {
  //       if (tag.keyword) {
  //         return [...accum, tag.keyword];
  //       }
  //       return accum;
  //     },
  //     []
  //   ) ?? []),
  //   ...(assembly?.data?.keywords
  //     ?.filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
  //     .map((label) => ({
  //       label,
  //     })) ?? []),
  // ];

  const tags: PackageTagConfig[] = [
    ...(metadata?.data?.packageTags?.filter((tag) => Boolean(tag.keyword)) ??
      []),
    ...(assembly?.data?.keywords
      ?.filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
      .map((label) => ({
        id: label,
        keyword: {
          label,
        },
      })) ?? []),
  ];

  return (
    <Flex as={Card} direction="column">
      <Grid
        gap={4}
        overflow="hidden"
        templateColumns={{ base: "1fr", md: "3fr auto 2fr" }}
        templateRows="auto"
      >
        <PackageHeader
          description={assembly.data.description}
          tags={tags}
          title={assembly.data.name}
          version={version}
        />
        <Divider
          display={{ base: "none", md: "initial" }}
          orientation="vertical"
        />
        <Divider
          display={{ base: "initial", md: "none" }}
          orientation="horizontal"
        />
        {config.loading ? (
          <Center minH="16rem">
            <Spinner size="xl" />
          </Center>
        ) : (
          <OperatorArea
            assembly={assembly.data}
            linksConfig={config.data?.packageLinks}
            metadata={metadata.data}
          />
        )}
      </Grid>
      <Stack
        align="center"
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        px={2}
        py={4}
        spacing={4}
      >
        <LanguageSelection assembly={assembly.data} />
        <UseConstruct assembly={assembly.data} />
      </Stack>
    </Flex>
  );
};
