import { Box, Heading, Accordion } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FAQItem } from "./FAQItem";
import { FAQLink } from "./FAQLink";
import { FAQSection } from "./FAQSection";

export const FAQ: FunctionComponent = () => (
  <Page
    meta={{
      title: "FAQ",
      description: "Frequently Asked Questions",
    }}
    pageName="faq"
  >
    <Box bg="white" color="blue.800" h="100%" w="100%">
      <Box bg="gray.50" py={20} width="100%">
        <Heading as="h1" mx="auto" textAlign="center">
          Frequently Asked Questions
        </Heading>
      </Box>
      <Accordion allowMultiple defaultIndex={[0, 1]}>
        <FAQSection heading="General">
          <FAQItem question="How can I add my construct to the Construct Hub?">
            <p>
              In order to add your construct to the Construct Hub, you will need
              to publish it to the{" "}
              <FAQLink href="https://www.npmjs.com/">npmjs.com</FAQLink>{" "}
              registry, use a permissive license (Apache, BSD, MIT), and
              annotate it with one of the supported keywords (aws-cdk, cdk8s or
              cdktf).
            </p>
            <p>
              Additionally, since one of the main goals of the Construct Hub is
              to enable an ecosystem of constructs that can be consumed by all
              CDK languages, your library <strong>must</strong> be compiled with{" "}
              <FAQLink href="https://aws.github.io/jsii/">JSII</FAQLink>, which
              is a TypeScript-based programming language for creating
              multi-language libraries. The Construct Hub uses the type
              information produced by the JSII compiler in order to render the
              rich multi-language API reference displayed at the Construct Hub.
            </p>
            <p>
              The Construct Hub monitors all updates to the npm Registry and
              will list any packages that meet the above requirements within
              5-10 minutes. If your package does not appear in the Construct
              Hub, please file an issue on our GitHub repository.
            </p>
            <p>
              There’s some great community content about publishing construct
              libraries. Check out{" "}
              <FAQLink href="https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4">
                &quot;A Beginner&apos;s Guide to Create AWS CDK Construct
                Library with projen&quot;
              </FAQLink>{" "}
              by <FAQLink href="https://hayao-k.dev/">hayao-k</FAQLink>.
            </p>
            <p>
              If you already have a library written in TypeScript and you are
              looking for information on how to migrate to JSII, see the{" "}
              <FAQLink href="https://aws.github.io/jsii/user-guides/#library-author-guide">
                JSII library author guide
              </FAQLink>
              .
            </p>
          </FAQItem>

          <FAQItem question="What is Construct Hub?">
            <p>
              It is a central destination to discover and share cloud
              application design patterns and reference architectures defined
              for the AWS CDK, CDK for Kubernetes (CDK8s), CDK for Terraform
              (CDKtf) and any other construct-based tool.
            </p>
          </FAQItem>

          <FAQItem question="Why should I use Construct Hub?">
            <p>
              Construct Hub is built to serve the community that uses the
              constructs programming model (CPM) and to allow them find publicly
              available constructs they can reuse. Before the Construct Hub,
              developers did not have an easy way to discover construct
              libraries created by the community since they were published
              across various package managers and without a central index.
            </p>
            <p>
              The Construct Hub is a central, trusted venue CDK developers can
              use to discover published constructs to help them build their
              applications. In the Dev Preview Construct Hub you can discover
              constructs in TypeScript and Python and read their documentation
              and improved API reference in the programming language that the
              package supports.
            </p>
          </FAQItem>

          <FAQItem question="What is a construct?">
            <p>
              The Constructs Programming Model (CPM) introduces the notion of{" "}
              <strong>constructs</strong>, which represent cloud building blocks
              that can be used to assemble complete applications of any
              complexity. AWS, enterprises, start-ups, and individual developers
              use CDK constructs to share proven architecture patterns as
              reusable code libraries, so that everyone can benefit from the
              collective wisdom of the community.
            </p>
          </FAQItem>

          <FAQItem question="Who owns the constructs in the Construct Hub?">
            <p>
              The constructs are owned by the publishers of the packages.
              Constructs are user generated content that are governed by their
              own license terms which is displayed in the search results and can
              be accessed directly through the hyperlinked package page.
            </p>
          </FAQItem>

          <FAQItem question="Is the content served in Construct Hub meant to be consumed programmatically?">
            <p>
              No. The content displayed in the site is user generated, with some
              display formatting. We do not advise that you consume constructs
              from the search results programmatically. Please note that
              Construct Hub is a search engine intended to surface third party
              content from a public endpoint and we provide these results for
              your convenience AS-IS in accordance with our{" "}
              <FAQLink href="https://constructs.dev/terms">Site Terms</FAQLink>.
            </p>
          </FAQItem>

          <FAQItem question="Which CDK types are available on the Construct Hub?">
            <p>
              AWS CDK, CDK for Kubernetes (CDK8s) and CDK for Terraform (CDKtf).
            </p>
          </FAQItem>

          <FAQItem question="What is AWS CDK?">
            <p>
              AWS CDK is an open-source software development framework for
              defining applications on AWS and reusable abstractions using
              familiar programming languages and rich object-oriented APIs. AWS
              CDK apps synthesize intostandard CloudFormation templates which
              can be deployed to create infrastructure on AWS. For more
              information, click{" "}
              <FAQLink href="https://docs.aws.amazon.com/cdk/latest/guide/home.html">
                here
              </FAQLink>
              .
            </p>
          </FAQItem>

          <FAQItem question="What is CDK8s?">
            <p>
              CDK8s is an open-source software development framework for
              defining Kubernetes applications and reusable abstractions using
              familiar programming languages and rich object-oriented APIs.{" "}
              <strong>cdk8s</strong> apps synthesize into standard Kubernetes
              manifests which can be applied to any Kubernetes cluster. For more
              information, click{" "}
              <FAQLink href="https://cdk8s.io/">here</FAQLink>.
            </p>
          </FAQItem>

          <FAQItem question="What is CDKtf?">
            <p>
              The community preview of the{" "}
              <FAQLink href="https://aws.amazon.com/cdk/">
                Cloud Development Kit
              </FAQLink>
              for Terraform allows you to define infrastructure using a familiar
              programming language such as TypeScript, Python, or Go, while
              leveraging the hundreds of providers and thousands of module
              definitions provided by Terraform and the Terraform ecosystem. For
              more information, click{" "}
              <FAQLink href="https://learn.hashicorp.com/tutorials/terraform/cdktf">
                here
              </FAQLink>
              .
            </p>
          </FAQItem>

          <FAQItem question="What programming languages are supported in Dev Preview?">
            <p>The Construct Hub Dev Preview supports Python and TypeScript.</p>
          </FAQItem>

          <FAQItem question="Is the support for .NET, Java and Go in the roadmap?">
            <p>Yes.</p>
          </FAQItem>

          <FAQItem question="Can I view the source code of a construct?">
            <p>
              For each package you can click the repository link that the
              publisher provided with the package. Theoretically this link
              should redirect your to the package’s repository. However, we
              noticed that sometimes the code in the repository can be more or
              less updated than the package’s code. Please take that into
              account.
            </p>
          </FAQItem>

          <FAQItem question="How can I install a package?">
            <p>
              Press “Install” in the package page and you’ll see the
              installation instructions.
            </p>
          </FAQItem>

          <FAQItem question="How can I report a package?">
            <p>
              You can report a package by clicking &quot;Report a package&quot;
              from the package page. For claims of copyright infringement, read
              here:{" "}
              <FAQLink href="https://aws.amazon.com/terms/#notice-and-procedure-for-making-claims-of-copyright-infringement">
                https://aws.amazon.com/terms/#notice-and-procedure-for-making-claims-of-copyright-infringement
              </FAQLink>
              .
            </p>
          </FAQItem>

          <FAQItem question="How can I open a bug or send a PR for a package?">
            <p>
              The package is owned by the publisher. To report a bug or send a
              PR, you should go to the repository link the publisher provided
              and open a ticket there
            </p>
          </FAQItem>

          <FAQItem question="Why isn’t my package displayed in the Construct Hub?">
            <p>
              The Construct Hub displays only publicly available constructs that
              are JSII compatible and that were published on a public npm
              registry with an open source license. The package should be
              published on npm registry with the one of the following Keywords:
              aws-cdk, cdk8s or cdktf.
            </p>
          </FAQItem>

          <FAQItem question="Can I update my package after it has been displayed?">
            <p>
              Yes. You should publish a new valid version to the public npm
              registry. We will detect the new version and display it on the
              Construct Hub.
            </p>
          </FAQItem>

          <FAQItem question="How does the Construct Hub relates to the Construct Catalog?">
            <p>
              The Construct Catalog was built by the CDK community in
              collaboration with the AWS CDK team. The Construct Hub is the
              official version for the Construct Catalog.{" "}
              <FAQLink href="https://awscdk.io">https://awscdk.io</FAQLink> now
              redirects to the Construct Hub.
            </p>
          </FAQItem>

          <FAQItem question="How can I participate in the Construct Hub community?">
            <p>
              The Construct Hub is built as a public construct. Please join the{" "}
              <FAQLink href="https://github.com/cdklabs/construct-hub-webapp">
                Construct Hub GitHub community
              </FAQLink>
              . You are also welcome to join the #construct-hub-dev channel in
              the <FAQLink href="https://cdk.dev/">CDK community</FAQLink> Slack
              workspace.
            </p>
          </FAQItem>

          <FAQItem question="Is there a community slack channel for the CDK community?">
            <p>
              Please join the CDK Slack channel (
              <FAQLink href="https://cdk.dev/">https://cdk.dev/</FAQLink>). This
              Slack channel is managed by the CDK community for the CDK
              community.
            </p>
          </FAQItem>
        </FAQSection>

        <FAQSection heading="Getting Started">
          <FAQItem question="Do I need a user for the Construct Hub?">
            <p>No. The Construct Hub doesn’t require any signup.</p>
          </FAQItem>

          <FAQItem question="How do I get started?">
            <p>
              Use our home page to discover publicly available packages. You may
              run a search to find packages you’re interested in and mention
              your preferred programming language. For each package you will
              find helpful information such as README and API reference for the
              supported programming languages. You will also find links and
              keywords that the publisher provided with the package and
              installation instructions.
            </p>
          </FAQItem>
        </FAQSection>
      </Accordion>
    </Box>
  </Page>
);
