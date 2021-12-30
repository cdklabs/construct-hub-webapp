import { Button, Flex, Grid, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { DEFAULT_FEATURED_PACKAGES } from "../../api/config";
import { NavLink } from "../../components/NavLink";
import { PackageCard } from "../../components/PackageCard";
import { eventName } from "../../contexts/Analytics";
import { useConfigValue } from "../../hooks/useConfigValue";
import { getSearchPath } from "../../util/url";
import { HOME_ANALYTICS, SECTION_PADDING } from "./constants";
import testIds from "./testIds";
import { useSection } from "./useSection";

export const Featured: FunctionComponent = () => {
  const homePackages = useConfigValue("featuredPackages");

  const [featured = { name: "Recently Updated", showLastUpdated: 4 }] = (
    homePackages ?? DEFAULT_FEATURED_PACKAGES
  ).sections;

  const section = useSection(featured);

  if (!section) {
    return null;
  }

  return (
    <Flex
      color="white"
      data-testid={testIds.featuredContainer}
      direction="column"
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
      zIndex="0"
    >
      <Heading
        as="h3"
        data-testid={testIds.featuredHeader}
        fontSize="1.5rem"
        fontWeight="semibold"
        lineHeight="lg"
      >
        {featured.name}
      </Heading>
      <Grid
        data-testid={testIds.featuredGrid}
        gap={4}
        mt={8}
        templateColumns={{ base: "1fr", xl: "1fr 1fr" }}
      >
        {section?.slice(0, 4).map((pkg) => (
          <PackageCard
            data-event={HOME_ANALYTICS.FEATURED}
            key={pkg.name}
            pkg={pkg}
          />
        ))}
      </Grid>
      <Button
        as={NavLink}
        boxShadow="md"
        colorScheme="brand"
        data-event={eventName(HOME_ANALYTICS.FEATURED, "See All")}
        mx="auto"
        my={8}
        onClick={() => window.scrollTo(0, 0)}
        to={getSearchPath({ sort: CatalogSearchSort.DownloadsDesc })}
      >
        See all constructs
      </Button>
    </Flex>
  );
};
