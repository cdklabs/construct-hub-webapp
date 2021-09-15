import { Center, Heading, Spinner, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCard } from "../PackageCard";

export interface ListResultsProps {
  loading?: boolean;
  results?: CatalogPackage[];
  title?: string;
}

export const ListResults: FunctionComponent<ListResultsProps> = ({
  loading,
  results,
  title,
}) => {
  return (
    <Stack spacing={4}>
      {title ? (
        <Heading as="h2" color="blue.500" fontWeight="bold" size="md">
          {title}
        </Heading>
      ) : null}
      {loading || !results ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        results.map((pkg) => (
          <PackageCard key={`${pkg.name}-${pkg.version}`} pkg={pkg} />
        ))
      )}
    </Stack>
  );
};
