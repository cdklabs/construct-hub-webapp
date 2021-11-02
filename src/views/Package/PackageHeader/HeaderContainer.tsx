import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { makeGridAreas } from "../../../util/css";

export const GRID_AREAS = {
  HEADING: "heading",
  INSTALL: "install",
  LANGUAGES: "languages",
  META: "meta",
};

const baseGridAreas = makeGridAreas(
  [GRID_AREAS.HEADING],
  [GRID_AREAS.META],
  [GRID_AREAS.LANGUAGES],
  [GRID_AREAS.INSTALL]
);

const lgGridAreas = makeGridAreas(
  [GRID_AREAS.HEADING, GRID_AREAS.LANGUAGES, GRID_AREAS.INSTALL],
  [GRID_AREAS.HEADING, null, GRID_AREAS.META]
);

export const HeaderContainer: FunctionComponent = ({ children }) => (
  <Grid
    columnGap={{ md: 6, lg: 10 }}
    pt={{ base: 3, md: 6 }}
    px={{ base: 5, md: 6, lg: 10 }}
    rowGap={{ base: 4, md: 0 }}
    templateAreas={{ base: baseGridAreas, md: lgGridAreas }}
    templateColumns={{ base: "1fr", md: "1fr auto 15rem" }}
    templateRows={{ md: "auto 1fr" }}
  >
    {children}
  </Grid>
);
