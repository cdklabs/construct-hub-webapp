import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ArrowButton } from "./ArrowButton";
import { GoToPage } from "./GoToPage";

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
  const nextFiveOffset = offset <= pageLimit - 5 ? offset + 5 : undefined;
  const prevFiveOffset = offset - 5 >= 0 ? offset - 5 : undefined;

  return (
    <Flex align="center" justifyContent="center" py={4}>
      <ArrowButton
        getPageUrl={getPageUrl}
        icon={ArrowLeftIcon}
        offset={prevFiveOffset}
      />
      <ArrowButton
        getPageUrl={getPageUrl}
        icon={ChevronLeftIcon}
        offset={prevOffset}
      />
      <GoToPage getPageUrl={getPageUrl} offset={offset} pageLimit={pageLimit} />
      <ArrowButton
        getPageUrl={getPageUrl}
        icon={ChevronRightIcon}
        offset={nextOffset}
      />
      <ArrowButton
        getPageUrl={getPageUrl}
        icon={ArrowRightIcon}
        offset={nextFiveOffset}
      />
    </Flex>
  );
};
