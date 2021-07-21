import { Box, Flex, Stack, Tag, Text, Divider } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { createTestIds } from "../../util/createTestIds";
import { ExternalLink } from "../ExternalLink";
import { Time } from "../Time";
import { CatalogCardContainer } from "./CatalogCardContainer";
import { CatalogCardSkeleton } from "./CatalogCardSkeleton";

export const testIds = createTestIds("catalog-card", [
  "name",
  "version",
  "tags",
  "description",
  "date",
  "author",
  "language",
] as const);

export interface CatalogCardProps {
  /**
   * If undefined, will render a skeleton
   */
  pkg?: CatalogPackage;
  /**
   * If defined, will wrap the card in a <Link />
   */
  url?: string;
}

export const CatalogCard: FunctionComponent<CatalogCardProps> = ({
  pkg,
  url,
}) => {
  if (!pkg) {
    return (
      <CatalogCardContainer>
        <CatalogCardSkeleton />
      </CatalogCardContainer>
    );
  }

  const publishDate = pkg.metadata?.date ? (
    <Time
      date={new Date(pkg.metadata.date)}
      fontSize="sm"
      format="MMMM dd, yyyy"
    />
  ) : null;

  const author = pkg.author ?? {};
  const languages = pkg.languages ?? {};
  const targets = Object.keys(languages) as Language[];

  return (
    <CatalogCardContainer url={url}>
      <Stack maxH="100%" maxW="100%" overflow="hidden" p={4} spacing={2}>
        {/* Name & Version */}
        <Text
          color="blue.800"
          data-testid={testIds.name}
          fontWeight="semibold"
          isTruncated
        >
          {pkg.name}

          <Text
            as="span"
            color="blue.500"
            data-testid={testIds.version}
            fontSize="xs"
            ml={2}
          >
            {pkg.version}
          </Text>
        </Text>

        {/* Tags */}
        <Flex
          data-testid={testIds.tags}
          flexWrap="wrap"
          maxH={6}
          overflow="hidden"
        >
          {pkg.keywords
            .filter(Boolean)
            .slice(0, 3)
            .map((tag) => {
              return (
                <Tag key={tag} mr={1}>
                  {tag}
                </Tag>
              );
            })}
        </Flex>
        <Text data-testid={testIds.description} fontSize="sm" noOfLines={2}>
          {pkg.description}
        </Text>
      </Stack>

      {/* Bottom Details */}
      <Box>
        <Divider />
        <Stack maxW="100%" overflow="hidden" px={4} py={2} spacing={2}>
          <Text data-testid={testIds.date} fontSize="sm" isTruncated>
            {publishDate}
          </Text>

          {typeof author === "string" ? (
            <Text data-testid={testIds.author} fontSize="sm" isTruncated>
              {author}
            </Text>
          ) : author.url ? (
            <ExternalLink
              data-testid={testIds.author}
              fontSize="sm"
              href={author.url}
              onClick={(e) => e.stopPropagation()}
            >
              {author.name}
            </ExternalLink>
          ) : (
            <Text data-testid={testIds.author} fontSize="sm" isTruncated>
              {typeof author === "string" ? author : author.name}
            </Text>
          )}

          {/* Language Support Icons */}
          <Stack align="center" direction="row">
            {Object.entries(LANGUAGE_RENDER_MAP)
              // Ensure entries are always sorted in a stable way
              .sort(
                ([left], [right]) =>
                  LANGUAGES.indexOf(left as Language) -
                  LANGUAGES.indexOf(right as Language)
              )
              .map(([language, info]) => {
                const isSupported =
                  language === Language.TypeScript || // TypeScript is always supported
                  // Otherwise, the language must be supported by ConstructHub
                  (TEMP_SUPPORTED_LANGUAGES.has(language as Language) &&
                    // AND be in the package's targets
                    targets.includes(language as Language));

                const { name, icon: Icon } = info;
                const label = isSupported
                  ? `Supports ${name}`
                  : `Does not support ${name}`;

                return (
                  <Icon
                    aria-label={label}
                    data-testid={testIds.language}
                    h={6}
                    key={language}
                    opacity={isSupported ? 1 : 0.2}
                    w={6}
                  />
                );
              })}
          </Stack>
        </Stack>
      </Box>
    </CatalogCardContainer>
  );
};
