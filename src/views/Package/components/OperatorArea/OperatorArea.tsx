import { Box, Flex, Link } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent } from "react";
import { PackageLinkConfig } from "../../../../api/config";
import type { Metadata } from "../../../../api/package/metadata";
import { DependencyDropdown } from "../DependencyDropdown";
import { Details } from "./Details";

export interface OperatorAreaProps {
  assembly?: Assembly;
  linksConfig?: PackageLinkConfig[];
  metadata: Metadata;
}

export const OperatorArea: FunctionComponent<OperatorAreaProps> = ({
  assembly,
  linksConfig,
  metadata,
}) => {
  return (
    <Flex direction="column" textAlign={{ base: "center", md: "initial" }}>
      <Link
        color="blue.500"
        fontSize="sm"
        href={`mailto:abuse@amazonaws.com?subject=${encodeURIComponent(
          `ConstructHub - Report of abusive package: ${assembly?.name}`
        )}`}
        m={2}
        textAlign={{ base: "center", md: "right" }}
      >
        Report this Package
      </Link>
      <Details
        assembly={assembly}
        linksConfig={linksConfig}
        metadata={metadata}
      />
      {assembly?.dependencies && (
        <Box mt={4}>
          <DependencyDropdown dependencies={assembly.dependencies} />
        </Box>
      )}
    </Flex>
  );
};
