import { Box, Divider, Flex, Grid, Image, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { NavLink } from "../../components/NavLink";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import {
  Language,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import { InfoSection } from "./InfoSection";
import testIds from "./testIds";

export const Info: FunctionComponent = () => (
  <Flex bg="white" direction="column">
    <Box px={SECTION_PADDING.X} py={SECTION_PADDING.Y}>
      <Text
        color="blue.800"
        fontSize="1.25rem"
        lineHeight="1.5"
        textAlign="center"
      >
        Construct Hub is a place to discover Cloud Development Kit (CDK)
        construct libraries, building blocks for cloud applications published by
        the open-source community, AWS, and partners. CDK is a software
        development framework for defining cloud infrastructure using familiar
        programming languages.
      </Text>
    </Box>

    <Divider mx={SECTION_PADDING.X} w="auto" />

    <Grid
      data-testid={testIds.infoContainer}
      templateColumns={{ base: "1fr", lg: "1fr auto 1fr" }}
      templateRows={{ base: "1fr auto 1fr", lg: "1fr" }}
      textAlign="left"
    >
      <InfoSection
        description=" For all three CDKs: AWS CDK, which generates CloudFormation templates, CDK for Terraform (CDKtf), which generates HashiCorp Terraform configuration, and CDK for Kubernetes (CDK8s), which generates Kubernetes manifests."
        title="A single home for all CDKs"
      >
        <Flex align="center" pt={4} sx={{ gap: "4rem" }} wrap="wrap">
          {Object.entries(CDKTYPE_RENDER_MAP).map(
            ([cdktype, { name, imgsrc }]) => (
              <NavLink
                color="blue.500"
                data-testid={testIds.infoSectionIcon}
                fontWeight="bold"
                key={cdktype}
                to={getSearchPath({
                  cdkType: cdktype as CDKType,
                  sort: CatalogSearchSort.DownloadsDesc,
                })}
              >
                <Stack align="center" spacing={2}>
                  <Image aria-label={name} h={8} src={imgsrc} />
                  <span>{name}</span>
                </Stack>
              </NavLink>
            )
          )}
        </Flex>
      </InfoSection>

      <Divider
        display={{ base: "none", lg: "initial" }}
        h="auto"
        my={10}
        orientation="vertical"
      />
      <Divider display={{ lg: "none" }} mx={10} w="auto" />

      <InfoSection
        description="Find documentation, API reference, and code samples in CDK-supported languages, such as Java, C#, TypeScript, and Python. Define, test, and deploy cloud infrastructure using loops, conditionals, unit testing, and data structures."
        title="Support across languages"
      >
        <Flex align="center" pt={4} sx={{ gap: "4rem" }} wrap="wrap">
          {Object.entries(LANGUAGE_RENDER_MAP)
            .filter(([language]) =>
              TEMP_SUPPORTED_LANGUAGES.has(language as Language)
            )
            .map(([language, { icon: Icon, name }]) => (
              <NavLink
                color="blue.500"
                data-testid={testIds.infoSectionIcon}
                fontWeight="bold"
                key={language}
                to={getSearchPath({
                  languages: [language as Language],
                  sort: CatalogSearchSort.DownloadsDesc,
                })}
              >
                <Stack align="center" key={language} spacing={2}>
                  <Icon aria-label={name} h={8} w={8} />
                  <span>{name}</span>
                </Stack>
              </NavLink>
            ))}
        </Flex>
      </InfoSection>
    </Grid>
  </Flex>
);
