import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { makeGridAreas } from "../../../util/css";

export const GRID_AREAS = {
  HEADING: "heading",
  INSTALL: "install",
  VERSION: "version",
  LANGUAGES: "languages",
  META: "meta",
};

const baseGridAreas = makeGridAreas(
  [GRID_AREAS.HEADING],
  [GRID_AREAS.META],
  [GRID_AREAS.VERSION],
  [GRID_AREAS.LANGUAGES],
  [GRID_AREAS.INSTALL]
);

const lgGridAreas = makeGridAreas(
  [
    GRID_AREAS.HEADING,
    GRID_AREAS.VERSION,
    GRID_AREAS.LANGUAGES,
    GRID_AREAS.INSTALL,
  ],
  [GRID_AREAS.HEADING, null, null, GRID_AREAS.META]
);

export const HeaderContainer: FunctionComponent = ({ children }) => (
  <Grid
    columnGap={{ md: 3, lg: 3 }}
    pt={{ base: 3, lg: 6 }}
    px={{ base: 5, md: 6, lg: 10 }}
    rowGap={{ base: 4, lg: 0 }}
    templateAreas={{ base: baseGridAreas, lg: lgGridAreas }}
    templateColumns={{ base: "1fr", lg: "1fr auto auto 15rem" }}
    templateRows={{ lg: "auto 1fr" }}
  >
    {children}
  </Grid>
);
