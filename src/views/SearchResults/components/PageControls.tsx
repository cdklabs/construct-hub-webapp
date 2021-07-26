import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ArrowButton } from "./ArrowButton";
import { GoToPage } from "./GoToPage";
import { NextPage } from "./NextPage";

export interface PageControlsProps {
  limit: number;
  offset: number;
  pageLimit: number;
  getPageUrl: (params: { offset?: number }) => string;
}

export const PageControls: FunctionComponent<PageControlsProps> = ({
  offset,
  pageLimit,
  getPageUrl,
}) => {
  const nextOffset = offset < pageLimit ? offset + 1 : undefined;
  const prevOffset = offset > 0 ? offset - 1 : undefined;

  return (
    <Grid
      alignItems="center"
      pt={4}
      templateColumns="repeat(3, 1fr)"
      templateRows="1fr"
    >
      <GridItem colStart={2} justifySelf="center">
        <NextPage
          nextPageUrl={
            nextOffset ? getPageUrl({ offset: nextOffset }) : undefined
          }
        />
      </GridItem>
      <GridItem colStart={3} justifySelf="end">
        <Flex align="center" justify="center" py={4}>
          <GoToPage
            getPageUrl={getPageUrl}
            offset={offset}
            pageLimit={pageLimit}
          />
          <ArrowButton
            getPageUrl={getPageUrl}
            icon={ChevronLeftIcon}
            offset={prevOffset}
          />
          <ArrowButton
            getPageUrl={getPageUrl}
            icon={ChevronRightIcon}
            offset={nextOffset}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};
