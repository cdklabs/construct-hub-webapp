import { Box, Heading, Accordion } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FAQItem } from "./FAQItem";
import { FAQSection } from "./FAQSection";

export const FAQ: FunctionComponent = () => (
  <Page pageName="faq">
    <Box bg="white" color="blue.800" h="100%" w="100%">
      <Box bg="gray.50" py={20} width="100%">
        <Heading as="h1" mx="auto" textAlign="center">
          Frequently Asked Questions
        </Heading>
      </Box>
      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <FAQSection heading="General">
          <FAQItem question="Q: What is Construct Hub?">
            <span>
              It is a central destination to discover and share cloud
              application design patterns and reference architectures defined
              for the AWS CDK, CDK for Kubernetes (CDK8s), CDK for Terraform
              (CDKtf) and any other construct-based tool.
            </span>
          </FAQItem>
          <FAQItem question="Q: Why should I use Construct Hub?">
            <span>
              Construct Hub is built to serve the community that uses the
              constructs programming model (CPM) and to allow them find publicly
              available constructs they can reuse. Before the Construct Hub,
              developers did not have an easy way to discover construct
              libraries created by the community since they were published
              across various package managers and without a central index.
            </span>
            <span>
              The Construct Hub is a central, trusted venue CDK developers can
              use to discover published constructs to help them build their
              applications. In the Preview Construct Hub you can discover
              constructs in TypeScript and Python and read their documentation
              and improved API reference in the programming language that the
              package supports.
            </span>
          </FAQItem>
          <FAQItem question="Q: How can I add my construct to the Construct Hub?">
            <span>
              In order to add your construct to the Construct Hub, you will need
              to publish it to the npmjs.com (https://www.npmjs.com/) registry,
              use a permissive license (Apache, BSD, MIT), and annotate it with
              one of the supported keywords (awscdk, cdk8s or cdktf).
            </span>
            <span>
              Additionally, since one of the main goals of the Construct Hub is
              to enable an ecosystem of constructs that can be consumed by all
              CDK languages, your library *must* be compiled with JSII (
              https://aws.github.io/jsii/), which is a TypeScript-based
              programming language for creating multi-language libraries. The
              Construct Hub leverages the type information produced by the JSII
              compiler in order to render the rich multi-language API reference
              displayed at the Construct Hub.
            </span>
            <span>
              The Construct Hub monitors all updates to the npm Registry and
              will list any packages that meet the above requirements within
              5-10 minutes. If your package does not appear in the Construct
              Hub, please file an issue on our GitHub repository.
            </span>
            <span>
              There’s some great community content about publishing construct
              libraries. Check out “A Beginner&apos;s Guide to Create AWS CDK
              Construct Library with projen
              (https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4)”
              by hayao-k (https://hayao-k.dev/).
            </span>
            <span>
              If you already have a library written in TypeScript and you are
              looking for information on how to migrate to JSII, see the JSII
              library author guide
              (https://aws.github.io/jsii/user-guides/#library-author-guide).
            </span>
          </FAQItem>
          <FAQItem question="Q: What is a construct?">
            <span>
              The Constructs Programming Model (CPM) introduces the notion of
              *constructs,* which represent cloud building blocks that can be
              used to assemble complete applications of any complexity. AWS,
              enterprises, start-ups, and individual developers use CDK
              constructs to share proven architecture patterns as reusable code
              libraries, so that everyone can benefit from the collective wisdom
              of the community.
            </span>
          </FAQItem>
          <FAQItem question="Q: Who owns the constructs in the Construct Hub?">
            <span>
              The constructs are owned by the publishers of the packages.
              Constructs are user generated content that are governed by their
              own license terms which is displayed in the search results and can
              be accessed directly through the hyperlinked package page.
            </span>
          </FAQItem>
          <FAQItem question="Q: Is the content served in Construct Hub meant to be consumed programmatically?">
            <span>
              No. The content displayed in the site is user generated, with some
              display formatting. We do not advise that you consume constructs
              from the search results programmatically. Please note that
              Construct Hub is a search engine intended to surface third party
              content from a public endpoint and we provide these results for
              your convenience AS-IS in accordance with our Site Terms
              (https://constructs.dev/terms).
            </span>
          </FAQItem>
          <FAQItem question="Q: Which CDK types are available on the Construct Hub?">
            <span>
              AWS CDK, CDK for Kubernetes (CDK8s) and CDK for Terraform (CDKtf).
            </span>
          </FAQItem>
          <FAQItem question="Q: What is AWS CDK?">
            <span>
              AWS CDK is an open-source software development framework for
              defining applications on AWS and reusable abstractions using
              familiar programming languages and rich object-oriented APIs. AWS
              CDK apps synthesize intostandard CloudFormation templates which
              can be deployed to create infrastructure on AWS. For more
              information, click here
              https://docs.aws.amazon.com/cdk/latest/guide/home.html).
            </span>
          </FAQItem>
          <FAQItem question="Q: What is CDK8s?">
            <span>
              CDK8s is an open-source software development framework for
              defining Kubernetes applications and reusable abstractions using
              familiar programming languages and rich object-oriented APIs.
              *cdk8s* apps synthesize into standard Kubernetes manifests which
              can be applied to any Kubernetes cluster. For more information,
              click here (https://cdk8s.io/).
            </span>
          </FAQItem>
          <FAQItem question="Q: What is CDKtf?">
            <span>
              The community preview of the Cloud Development Kit
              (https://aws.amazon.com/cdk/) for Terraform allows you to define
              infrastructure using a familiar programming language such as
              TypeScript, Python, or Go, while leveraging the hundreds of
              providers and thousands of module definitions provided by
              Terraform and the Terraform ecosystem. For more information, click
              here (https://learn.hashicorp.com/tutorials/terraform/cdktf).
            </span>
          </FAQItem>
          <FAQItem question="Q: What programming languages are supported in Preview?">
            <span>
              The Construct Hub Preview supports Python and TypeScript.
            </span>
          </FAQItem>
          <FAQItem question="Q: Is the support for .NET, Java and Go in the roadmap?">
            <span>Yes.</span>
          </FAQItem>
          <FAQItem question="Q: Can I view the source code of a construct?">
            <span>
              For each package you can click the repository link that the
              publisher provided with the package. Theoretically this link
              should redirect your to the package’s repository.However, we
              noticed that sometimes the code in the repository can be more or
              less updated than the package’s code. Please take that into
              account.
            </span>
          </FAQItem>
          <FAQItem question="Q: How can I install a package?">
            <span>
              Press “Use Construct” in the package page and you’ll see the
              installation instructions.
            </span>
          </FAQItem>
          <FAQItem question="Q: How can I report a package?">
            <span>
              You can report a package by clicking `&quot;`Report a
              package`&quot;` from the package page. For claims of copyright
              infringement, read here
              (https://aws.amazon.com/terms/#notice-and-procedure-for-making-claims-of-copyright-infringement).
            </span>
          </FAQItem>
          <FAQItem question="Q: How can I open a bug or send a PR for a package?">
            <span>
              The package is owned by the publisher. To report a bug or send a
              PR, you should go to the repository link the publisher provided
              and open a ticket there
            </span>
          </FAQItem>
          <FAQItem question="Q: Why isn’t my package displayed in the Construct Hub?">
            <span>
              The Construct Hub displays only publicly available constructs that
              are JSII compatible and that were published on a public npm
              registry with an open source license. The package should be
              published on npm registry with the one of the following Keywords:
              aws-cdk, cdk8s or cdktf.
            </span>
          </FAQItem>
          <FAQItem question="Q: Can I update my package after it has been displayed?">
            <span>
              Yes. You should publish a new valid version to the public npm
              registry. We will detect the new version and display it on the
              Construct Hub.
            </span>
          </FAQItem>
          <FAQItem question="Q: How does the Construct Hub relates to the Construct Catalog?">
            <span>
              The Construct Catalog was built by the CDK community in
              collaboration with the AWS CDK team. The Construct Hub is the
              official version for the Construct Catalog. https://awscdk.io
              https://awscdk.io/) now redirects to the Construct Hub.
            </span>
          </FAQItem>
          <FAQItem question="Q: How can I participate in the Construct Hub community?">
            <span>
              The Construct Hub is built as a public construct. Please join the
              Construct Hub GitHub community
              (https://github.com/cdklabs/construct-hub-webapp). You are also
              welcome to join the #construct-hub-dev channel in CDK community
              (https://cdk.dev/) Slack workspace
            </span>
          </FAQItem>
          <FAQItem question="Q: Is there a community slack channel for the CDK community?">
            <span>
              Please join the CDK Slack channel (https://cdk.dev/). This Slack
              channel is managed by the CDK community for the CDK community.
            </span>
          </FAQItem>
        </FAQSection>
        <FAQSection heading="Getting Started">
          <FAQItem question="Q: Do I need a user for the Construct Hub?">
            <span>No. The Construct Hub doesn’t require any signup.</span>
          </FAQItem>
          <FAQItem question="Q: How do I get started?">
            <span>
              Use our home page to discover publicly available packages. You may
              run a search to find packages you’re interested in and mention
              your preferred programming language. For each package you will
              find helpful information such as README and API reference for the
              supported programming languages. You will also find links and
              keywords that the publisher provided with the package and
              installation instructions.
            </span>
          </FAQItem>
        </FAQSection>
      </Accordion>
    </Box>
  </Page>
);
