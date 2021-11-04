import { Box, Heading, Accordion } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";
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
          <FAQItem question="What is Construct Hub?">
            <p>
              Construct Hub is a place to discover CDK constructs &mdash; a
              central destination for discovering and sharing cloud application
              design patterns and reference architectures defined for the AWS
              CDK, CDK for Kubernetes (CDK8s), CDK for Terraform (CDKtf) and
              other construct-based tools.
            </p>
          </FAQItem>
          <FAQItem question="Why should I use Construct Hub?">
            <p>
              Construct Hub is a central trusted venue where CDK developers can
              discover construct libraries to help them build their
              applications. You can find construct libraries in TypeScript,
              Python, Java and .NET (Go is coming soon!), browse their developer
              guides and API references, and explore code samples in all the
              programming language that the package supports.
            </p>
          </FAQItem>
          <FAQItem question="How can I add my construct to Construct Hub?">
            <p>
              Constructs intended for Construct Hub must be published to the{" "}
              <FAQLink href="https://www.npmjs.com/">NPM registry</FAQLink>{" "}
              under a permissive license (such as Apache, BSD, or MIT) and
              annotated with a keyword recognized by Construct Hub (
              <code>awscdk</code>, <code>cdk8s</code> or <code>cdktf</code>).
            </p>
            <p>
              Additionally, since one of the main goals of Construct Hub is to
              enable an ecosystem of constructs that can be consumed by all CDK
              languages, your library <strong>must</strong> be compiled with{" "}
              <FAQLink href="https://aws.github.io/jsii/">JSII</FAQLink>, a
              TypeScript-based tool for building multi-language libraries. The
              Construct Hub leverages the type information produced by the JSII
              compiler to render a rich multi-language API reference displayed
              for each construct.
            </p>
            <p>
              Construct Hub continuously monitors the NPM Registry. Packages
              that meet the above requirements appear in Construct Hub within
              5-10 minutes. If your package does not appear in Construct Hub,
              but meets these requirements, please file an issue against{" "}
              <FAQLink href={CONSTRUCT_HUB_REPO_URL}>
                our GitHub repository
              </FAQLink>
              .
            </p>
            <p>
              The community has provided some great resources about publishing
              construct libraries that meet Construct Hub requirements. For
              example, see{" "}
              <FAQLink href="https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4">
                &quot;A Beginner&apos;s Guide to Create AWS CDK Construct
                Library with projen&quot;
              </FAQLink>{" "}
              by <FAQLink href="https://hayao-k.dev/">hayao-k</FAQLink>.
            </p>
            <p>
              If you already have a library written in TypeScript and want to
              migrate it to JSII so it can be included in Construct Hub, see the{" "}
              <FAQLink href="https://aws.github.io/jsii/user-guides/#library-author-guide">
                JSII library author guide
              </FAQLink>
              .
            </p>
          </FAQItem>
          <FAQItem question="What is a construct?">
            <p>
              The Constructs Programming Model (CPM) introduces the notion of{" "}
              <strong>constructs</strong>, which represent building blocks that
              can be used to assemble complete cloud applications of any
              complexity. AWS, enterprises, startups, and individual developers
              use CDK constructs to share proven architecture patterns as
              reusable code libraries, so that everyone can benefit from the
              collective wisdom of the community.
            </p>
          </FAQItem>
          <FAQItem question="What are the prerequisites for using a construct library?">
            <p>
              To use a construct library in your code, you need to have your
              preferred programming language installed. In order to synthesize,
              diff, and deploy collections of resources you will need to install
              the CDK Toolkit command-line tool. For AWS CDK install the{" "}
              <FAQLink href="https://docs.aws.amazon.com/cdk/latest/guide/cli.html">
                AWS CDK Toolkit command-line tool
              </FAQLink>
              , for CDK8s install the{" "}
              <FAQLink href="https://cdk8s.io/docs/latest/getting-started/">
                CDK8s command-line tool
              </FAQLink>{" "}
              and for CDKtf install the{" "}
              <FAQLink href="https://learn.hashicorp.com/tutorials/terraform/cdktf-install">
                CDKtf command-line tool
              </FAQLink>
              .
            </p>
            <p>
              The CDK8s CLI doesn’t require having any registered account nor
              having a running Kubernetes cluster as it only updates Kubernetes
              manifests.
            </p>
            <p>
              The CDKtf CLI requires having Terraform, Node, Yarn and Docker
              installed.
            </p>
            <p>
              Some construct libraries’ documentation may include additional
              prerequisites which are unique to their implementation.
            </p>
          </FAQItem>
          <FAQItem question="Who owns the constructs in Construct Hub?">
            <p>
              Constructs are user-generated content owned by the publishers of
              the individual packages. Each is governed by its own license terms
              chosen by its publisher (although only packages with permissive
              licenses are included in Construct Hub). License information can
              be accessed directly through the hyperlinked package page.
            </p>
          </FAQItem>
          <FAQItem question="Is the content served in Construct Hub meant to be consumed programmatically?">
            <p>
              No. The content displayed in the site is user-generated, with some
              display formatting. We do not advise that you consume constructs
              from the search results programmatically. Construct Hub is a
              search engine or portal intended to surface third-party content
              from a public endpoint. We provide these results for your
              convenience AS-IS in accordance with our{" "}
              <FAQLink href="https://constructs.dev/terms">Site Terms</FAQLink>.
            </p>
          </FAQItem>
          <FAQItem question="Which CDK types are available on the Construct Hub?">
            <p>
              Construct Hub currently has constructs for the CDK for
              CloudFormation (AWS CDK), CDK for Kubernetes (CDK8s) and CDK for
              Terraform (CDKtf). We are open to adding other construct-based
              tools as they evolve.
            </p>
          </FAQItem>
          <FAQItem question="What is CDK for CloudFormation (AWS CDK)?">
            <p>
              CDK for CloudFormation (AWS CDK) is an open-source software
              development framework for defining applications on AWS and
              reusable abstractions using familiar programming languages and
              rich object-oriented APIs. AWS CDK apps synthesize into standard
              AWS CloudFormation templates, which can be deployed to create
              infrastructure on AWS. See{" "}
              <FAQLink href="https://aws.amazon.com/cdk/">
                AWS Cloud Development Kit
              </FAQLink>{" "}
              for more information.
            </p>
          </FAQItem>
          <FAQItem question="What is CDK for Kubernetes (CDK8s)?">
            <p>
              CDK for Kubernetes (CDK8s, pronounced “cd kates”) is an
              open-source software development framework for defining Kubernetes
              applications and reusable abstractions using familiar programming
              languages and rich object-oriented APIs. CDK8s apps synthesize
              into standard Kubernetes manifests that can be applied to any
              Kubernetes cluster. See{" "}
              <FAQLink href="https://cdk8s.io/">CDK for Kubernetes</FAQLink> for
              more information.
            </p>
          </FAQItem>
          <FAQItem question="What is CDK for Terraform (CDKtf)?">
            <p>
              The community preview of the Cloud Development Kit for Terraform
              (CDKtf) allows you to define infrastructure using a familiar
              programming language such as TypeScript, Python, or Go, while
              leveraging the hundreds of providers and thousands of module
              definitions provided by Terraform and the Terraform ecosystem. See{" "}
              <FAQLink href="https://learn.hashicorp.com/tutorials/terraform/cdktf">
                CDK for Terraform
              </FAQLink>{" "}
              for more information.
            </p>
          </FAQItem>
          <FAQItem question="What programming languages are supported in Dev Preview?">
            <p>
              The Construct Hub GA supports constructs available for Python,
              TypeScript, Java and .NET. Support for Go will be included soon.
            </p>
          </FAQItem>
          <FAQItem question="Will Go be supported?">
            <p>Yes! We can’t promise exactly when, but it should be soon.</p>
          </FAQItem>
          <FAQItem question="Can I view the source code of a construct?">
            <p>
              Source code is usually available via the repository link provided
              by the construct’s publisher; this link appears on Construct Hub.
              We have noticed that the code in the linked repository can
              sometimes be newer or older than the code in the published
              package, so exercise care.
            </p>
          </FAQItem>
          <FAQItem question="How can I install a package?">
            <p>
              The details vary by construct. Click “Install” in the package page
              to see the construct’s installation instructions.
            </p>
          </FAQItem>
          <FAQItem question="How can I report a package?">
            <p>
              Your trust is vital to the success of Construct Hub. If you
              believe a package contains suspicious code, violates its
              dependencies’ licenses, or is otherwise not behaving as a good
              citizen of the community, click &quot;Report this package&quot; at
              the bottom of the package page and send us an email with
              explanations and evidence to support your claims. If we can verify
              the issue, we will take appropriate action, up to and including
              removing the package from Construct Hub.
            </p>
          </FAQItem>
          <FAQItem question="How can I report a bug or contribute code to a construct?">
            <p>
              Each package is owned by its publisher, so contributions, such as
              bug reports and pull requests, should be made via the repository
              link provided by the publisher. You may press the &quot;Provide
              feedback&quot; link at the package page to open a new issue in the
              package’s repository.
            </p>
          </FAQItem>
          <FAQItem question="Why isn’t my package displayed on Construct Hub?">
            <p>
              Construct Hub includes publicly-available constructs that are
              JSII-compatible and that were published to the NPM registry with a
              permissive open-source license and a CDK keyword: aws-cdk, cdk8s,
              or cdktf. If you believe your package qualifies, but it still does
              not appear in Construct Hub, please raise an issue{" "}
              <FAQLink href={`${CONSTRUCT_HUB_REPO_URL}/issues/new`}>
                here
              </FAQLink>
              .
            </p>
          </FAQItem>
          <FAQItem question="Can I update my package after it has been displayed?">
            <p>
              Yes, you can and should! After you publish a new valid version to
              the public NPM registry, it should appear on Construct Hub within
              5-10 minutes.
            </p>
          </FAQItem>
          <FAQItem question="How does Construct Hub relates to the Construct Catalog?">
            <p>
              The Construct Catalog was built by the CDK community in
              collaboration with the AWS CDK team. Construct Hub is the official
              version of the Construct Catalog with ongoing support by the AWS
              CDK team and essentially replaces the Construct Catalog.{" "}
              <FAQLink href="https://awscdk.io/">https://awscdk.io</FAQLink> now
              redirects to Construct Hub.
            </p>
          </FAQItem>
          <FAQItem question="Is there a cost for using third-party constructs from Construct Hub?">
            <p>
              All packages on Construct Hub have permissive open-source licenses
              and can be freely used in your applications. For details, review
              the package’s license via its repository link.
            </p>
          </FAQItem>
          <FAQItem question="How can I participate in the Construct Hub community?">
            <p>
              Construct Hub is itself an open-source construct! Join the{" "}
              <FAQLink href={CONSTRUCT_HUB_REPO_URL}>
                Construct Hub GitHub community
              </FAQLink>
              . You are also welcome to join the <code>#construct-hub-dev</code>{" "}
              channel in the{" "}
              <FAQLink href="https://cdk.dev/">CDK community</FAQLink> Slack
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
        <Box bg="gray.50" py={5} width="100%"></Box>
        <FAQSection heading="Getting Started">
          <FAQItem question="Do I need a user account for Construct Hub?">
            <p>No. Construct Hub doesn’t require any signup.</p>
          </FAQItem>
          <FAQItem question="How do I get started?">
            <p>
              Start by exploring featured, community and official libraries for
              the CDK of your interest. Run a free-text search to find libraries
              for your needs, then filter the results by your preferred
              programming language, CDK type, CDK major version and/or author
              type. To learn more about a library, click its card to see helpful
              information like metadata, README, API reference and code samples
              in your preferred programing language.
            </p>
          </FAQItem>
        </FAQSection>
      </Accordion>
      <Box bg="gray.50" py={5} width="100%"></Box>
    </Box>
  </Page>
);
