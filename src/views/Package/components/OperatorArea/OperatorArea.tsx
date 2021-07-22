import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent, ReactNode, useMemo } from "react";
import type { Metadata } from "../../../../api/package/metadata";
import { ExternalLink } from "../../../../components/ExternalLink";
import { LicenseLink, LICENSE_LINKS } from "../../../../components/LicenseLink";
import { Time } from "../../../../components/Time";
import { getRepoUrlAndHost } from "../../../../util/url";
import { DependencyDropdown } from "../DependencyDropdown";

export interface OperatorAreaProps {
  assembly?: Assembly;
  metadata: Metadata;
}

export const OperatorArea: FunctionComponent<OperatorAreaProps> = ({
  assembly,
  metadata,
}) => {
  const details: ReactNode[] = useMemo(() => {
    if (!metadata) return [];

    const { date, links } = metadata;
    const username = assembly?.author.name;
    const repository = assembly?.repository;
    const license = assembly?.license;
    // https://www.npmjs.com/package/aws-cdk/v/1.113.0
    const registry =
      links?.npm ??
      `https://www.npmjs.com/package/${assembly?.name}/v/${assembly?.version}`;

    const items = [];

    if (date) {
      const publishDate = (
        <Time date={new Date(date)} fontWeight="bold" format="MMMM dd, yyyy" />
      );
      items.push(<>Published: {publishDate}</>);
    }

    if (username) {
      const managedBy = (
        <Box as="strong" fontWeight="bold">
          {username}
        </Box>
      );
      items.push(<>Module managed by: {managedBy}</>);
    }

    if (repository) {
      const repo = getRepoUrlAndHost(repository.url);

      if (repo) {
        const repoLink = (
          <ExternalLink href={repo.url}>{repo.hostname}</ExternalLink>
        );
        items.push(<>Source code: {repoLink}</>);
      }
    }

    if (license && license in LICENSE_LINKS) {
      const licenseLink = (
        <LicenseLink license={license as keyof typeof LICENSE_LINKS} />
      );
      items.push(<>License: {licenseLink}</>);
    }

    if (registry) {
      const registryLink = (
        <ExternalLink href={registry}>
          {new URL(registry).hostname}
        </ExternalLink>
      );
      items.push(<>Registry: {registryLink}</>);
    }

    return items.map((detail: string | ReactNode, i: number) => (
      <ListItem key={`detail-${i}`} listStyleType="none" my={1}>
        <Text color="gray.600">{detail}</Text>
      </ListItem>
    ));
  }, [metadata, assembly]);

  return (
    <Flex direction="column" textAlign={{ base: "center", md: "initial" }}>
      <Link
        color="blue.500"
        fontSize="sm"
        href={`mailto:abuse@amazon.com?subject=${encodeURIComponent(
          `ConstructHub - Report of abusive package: ${assembly?.name}`
        )}`}
        m={2}
        textAlign="right"
      >
        Report this Package
      </Link>
      <UnorderedList ml={0}>{details}</UnorderedList>
      {assembly?.dependencies && (
        <Box mt={4}>
          <DependencyDropdown dependencies={assembly.dependencies} />
        </Box>
      )}
    </Flex>
  );
};
