import {
  ArrowForwardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Grid, GridItem, Button, Flex, IconButton } from "@chakra-ui/react";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";

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
          disabled={nextDisabled}
          onClick={() => setOffset((o) => o + 1)}
          rightIcon={<ArrowForwardIcon color="white" />}
        >
          Next Page
        </Button>
      </GridItem>
      <GridItem colStart={3} justifySelf="end">
        <Flex align="center" justify="center" py={4}>
          <IconButton
            aria-label="Previous Page"
            disabled={prevDisabled}
            icon={<ChevronLeftIcon {...iconProps} />}
            onClick={() => setOffset((o) => o - 1)}
            {...iconBtnProps}
          />
          <IconButton
            aria-label="Next Page"
            disabled={nextDisabled}
            icon={<ChevronRightIcon {...iconProps} />}
            onClick={() => setOffset((o) => o + 1)}
            {...iconBtnProps}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
};
