import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { ReactNode, useMemo } from "react";
import type { PackageLinksConfig } from "../../../../api/config";
import type { Metadata } from "../../../../api/package/metadata";
import { ExternalLink } from "../../../../components/ExternalLink";
import { LicenseLink, LICENSE_LINKS } from "../../../../components/LicenseLink";
import { Time } from "../../../../components/Time";
import { getRepoUrlAndHost } from "../../../../util/url";

export interface DetailsProps {
  assembly?: Assembly;
  linksConfig?: PackageLinksConfig[];
  metadata: Metadata;
}

export const Details = ({ assembly, linksConfig, metadata }: DetailsProps) => {
  const detailItems = useMemo(() => {
    if (!metadata) return [];

    const { date, links } = metadata;
    const username = assembly?.author.name;
    const authorUrl = assembly?.author.url;
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
      const author = authorUrl ? (
        <ExternalLink href={authorUrl}>{username}</ExternalLink>
      ) : (
        <Box as="strong" fontWeight="bold">
          {username}
        </Box>
      );
      items.push(<>Author: {author}</>);
    }

    // Prioritize custom links when available
    if (linksConfig?.length) {
      linksConfig.forEach(({ name, value, displayText }) => {
        const target = (metadata?.packageLinks ?? {})[value];
        if (target) {
          const link = (
            <ExternalLink href={target}>{displayText ?? target}</ExternalLink>
          );
          items.push(
            <>
              {name}: {link}
            </>
          );
        }
      });
    }

    if (repository) {
      const repo = getRepoUrlAndHost(repository.url);

      if (repo) {
        const repoLink = (
          <ExternalLink href={repo.url}>{repo.hostname}</ExternalLink>
        );
        items.push(<>Repository: {repoLink}</>);
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

    return items.slice(0, 5).map((detail: string | ReactNode, i: number) => (
      <ListItem key={`detail-${i}`} listStyleType="none" my={1}>
        <Text color="gray.600">{detail}</Text>
      </ListItem>
    ));
  }, [metadata, assembly, linksConfig]);
  return <UnorderedList ml={0}>{detailItems}</UnorderedList>;
};
