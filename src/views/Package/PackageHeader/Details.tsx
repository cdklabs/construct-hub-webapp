import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Collapse,
  Stack,
  StackProps,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import { Fragment, FunctionComponent, ReactNode } from "react";
import { PackageLinkConfig } from "../../../api/config";
import { Metadata } from "../../../api/package/metadata";
import { PackageStats } from "../../../api/stats";
import { ExternalLink } from "../../../components/ExternalLink";
import { LicenseLink, LICENSE_LINKS } from "../../../components/LicenseLink";
import { NavLink } from "../../../components/NavLink";
import { Time } from "../../../components/Time";
import { FORMATS } from "../../../constants/dates";
import { useStats } from "../../../contexts/Stats";
import { useConfigValue } from "../../../hooks/useConfigValue";
import { getRepoUrlAndHost, getSearchPath } from "../../../util/url";
import { usePackageState } from "../PackageState";
import { ToggleButton } from "./ToggleButton";

interface DetailsProps extends StackProps {}

const WithLabel: FunctionComponent<{ label: ReactNode; tooltip?: string }> = ({
  children,
  label,
  tooltip,
}) => (
  <Tooltip hasArrow isDisabled={!tooltip} label={tooltip} placement="left">
    <Text fontWeight="bold">
      {label}{" "}
      <Box as="span" fontWeight="normal">
        {children}
      </Box>
    </Text>
  </Tooltip>
);

const Downloads: FunctionComponent<{ downloads: number }> = ({ downloads }) => (
  <WithLabel
    label={
      <>
        <Box as="span" mr={1}>
          <DownloadIcon />
        </Box>
        {downloads.toLocaleString()}
      </>
    }
    tooltip="Download numbers are periodically sourced from the NPM registry"
  >
    Weekly downloads
  </WithLabel>
);

const getDetailItemsFromPackage = ({
  assembly,
  metadata,
  name,
  packageLinks,
  stats,
}: {
  assembly?: Assembly;
  metadata?: Metadata;
  stats?: PackageStats;
  packageLinks?: PackageLinkConfig[];
  name: string;
}): ReactNode[] => {
  const items: ReactNode[] = [];

  if (assembly || metadata || stats || packageLinks) {
    const downloads: number | undefined =
      stats?.packages?.[name]?.downloads?.npm;

    if (downloads !== undefined) {
      items.push(<Downloads downloads={downloads} />);
    }

    const username = assembly?.author.name;
    const repository = assembly?.repository;
    const license = assembly?.license;

    if (username) {
      const author = (
        <NavLink color="blue.500" to={getSearchPath({ query: username })}>
          {username}
        </NavLink>
      );
      items.push(<WithLabel label="Author">{author}</WithLabel>);
    }

    const date = metadata?.date;

    if (date) {
      const publishDate = (
        <Time
          date={new Date(date)}
          fontWeight="normal"
          format={FORMATS.PUBLISH_DATE}
        />
      );
      items.push(<WithLabel label="Published">{publishDate}</WithLabel>);
    }

    // Prioritize custom links when available
    if (packageLinks?.length) {
      packageLinks.forEach(({ linkLabel, configKey, linkText }) => {
        const target = (metadata?.packageLinks ?? {})[configKey];
        if (target) {
          const link = (
            <ExternalLink href={target}>{linkText ?? target}</ExternalLink>
          );
          items.push(
            <WithLabel label={linkLabel}>
              {linkLabel}: {link}
            </WithLabel>
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
        items.push(<WithLabel label="Repository">{repoLink}</WithLabel>);
      }
    }

    if (license && license in LICENSE_LINKS) {
      const licenseLink = (
        <LicenseLink license={license as keyof typeof LICENSE_LINKS} />
      );
      items.push(<WithLabel label="License">{licenseLink}</WithLabel>);
    }

    const registry =
      metadata?.links?.npm ??
      `https://www.npmjs.com/package/${assembly?.name}/v/${assembly?.version}`;

    if (registry) {
      const registryLink = (
        <ExternalLink href={registry}>
          {new URL(registry).hostname}
        </ExternalLink>
      );

      items.push(<WithLabel label="Registry">{registryLink}</WithLabel>);
    }
  }

  return items.map((item, i) => <Fragment key={i}>{item}</Fragment>);
};

export const Details: FunctionComponent<DetailsProps> = (props) => {
  const state = usePackageState();
  const stats = useStats().data;
  const collapse = useDisclosure();
  const packageLinks = useConfigValue("packageLinks");

  const assembly = state.assembly.data;
  const metadata = state.metadata.data;
  const name = state.scope ? `${state.scope}/${state.name}` : state.name;

  const items = getDetailItemsFromPackage({
    assembly,
    metadata,
    name,
    packageLinks,
    stats,
  });

  if (!items.length) return null;

  const alwaysShow = items.slice(0, 6);
  const showWithCollapse = items.slice(6, items.length);

  return (
    <Stack
      align="start"
      color="gray.600"
      fontSize=".75rem"
      mt={2}
      spacing={2}
      {...props}
    >
      {/* TODO: Highlight element */}
      {alwaysShow}
      {showWithCollapse.length > 0 && (
        <>
          <Collapse animateOpacity in={collapse.isOpen}>
            <Stack spacing={2}>{showWithCollapse}</Stack>
          </Collapse>
          <ToggleButton
            closeText={`See less details (${alwaysShow.length})`}
            fontSize="inherit"
            isOpen={collapse.isOpen}
            onClick={collapse.onToggle}
            openText={`See more details (${showWithCollapse.length})`}
          />
        </>
      )}
    </Stack>
  );
};
