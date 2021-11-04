import { Divider, Flex, Grid, Image, Stack } from "@chakra-ui/react";
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
import { InfoSection } from "./InfoSection";
import testIds from "./testIds";

export const Info: FunctionComponent = () => (
  <Grid
    bg="white"
    data-testid={testIds.infoContainer}
    templateColumns={{ base: "1fr", lg: "1fr auto 1fr" }}
    templateRows={{ base: "1fr auto 1fr", lg: "1fr" }}
    textAlign="left"
  >
    <InfoSection
      description="We support CDK for CloudFormation (AWS CDK), which generates CloudFormation templates, CDK for Terraform (CDKtf), which generates Terraform-friendly JSON files, and CDK for Kubernetes (CDK8s), which generates Kubernetes manifests."
      title="Supported CDKs"
    >
      <Flex align="center" justify="space-evenly" pt={4} wrap="wrap">
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
      description="For each CDK library you can find helpful documentation, such as API references and code samples in Java, .NET, TypeScript and Python. Create cloud resources and define your application using loops, conditionals, GitOps, code completion, and manifest testing."
      title="Supported programming languages"
    >
      <Flex align="center" justify="space-evenly" pt={4} wrap="wrap">
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
);
