import { Divider, Flex, Grid, Image, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { NavLink } from "../../components/NavLink";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import {
  Language,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { getSearchPath } from "../../util/url";
import { InfoSection } from "./InfoSection";

export const Info: FunctionComponent = () => (
  <Grid
    bg="white"
    templateColumns={{ base: "1fr", lg: "1fr auto 1fr" }}
    templateRows={{ base: "1fr auto 1fr", lg: "1fr" }}
    textAlign="center"
  >
    <InfoSection
      description="The Construct Hub is a central destination for discovering and sharing
          cloud application design patterns and reference architectures defined
          for the AWS CDK, CDK for Kubernetes (CDK8s), CDK for Terraform (CDKtf)
          and other construct-based tools."
      title="Browse 600+ reusable cloud application libraries for popular IaC frameworks"
    >
      <Flex align="center" justify="space-evenly" pt={4} wrap="wrap">
        {Object.entries(CDKTYPE_RENDER_MAP).map(
          ([cdktype, { name, imgsrc }]) => (
            <Stack align="center" color="blue.500" key={cdktype} spacing={2}>
              <Image aria-label={name} h={8} src={imgsrc} />
              <NavLink to={getSearchPath({ cdkType: cdktype as CDKType })}>
                {name}
              </NavLink>
            </Stack>
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
      description="Create cloud applications faster with reusable infrastructure building
          blocks in your favorite programming language. Develop faster by
          getting helpful API reference + code samples which are automatically
          generated for Typescript, Python, .NET or Java (Go coming soon)!"
      title="Build using familiar programming languages. Code samples and API reference included."
    >
      <Flex align="center" justify="space-evenly" pt={4} wrap="wrap">
        {Object.entries(LANGUAGE_RENDER_MAP)
          .filter(([language]) =>
            TEMP_SUPPORTED_LANGUAGES.has(language as Language)
          )
          .map(([language, { icon: Icon, name }]) => (
            <Stack align="center" color="blue.500" key={language} spacing={2}>
              <Icon aria-label={name} h={8} w={8} />
              <NavLink
                to={getSearchPath({ languages: [language as Language] })}
              >
                {name}
              </NavLink>
            </Stack>
          ))}
      </Flex>
    </InfoSection>
  </Grid>
);
