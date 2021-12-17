import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { eventName } from "../../contexts/Analytics";
import { ArrowButton } from "./ArrowButton";
import { SEARCH_ANALYTICS } from "./constants";
import { GoToPage } from "./GoToPage";
import testIds from "./testIds";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

export interface PageControlsProps {
  offset: number;
  pageLimit: number;
}

export const PageControls: FunctionComponent<PageControlsProps> = ({
  offset,
  pageLimit,
}) => {
  const updateSearch = useUpdateSearchParam();
  const goForward =
    offset < pageLimit ? () => updateSearch({ offset: offset + 1 }) : undefined;
  const goBack =
    offset > 0 ? () => updateSearch({ offset: offset - 1 }) : undefined;

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
        data-event={eventName(SEARCH_ANALYTICS.RESULTS, "Previous Page")}
        data-testid={testIds.prevPage}
        icon={ChevronLeftIcon}
        label="Previous page button"
        onClick={goBack}
      />
      <GoToPage
        data-event={eventName(SEARCH_ANALYTICS.RESULTS, "Go to Page")}
        data-testid={testIds.goToPage}
        offset={offset}
        pageLimit={pageLimit}
      />
      <ArrowButton
        data-event={eventName(SEARCH_ANALYTICS.RESULTS, "Next Page")}
        data-testid={testIds.nextPage}
        icon={ChevronRightIcon}
        label="Next page button"
        onClick={goForward}
      />
    </Stack>
  );
};
