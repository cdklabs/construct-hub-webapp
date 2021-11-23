import { EmailIcon } from "@chakra-ui/icons";
import { Divider, Stack, useBreakpointValue } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";
import { GithubIcon } from "../../icons/GithubIcon";
import { usePackageState } from "./PackageState";
import testIds from "./testIds";

const iconProps = {
  h: 6,
  ml: 2,
  w: 6,
};

export const FeedbackLinks: FunctionComponent = () => {
  const state = usePackageState();

  // divider orientation doesn't currently support responsive values
  const divider = useBreakpointValue({
    base: <Divider borderColor="white" mr={6} orientation="horizontal" />,
    md: <Divider borderColor="white" mr={6} orientation="vertical" />,
  });

  const metadata = state.metadata.data;
  const assembly = state.assembly.data;

  if (!(assembly && metadata)) return null;

  const repo = assembly?.repository ?? {};

  let repoUrl = undefined;

  if (repo.type === "git") {
    repoUrl = repo.url?.endsWith(".git")
      ? repo.url.replace(".git", "")
      : repo.url;

    if (repoUrl.endsWith("/")) {
      repoUrl = repoUrl.slice(0, repoUrl.length - 1);
    }
  }

  // const orientation = { base: "horizontal", md: "vertical" };

  return (
    <Stack
      align="center"
      backgroundColor="#1F50A1"
      borderTop="1px solid"
      borderTopColor="blue.50"
      color="white"
      data-testid={testIds.feedbackLinks}
      direction={{ base: "column", md: "row" }}
      justify="space-evenly"
      px={8}
      py={5}
      spacing={4}
    >
      {repoUrl && (
        <>
          <ExternalLink
            color="currentcolor"
            data-testid={testIds.githubLink}
            fontSize="lg"
            fontWeight="semibold"
            hasIcon={false}
            href={`${repoUrl}/issues`}
            rightIcon={<GithubIcon color="white" {...iconProps} />}
            variant="solid"
          >
            Provide feedback to publisher
          </ExternalLink>
          {divider}
        </>
      )}
      <ExternalLink
        color="currentcolor"
        data-testid={testIds.reportLink}
        fontSize="lg"
        fontWeight="semibold"
        hasIcon={false}
        href={`${CONSTRUCT_HUB_REPO_URL}/issues/new`}
        rightIcon={<GithubIcon color="white" {...iconProps} />}
      >
        Provide feedback to Construct Hub
      </ExternalLink>
      {divider}
      <ExternalLink
        color="currentcolor"
        data-testid={testIds.reportAbuseLink}
        fontSize="lg"
        fontWeight="semibold"
        hasIcon={false}
        href={`mailto:abuse@amazonaws.com?subject=${encodeURIComponent(
          `ConstructHub - Report of abusive package: ${assembly?.name}`
        )}`}
        rightIcon={<EmailIcon {...iconProps} />}
      >
        Report abuse
      </ExternalLink>
    </Stack>
  );
};
