import { EmailIcon } from "@chakra-ui/icons";
import { Button, Link, Stack } from "@chakra-ui/react";
import type { FunctionComponent, ReactNode } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { GithubIcon } from "../../icons/GithubIcon";
import { usePackageState } from "./PackageState";
import testIds from "./testIds";

const iconProps = {
  h: 5,
  ml: 2,
  w: 5,
};

export const FeedbackLinks: FunctionComponent = () => {
  const state = usePackageState();
  const metadata = state.metadata.data;
  const assembly = state.assembly.data;

  if (!(assembly && metadata)) return null;

  const repo = assembly?.repository ?? {};

  let repoLink: ReactNode = null;

  if (repo.type === "git") {
    let repoUrl = repo.url?.endsWith(".git")
      ? repo.url.replace(".git", "")
      : repo.url;

    if (repoUrl.endsWith("/")) {
      repoUrl = repoUrl.slice(0, repoUrl.length - 1);
    }

    repoLink = (
      <Button
        as={ExternalLink}
        color="black"
        data-testid={testIds.githubLink}
        hasIcon={false}
        href={`${repoUrl}/issues`}
        rightIcon={<GithubIcon {...iconProps} />}
        variant="solid"
      >
        Provide Feedback
      </Button>
    );
  }

  return (
    <Stack
      align="center"
      borderTop="1px solid"
      borderTopColor="blue.50"
      color="blue.500"
      data-testid={testIds.feedbackLinks}
      direction={{ base: "column", md: "row" }}
      justify="space-evenly"
      mx={8}
      spacing={4}
      py={10}
    >
      <Button
        as={Link}
        colorScheme="blue"
        data-testid={testIds.reportLink}
        href={`mailto:abuse@amazonaws.com?subject=${encodeURIComponent(
          `ConstructHub - Report of abusive package: ${assembly?.name}`
        )}`}
        rightIcon={<EmailIcon {...iconProps} />}
      >
        Report this package
      </Button>

      {repoLink}
    </Stack>
  );
};
