import { Box, Divider, Skeleton, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const CatalogCardSkeleton: FunctionComponent = () => (
  <>
    <Stack p={4} spacing={4}>
      <Skeleton h={5} w="50%" />
      <Stack align="center" direction="row" spacing={2}>
        <Skeleton h={5} w={10} />
        <Skeleton h={5} w={10} />
        <Skeleton h={5} w={10} />
      </Stack>
      <Skeleton h={3} w="75%" />
      <Skeleton h={3} w="50%" />
    </Stack>
    <Box>
      <Divider />
      <Stack px={4} py={2} spacing={2}>
        <Skeleton h={5} w="25%" />
        <Stack align="center" direction="row" spacing={2}>
          <Skeleton h={5} w={10} />
          <Skeleton h={5} w={10} />
          <Skeleton h={5} w={10} />
          <Skeleton h={5} w={10} />
        </Stack>
      </Stack>
    </Box>
  </>
);
