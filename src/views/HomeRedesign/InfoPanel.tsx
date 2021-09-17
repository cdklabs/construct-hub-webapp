import { Flex, Divider, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Card } from "../../components/Card";
import { Picture } from "../../components/Picture";
import { InfoSection } from "./InfoSection";

export const InfoPanel: FunctionComponent = () => {
  return (
    <Card borderRadius="none" boxShadow="none" h="full" p={8}>
      <Stack spacing={8}>
        <InfoSection
          description={
            <>
              The construct hub is a{" "}
              <strong>
                central destination to discover and share cloud application
                design patterns and reference architectures
              </strong>{" "}
              defined for the AWS CDK, CDK for Kubernetes (CDK8s), CDK for
              Terraform (CDKtf) and any other construct-based tool.
            </>
          }
          title="What is Construct Hub?"
        >
          <Flex
            align="center"
            justifyItems="start"
            sx={{
              "& > *": {
                mt: 4,
                mr: 4,
              },
            }}
            wrap="wrap"
          >
            <Picture alt="AWS CDK logo" src="/assets/aws-cdk.png" />
            <Picture alt="Terraform logo" src="/assets/terraform.png" />
            <Picture alt="Kubernetes logo" src="/assets/kubernetes.png" />
          </Flex>
        </InfoSection>
        <Divider />
        <InfoSection
          description={
            <>
              Constructs are <strong>cloud building blocks</strong> introduced
              by the Constructs Programming Model (CPM) that can be{" "}
              <strong>
                used to assemble complete applications of any complexity.
              </strong>{" "}
              AWS, enterprises, start-ups, and individual developers use CDK
              constructs to share proven architecture patterns as reusable code
              libraries, so that everyone can benefit from the collective wisdom
              of the community.
            </>
          }
          title="What is a construct?"
        />
        <Divider />
        <InfoSection
          description={
            <>
              Construct Hub is built to <strong>serve the community</strong>{" "}
              that uses the constructs programming model (CPM) and to allow them{" "}
              <strong>
                find publicly available constructs they can reuse.
              </strong>{" "}
              Before the Construct Hub, developers did not have an easy way to
              discover construct libraries created by the community since they
              were published across various package managers and without a
              central index.
            </>
          }
          title="Why should I use this?"
        />
      </Stack>
    </Card>
  );
};
