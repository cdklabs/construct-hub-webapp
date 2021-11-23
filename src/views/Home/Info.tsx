import {
  Divider,
  Flex,
  Grid,
  Icon as ChakraIcon,
  Image,
  Stack,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { NavLink } from "../../components/NavLink";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import {
  Language,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { DatadogIcon } from "../../icons/DatadogIcon";
import { MongoDBIcon } from "../../icons/MongoDBIcon";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import { InfoSection } from "./InfoSection";
import testIds from "./testIds";

const publishers = [
  {
    name: "Datadog",
    Icon: DatadogIcon,
    url: getSearchPath({ keywords: ["Datadog"] }),
  },
  {
    name: "MongoDB",
    Icon: MongoDBIcon,
    url: getSearchPath({ keywords: ["MongoDB"] }),
  },
  {
    name: "Aqua Security",
    imgsrc: "/assets/aqua-security.png",
    url: getSearchPath({ keywords: ["aqua"] }),
  },
];

const IconLink = ({
  url,
  imgsrc,
  label,
  Icon,
}: {
  url: string;
  label: string;
  imgsrc?: string;
  Icon?: typeof ChakraIcon;
}) => (
  <NavLink
    color="blue.500"
    data-testid={testIds.infoSectionIcon}
    fontWeight="bold"
    to={url}
  >
    <Stack align="center" spacing={2}>
      {imgsrc && <Image aria-label={label} h={8} src={imgsrc} />}
      {Icon && <Icon aria-label={label} h={8} w={8} />}
      <span>{label}</span>
    </Stack>
  </NavLink>
);

const ResponsiveDivider = () => (
  <>
    <Divider display={{ xl: "none" }} mx={SECTION_PADDING.X} w="auto" />
    <Divider
      display={{ base: "none", xl: "initial" }}
      h="auto"
      my={SECTION_PADDING.Y}
      orientation="vertical"
    />
  </>
);

const Row: FunctionComponent = ({ children }) => (
  <Flex align="center" pt={4} sx={{ gap: "2rem" }}>
    {children}
  </Flex>
);

export const Info: FunctionComponent = () => (
  <Flex bg="white" data-testid={testIds.infoContainer} direction="column">
    <Grid
      templateColumns={{ base: "1fr", xl: "1fr auto 1fr auto 1fr" }}
      templateRows={{ base: "1fr auto 1fr auto 1fr", xl: "auto" }}
    >
      <InfoSection
        description=" For all three CDKs: AWS CDK, which generates CloudFormation templates, CDK for Terraform (CDKtf), which generates HashiCorp Terraform configuration, and CDK for Kubernetes (CDK8s), which generates Kubernetes manifests."
        title="A single home for all CDKs"
      >
        <Row>
          {Object.entries(CDKTYPE_RENDER_MAP).map(
            ([cdktype, { name, imgsrc }]) => (
              <IconLink
                imgsrc={imgsrc}
                key={cdktype}
                label={name}
                url={getSearchPath({
                  cdkType: cdktype as CDKType,
                  sort: CatalogSearchSort.DownloadsDesc,
                })}
              />
            )
          )}
        </Row>
      </InfoSection>

      <ResponsiveDivider />

      <InfoSection
        description="Find documentation, API reference, and code samples in CDK-supported languages, such as Java, .NET, TypeScript, and Python. Define, test, and deploy cloud infrastructure using loops, conditionals, unit testing, and data structures."
        title="Support across languages"
      >
        <Row>
          {Object.entries(LANGUAGE_RENDER_MAP)
            .filter(([language]) =>
              TEMP_SUPPORTED_LANGUAGES.has(language as Language)
            )
            .map(([language, { icon: Icon, name }]) => (
              <IconLink
                Icon={Icon as typeof ChakraIcon}
                key={language}
                label={name}
                url={getSearchPath({
                  languages: [language as Language],
                  sort: CatalogSearchSort.DownloadsDesc,
                })}
              />
            ))}
        </Row>
      </InfoSection>

      <ResponsiveDivider />

      <InfoSection
        description="Find construct libraries for integration from the community and cloud services, including Datadog, MongoDB, Aqua Security, and more."
        title="
       Constructs from multiple publishers"
      >
        <Row>
          {publishers.map(({ url, name, imgsrc, Icon }) => (
            <IconLink
              Icon={Icon}
              imgsrc={imgsrc}
              key={name}
              label={name}
              url={url}
            />
          ))}
        </Row>
      </InfoSection>
    </Grid>
  </Flex>
);
