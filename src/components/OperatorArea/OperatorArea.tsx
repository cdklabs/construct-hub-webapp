import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent, ReactNode, useMemo } from "react";
import type { Metadata } from "../../api/package/metadata";
import { DependencyDropdown } from "../../components/DependencyDropdown";
import { Card } from "../Card";
import { ExternalLink } from "../ExternalLink";
import { LicenseLink, LICENSE_LINKS } from "../LicenseLink";
import { Time } from "../Time";

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
    const repository = assembly?.repository.url;
    const license = assembly?.license;
    const registry = links?.npm;

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
      const repoLink = (
        <ExternalLink href={repository}>
          {new URL(repository).hostname}
        </ExternalLink>
      );
      items.push(<>Source code: {repoLink}</>);
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
    <Card as={Flex} direction="column">
      {details.length && <UnorderedList ml={0}>{details}</UnorderedList>}
      {assembly?.dependencies && (
        <Box mt={4}>
          <DependencyDropdown dependencies={assembly.dependencies} />
        </Box>
      )}
    </Card>
  );
};
