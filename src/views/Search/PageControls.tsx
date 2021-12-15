import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventName } from "../../contexts/Analytics";
import { offsetState, pageLimitState } from "../../state/search";
import { ArrowButton } from "./ArrowButton";
import { SEARCH_ANALYTICS } from "./constants";
import { GoToPage } from "./GoToPage";
import testIds from "./testIds";

export const PageControls: FunctionComponent = () => {
  const [offset, setOffset] = useRecoilState(offsetState);
  const pageLimit = useRecoilValue(pageLimitState);

  const goBack = offset > 0 ? () => setOffset(offset - 1) : undefined;
  const goNext = offset < pageLimit ? () => setOffset(offset + 1) : undefined;

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
      />
      <ArrowButton
        data-event={eventName(SEARCH_ANALYTICS.RESULTS, "Next Page")}
        data-testid={testIds.nextPage}
        icon={ChevronRightIcon}
        label="Next page button"
        onClick={goNext}
      />
    </Stack>
  );
};
