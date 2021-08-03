import {
  Box,
  Divider,
  Flex,
  LinkBox,
  Link,
  LinkOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { createTestIds } from "../../util/createTestIds";
import {
  getVersionedPackagePath,
  getFullPackagePath,
  getSearchPath,
} from "../../util/url";
import { LanguageSupportTooltip } from "../LanguageSupportTooltip";
import { PackageTag } from "../PackageTag";
import { Time } from "../Time";
import { CatalogCardContainer } from "./CatalogCardContainer";
import { CatalogCardSkeleton } from "./CatalogCardSkeleton";
import { useLanguage } from "hooks/useLanguage";

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
   * Specifies the language to link to by default
   */
  language?: Language;
  /**
   * If undefined, will render a skeleton
   */
  pkg?: CatalogPackage;
}

export const CatalogCard: FunctionComponent<CatalogCardProps> = ({
  language: currentLanguage,
  pkg,
}) => {
  const [savedLanguage] = useLanguage();

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

  const getUrl = (
    params?: Partial<Parameters<typeof getFullPackagePath>[0]>
  ) => {
    const baseParams = {
      name: pkg.name,
      version: pkg.version,
    };

    return params?.lang
      ? getFullPackagePath({ ...baseParams, lang: params.lang })
      : getVersionedPackagePath(baseParams);
  };

  const authorName = typeof author === "string" ? author : author.name;

  return (
    <CatalogCardContainer isLink>
      <Stack maxH="100%" maxW="100%" overflow="hidden" p={4} spacing={0}>
        {/* Name & Version */}
        <LinkOverlay href={getUrl({ lang: currentLanguage ?? savedLanguage })}>
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
        </LinkOverlay>

        {/* Tags */}
        <LinkBox
          as={Flex}
          data-testid={testIds.tags}
          flexWrap="wrap"
          maxH={6}
          overflow="hidden"
        >
          {[
            pkg.name.startsWith("@aws-cdk/") ? (
              <PackageTag
                key="official"
                label="official"
                language={currentLanguage}
                mr={1}
                value="@aws-cdk"
                variant="official"
              >
                Official
              </PackageTag>
            ) : null,
            ...pkg.keywords
              .filter(Boolean)
              .slice(0, 3)
              .map((tag) => {
                return (
                  <PackageTag
                    key={tag}
                    language={currentLanguage}
                    mr={1}
                    value={`"${tag}"`}
                  >
                    {tag}
                  </PackageTag>
                );
              }),
          ]}
        </LinkBox>
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

          <Link
            color="blue.500"
            data-testid={testIds.author}
            fontSize="sm"
            href={getSearchPath({ query: authorName })}
          >
            {authorName}
          </Link>

          {/* Language Support Icons */}
          <LinkBox align="center" as={Stack} direction="row">
            {Object.entries(LANGUAGE_RENDER_MAP)
              // Ensure entries are always sorted in a stable way
              .sort(
                ([left], [right]) =>
                  LANGUAGES.indexOf(left as Language) -
                  LANGUAGES.indexOf(right as Language)
              )
              .map(([lang, info]) => {
                const language = lang as Language;

                const isSupportedByLibrary =
                  language === Language.TypeScript ||
                  targets.includes(language);

                const isSupportedByConstructHub =
                  language === Language.TypeScript || // TypeScript is always supported
                  // Otherwise, the language must be supported by ConstructHub
                  TEMP_SUPPORTED_LANGUAGES.has(language);

                if (!isSupportedByLibrary) return null;

                const { name, icon: Icon } = info;

                const icon = (
                  <Icon
                    aria-label={`Supports ${name}`}
                    data-testid={testIds.language}
                    h={6}
                    opacity={isSupportedByConstructHub ? 1 : 0.2}
                    w={6}
                  />
                );

                return (
                  <LanguageSupportTooltip key={language} language={language}>
                    {isSupportedByConstructHub ? (
                      <Link
                        aria-label={`View package docs for ${language}`}
                        href={getUrl({ lang: language })}
                      >
                        {icon}
                      </Link>
                    ) : (
                      icon
                    )}
                  </LanguageSupportTooltip>
                );
              })}
          </LinkBox>
        </Stack>
      </Box>
    </CatalogCardContainer>
  );
};
