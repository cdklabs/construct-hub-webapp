import {
  ArrowForwardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Grid, GridItem, Button, Flex, IconButton } from "@chakra-ui/react";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { testIds } from "./constants";

const iconBtnProps = {
  borderRadius: "md",
  borderColor: "blue.500",
  colorScheme: "blue",
  mx: 2,
  h: 10,
  w: 10,
  variant: "outline",
};

const iconProps = {
  color: "blue.500",
  h: 5,
  w: 5,
};

export interface HomePageControlsProps {
  offset: number;
  pageLimit: number;
  setOffset: Dispatch<SetStateAction<number>>;
}

export const HomePageControls: FunctionComponent<HomePageControlsProps> = ({
  offset,
  pageLimit,
  setOffset,
}) => {
  const nextDisabled = offset === pageLimit;
  const prevDisabled = offset === 0;

  const getNextPage = () => {
    setOffset(offset + 1);
  };

  const getPrevPage = () => {
    setOffset(offset - 1);
  };

  return (
    <Grid
      alignItems="center"
      pt={6}
      templateColumns="repeat(3, 1fr)"
      templateRows="1fr"
    >
      <GridItem colStart={2} justifySelf="center">
        <Button
          colorScheme="blue"
          data-testid={testIds.nextPageBtn}
          disabled={nextDisabled}
          onClick={getNextPage}
          rightIcon={<ArrowForwardIcon color="white" />}
        >
          Next Page
        </Button>
      </GridItem>
      <GridItem colStart={3} justifySelf="end">
        <Flex align="center" justify="center" py={4}>
          <IconButton
            aria-label="Previous Page"
            data-testid={testIds.prevIcon}
            disabled={prevDisabled}
            icon={<ChevronLeftIcon {...iconProps} />}
            onClick={getPrevPage}
            {...iconBtnProps}
          />
          <IconButton
            aria-label="Next Page"
            data-testid={testIds.nextIcon}
            disabled={nextDisabled}
            icon={<ChevronRightIcon {...iconProps} />}
            onClick={getNextPage}
            {...iconBtnProps}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};
