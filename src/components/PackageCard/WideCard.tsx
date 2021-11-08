import { Grid, Stack, LinkBox, Divider } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { PackageTagConfig, PackageHighlight } from "../../api/config";
import { makeGridAreas } from "../../util/css";
import { Details } from "./Details";
import { Heading } from "./Heading";
import { Highlight } from "./Highlight";
import { Languages } from "./Languages";
import { usePackageCard } from "./PackageCard";
import { Tags } from "./Tags";
import testIds from "./testIds";

const GRID_AREA = {
  DETAILS: "details",
  LANGUAGES: "languages",
  TAGS: "tags",
  HEADING: "heading",
};

const gridAreasMd = makeGridAreas(
  [GRID_AREA.HEADING, GRID_AREA.HEADING, GRID_AREA.DETAILS],
  [GRID_AREA.HEADING, GRID_AREA.HEADING, GRID_AREA.DETAILS],
  [GRID_AREA.TAGS, GRID_AREA.TAGS, GRID_AREA.LANGUAGES]
);

const gridAreasMobile = makeGridAreas(
  [GRID_AREA.HEADING],
  [GRID_AREA.LANGUAGES],
  [GRID_AREA.DETAILS]
);

export const WideCard: FunctionComponent = () => {
  const highlights =
    usePackageCard()?.metadata?.packageTags?.reduce(
      (
        accum: PackageHighlight[],
        tag: PackageTagConfig
      ): PackageHighlight[] => {
        if (tag.highlight) {
          return [...accum, tag.highlight];
        }
        return accum;
      },
      []
    ) ?? [];

  return (
    <LinkBox
      _hover={{
        "> article": {
          bg: "gray.50",
        },
      }}
    >
      <Grid
        as="article"
        autoColumns="1fr"
        autoRows="auto"
        bg="white"
        border="base"
        borderRadius="sm"
        boxShadow="base"
        color="gray.600"
        data-testid={testIds.wideContainer}
        gap={5}
        h="100%"
        p={5}
        templateAreas={{ base: gridAreasMobile, md: gridAreasMd }}
        w="100%"
      >
        {/* Name + Desc */}
        <Stack gridArea={GRID_AREA.HEADING} spacing={2}>
          <Heading />
        </Stack>

        <Stack
          direction="row"
          display={{ base: "none", md: "initial" }}
          gridArea={GRID_AREA.TAGS}
          maxH={6}
          overflow="hidden"
          spacing={2}
        >
          <Tags />
        </Stack>

        <Grid
          alignItems="start"
          alignSelf="center"
          autoColumns={{ base: "initial", md: "1fr" }}
          autoRows={{ base: "initial", md: "auto" }}
          fontSize="xs"
          gap={{ base: 0, md: 1 }}
          gridArea={GRID_AREA.DETAILS}
          templateColumns={{ base: "1fr 1fr", md: "initial" }}
          templateRows={{ base: "1fr 1fr", md: "initial" }}
        >
          {highlights.map((highlight) => (
            <Highlight key={highlight.label} {...highlight} />
          ))}
          <Details />
        </Grid>

        <Stack gridArea={GRID_AREA.LANGUAGES} spacing={{ base: 4, md: 0 }}>
          <Divider display={{ md: "none" }} />
          <Stack data-testid={testIds.languages} direction="row" spacing={1}>
            <Languages />
          </Stack>
        </Stack>
      </Grid>
    </LinkBox>
  );
};
