import { Flex } from "@chakra-ui/react";
import type { Metadata } from "../../api/package/metadata";
import { PackageHeader } from "../PackageHeader";

export interface PublisherAreaProps {
  metadata: Metadata;
}

export function PublisherArea({ metadata }: PublisherAreaProps) {
  return (
    <Flex direction="column" w="100%">
      <PackageHeader
        title={metadata.name}
        description={metadata.description}
        tags={metadata.keywords}
      />
      {/* TODO: Version Dropdown Section */}
    </Flex>
  );
}
