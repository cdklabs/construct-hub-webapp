import { Center, Flex, Spinner } from "@chakra-ui/react";
import type { Metadata } from "../../api/package/metadata";
import { UseRequestResponse } from "../../hooks/useRequest";
import { PackageHeader } from "../PackageHeader";

export interface PublisherAreaProps {
  metadata: UseRequestResponse<Metadata>;
}

export function PublisherArea({ metadata }: PublisherAreaProps) {
  const { loading, data } = metadata;

  return (
    <Flex direction="column" w="100%">
      {data && !loading ? (
        <PackageHeader
          title={data.name}
          description={data.description}
          tags={data.keywords}
        />
      ) : (
        <Center bg="white" borderRadius="md" p={5}>
          <Spinner size="xl" />
        </Center>
      )}
      {/* TODO: Version Dropdown Section */}
    </Flex>
  );
}
