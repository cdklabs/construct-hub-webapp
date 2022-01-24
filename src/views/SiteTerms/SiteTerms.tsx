import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { ExternalLink } from "../../components/ExternalLink";
import { Page } from "../../components/Page";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";

export const SiteTerms: FunctionComponent = () => (
  <Page
    meta={{
      title: "Site Terms",
      description: "View the Construct Hub Site Terms",
    }}
    pageName="siteTerms"
  >
    <Box bg="bgSecondary" h="100%" py={16} w="100%">
      <Box
        as="article"
        color="textPrimary"
        fontSize="lg"
        maxW={{ base: "80%", md: "38rem" }}
        mx="auto"
        textAlign="justify"
        w="100%"
      >
        <Heading as="h1" color="textPrimary" mb={8} mx="auto" size="lg">
          AWS Site Terms for CDK Construct Hub
        </Heading>
        <Stack spacing={4}>
          <Text fontStyle="italic">Last Updated: July 2021</Text>
          <Text>
            Welcome to the AWS CDK Construct Hub site (the “AWS Site” or
            “Construct Hub”). Except as specifically follows, the AWS CDK
            Construct Hub site shall be subject to the{" "}
            <ExternalLink
              hasWarning={false}
              href="https://aws.amazon.com/terms/"
            >
              Site Terms
            </ExternalLink>{" "}
            (“AWS Site Terms”) and considered an AWS Site for purposes of
            applying the AWS Site Terms (together, the “CDK Construct Hub Site
            Terms”).
          </Text>
          <Text>
            In place of the “License and Site Access” term of the AWS Site
            Terms, the Construct Hub is provided to you under this license:{" "}
            <ExternalLink
              hasWarning={false}
              href={`${CONSTRUCT_HUB_REPO_URL}/blob/main/LICENSE`}
            >
              {`${CONSTRUCT_HUB_REPO_URL}/blob/main/LICENSE`}
            </ExternalLink>
            . Some AWS Content and Third-Party Content may be provided to you
            under a separate license, such as the Apache License, Version 2.0,
            or other open source license. In the event of a conflict between the
            CDK Construct Hub Site Terms and any separate license, the separate
            license will prevail with respect to the AWS Content or Third-Party
            Content that is the subject of such separate license. This AWS Site
            is a construct registry and search site. The links to the CDK
            constructs displayed may comprise third party user generated content
            which shall, in any case, be subject to the “Disclaimer of
            Warranties and Limitation of Liability” section of the AWS Site
            Terms. Accessing a construct via its hyperlink will send you to a
            non-affiliated third party website (‘Third-Party Website”) and you
            shall be subject to the terms and conditions of that Third-Party
            Website upon entering it.
          </Text>
        </Stack>
      </Box>
    </Box>
  </Page>
);
