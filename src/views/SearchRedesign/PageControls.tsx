import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ArrowButton } from "../SearchResults/components/ArrowButton";
import { GoToPage } from "../SearchResults/components/GoToPage";
import testIds from "./testIds";

export interface PageControlsProps {
  offset: number;
  pageLimit: number;
  getPageUrl: (params: { offset?: number }) => string;
}

export const PageControls: FunctionComponent<PageControlsProps> = ({
  offset,
  getPageUrl,
  pageLimit,
}) => {
  const nextOffset = offset < pageLimit ? offset + 1 : undefined;
  const prevOffset = offset > 0 ? offset - 1 : undefined;

  return (
    <Stack
      align="center"
      direction="row"
      justify="space-between"
      maxW="18rem"
      mx="auto"
      spacing={4}
      w="full"
    >
      <ArrowButton
        data-testid={testIds.prevPage}
        getPageUrl={getPageUrl}
        icon={ChevronLeftIcon}
        offset={prevOffset}
      />
      <GoToPage
        data-testid={testIds.goToPage}
        getPageUrl={getPageUrl}
        offset={offset}
        pageLimit={pageLimit}
      />
      <ArrowButton
        data-testid={testIds.nextPage}
        getPageUrl={getPageUrl}
        icon={ChevronRightIcon}
        offset={nextOffset}
      />
    </Stack>
  );
};
