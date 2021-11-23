import { Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  FAQ,
  FAQHeading,
  FAQSections,
  FAQSection,
  FAQItem,
  FAQLink,
} from "../../components/FAQ";
import { Page } from "../../components/Page";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";

export const FAQPage: FunctionComponent = () => (
  <Page
    meta={{
      title: "FAQ",
      description: "Frequently Asked Questions",
    }}
    pageName="faq"
  >
    <FAQ>
      <FAQHeading>Frequently Asked Questions</FAQHeading>

      <FAQSections defaultIndex={[0, 1]}>
        <FAQSection heading="General">
          <FAQItem question="How can I add my construct to Construct Hub?">
            <Text>
              Constructs intended for Construct Hub must be published to the{" "}
              <FAQLink href="https://www.npmjs.com/">npm Registry</FAQLink>{" "}
              under Apache, BSD, EPL, MPL-2.0, ISC and CDDL or MIT open source
              licenses and annotated with a keyword recognized by Construct Hub
              (awscdk, cdk8s, or cdktf).
            </Text>

            <Text>
              Additionally, since one of the main goals of Construct Hub is to
              enable an ecosystem of constructs that can be consumed by all CDK
              languages, your library <strong>must</strong> be compiled with{" "}
              <FAQLink href="https://aws.github.io/jsii/">JSII</FAQLink>, a
              TypeScript-based tool for building multi-language libraries.
              Construct Hub leverages the type information produced by the JSII
              compiler to render a rich multi-language API reference for each
              construct.
            </Text>

            <Text>
              Construct Hub continuously monitors the npm Registry. Packages
              that meet the above requirements appear in Construct Hub in about
              5-10 minutes. If your package does not appear in Construct Hub,
              but meets these requirements, please file an issue against our{" "}
              <FAQLink href={`${CONSTRUCT_HUB_REPO_URL}/issues/new`}>
                GitHub repository.
              </FAQLink>
            </Text>

            <Text>
              The community has provided some great resources about publishing
              construct libraries that meet Construct Hub requirements. For
              example, see{" "}
              <FAQLink href="https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4">
                “A Beginner&apos;s Guide to Create AWS CDK ConstructLibrary with{" "}
                projen”
              </FAQLink>{" "}
              by <FAQLink href="https://hayao-k.dev/">hayao-k</FAQLink>.
            </Text>

            <Text>
              If you already have a library written in TypeScript and want to
              migrate it to JSII so it can be included in Construct Hub, see the{" "}
              <FAQLink href="https://aws.github.io/jsii/user-guides/#library-author-guide">
                JSII library author guide.
              </FAQLink>
            </Text>
          </FAQItem>

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
            <Text>
              Construct Hub is a central venue where CDK developers can discover
              construct libraries to help them build their applications. You can
              find construct libraries in TypeScript, Python, Java and .NET (Go
              is coming soon!), browse their developer guides and API
              references, and explore code samples in all the programming
              language that the package supports.
            </Text>
          </FAQItem>

          <FAQItem question="What is a construct?">
            <Text>
              The Constructs Programming Model (CPM) introduces the notion of{" "}
              <strong>constructs</strong>, which represent building blocks that
              can be used to assemble complete cloud applications of any
              complexity. AWS, enterprises, startups, and individual developers
              use CDK constructs to share proven architecture patterns as
              reusable code libraries, so that everyone can benefit from the
              collective wisdom of the community.
            </Text>
          </FAQItem>

          <FAQItem question="What are the prerequisites for using a construct library?">
            <Text>
              To use a construct library in your code, you need to have your
              preferred programming language installed. In order to synthesize,
              diff, and deploy collections of resources you will need to install
              the CDK Toolkit command-line tool. For AWS CDK install the{" "}
              <FAQLink href="https://docs.aws.amazon.com/cdk/latest/guide/cli.html">
                AWS CDK Toolkit command-line tool,
              </FAQLink>{" "}
              for CDK8s install the{" "}
              <FAQLink href="https://cdk8s.io/docs/latest/getting-started/">
                CDK8s command-line tool
              </FAQLink>{" "}
              and for CDKtf install the{" "}
              <FAQLink href="https://learn.hashicorp.com/tutorials/terraform/cdktf-install">
                CDKtf command-line tool.
              </FAQLink>
            </Text>
            <Text>
              The CDK8s CLI doesn’t require having any registered account nor
              having a running Kubernetes cluster as it only updates Kubernetes
              manifests.
            </Text>
            <Text>
              The CDKtf CLI requires having Terraform, Node, Yarn and Docker
              installed.
            </Text>
            <Text>
              Some construct libraries’ documentation may include additional
              prerequisites which are unique to their implementation.
            </Text>
          </FAQItem>

          <FAQItem question="Who owns the constructs in Construct Hub?">
            <Text>
              Constructs are user-generated content owned by the publishers of
              the individual packages. Each is governed by its own license terms
              chosen by its publisher (although only packages with permissive
              licenses are included in Construct Hub). License information can
              be accessed directly through the hyperlinked package page.
            </Text>
          </FAQItem>

          <FAQItem question="Is the content served in Construct Hub meant to be consumed programmatically?">
            <Text>
              No. The content displayed in the site is user-generated, with some
              display formatting. We do not advise that you consume constructs
              from the search results programmatically. Construct Hub is a
              search engine or portal intended to surface third-party content
              from a public endpoint. We provide these results for your
              convenience AS-IS in accordance with our{" "}
              <FAQLink href="https://constructs.dev/terms">Site Terms</FAQLink>.
            </Text>
          </FAQItem>

          <FAQItem question="Which CDK types are available on the Construct Hub?">
            <Text>
              Construct Hub currently has constructs for the CDK for
              CloudFormation (AWS CDK), CDK for Kubernetes (CDK8s) and CDK for
              Terraform (CDKtf). We are open to adding other construct-based
              tools as they evolve.
            </Text>
          </FAQItem>

          <FAQItem question="What is CDK for CloudFormation (AWS CDK)?">
            <Text>
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
            </Text>
          </FAQItem>

          <FAQItem question="What is CDK for Kubernetes (CDK8s)?">
            <Text>
              CDK for Kubernetes (CDK8s, pronounced “cd kates”) is an
              open-source software development framework for defining Kubernetes
              applications and reusable abstractions using familiar programming
              languages and rich object-oriented APIs. CDK8s apps synthesize
              into standard Kubernetes manifests that can be applied to any
              Kubernetes cluster. See{" "}
              <FAQLink href="https://cdk8s.io/">CDK for Kubernetes</FAQLink> for
              more information.
            </Text>
          </FAQItem>

          <FAQItem question="What is CDK for Terraform (CDKtf)?">
            <Text>
              The community preview of the Cloud Development Kit for Terraform
              (CDKtf) allows you to define infrastructure using a familiar
              programming language such as TypeScript, Python, or Go, while
              leveraging the hundreds of providers and thousands of module
              definitions provided by Terraform and the Terraform ecosystem. See{" "}
              <FAQLink href="https://learn.hashicorp.com/tutorials/terraform/cdktf">
                CDK for Terraform
              </FAQLink>{" "}
              for more information.
            </Text>
          </FAQItem>

          <FAQItem question="What programming languages are supported?">
            <Text>
              The Construct Hub GA supports constructs available for Python,
              TypeScript, Java and .NET. Support for Go will be included soon.
            </Text>
          </FAQItem>

          <FAQItem question="Will Go be supported?">
            <Text>
              Yes! We can’t promise exactly when, but it should be soon.
            </Text>
          </FAQItem>

          <FAQItem question="Can I view the source code of a construct?">
            <Text>
              Source code is usually available via the repository link provided
              by the construct’s publisher; this link appears on Construct Hub.
              We have noticed that the code in the linked repository can
              sometimes be newer or older than the code in the published
              package, so exercise care.
            </Text>
          </FAQItem>

          <FAQItem question="How can I install a package?">
            <Text>
              The details vary by construct. Click “Install” in the package page
              to see the construct’s installation instructions.
            </Text>
          </FAQItem>

          <FAQItem question="How can I report a package?">
            <Text>
              Your trust is vital to the success of Construct Hub. If you
              believe a package contains suspicious code, violates its
              dependencies’ licenses, or is otherwise not behaving as a good
              citizen of the community, click &quot;Report this package&quot; at
              the bottom of the package page and send us an email with
              explanations and evidence to support your claims. If we can verify
              the issue, we will take appropriate action, up to and including
              removing the package from Construct Hub.
            </Text>
          </FAQItem>

          <FAQItem question="How can I report a bug or contribute code to a construct?">
            <Text>
              Each package is owned by its publisher, so contributions, such as
              bug reports and pull requests, should be made via the repository
              link provided by the publisher. You may press the &quot;Provide
              feedback&quot; link at the package page to open a new issue in the
              package’s repository.
            </Text>
          </FAQItem>

          <FAQItem question="Why isn’t my package displayed on Construct Hub?">
            <Text>
              Construct Hub includes publicly-available constructs that are
              JSII-compatible and that were published to the npm Registry under
              Apache, BSD, EPL, MPL-2.0, ISC and CDDL or MIT open source
              licenses and with a CDK keyword: aws-cdk, cdk8s, or cdktf. If you
              believe your package qualifies, but it still does not appear in
              Construct Hub, please raise an issue{" "}
              <FAQLink href={`${CONSTRUCT_HUB_REPO_URL}/issues/new`}>
                here
              </FAQLink>
              .
            </Text>
          </FAQItem>

          <FAQItem question="Can I update my package after it has been displayed?">
            <Text>
              Yes, you can and should! After you publish a new valid version to
              the public npm Registry, it should appear on Construct Hub in
              about 5-10 minutes.
            </Text>
          </FAQItem>

          <FAQItem question="How does Construct Hub relates to the Construct Catalog?">
            <Text>
              The Construct Catalog was built by the CDK community in
              collaboration with the AWS CDK team. Construct Hub is the official
              version of the Construct Catalog with ongoing support by the AWS
              CDK team and essentially replaces the Construct Catalog.{" "}
              <FAQLink href="https://awscdk.io/">https://awscdk.io</FAQLink> now
              redirects to Construct Hub.
            </Text>
          </FAQItem>

          <FAQItem question="Is there a cost for using third-party constructs from Construct Hub?">
            <Text>
              All packages on Construct Hub are published under Apache, BSD,
              EPL, MPL-2.0, ISC and CDDL or MIT open source licenses and can be
              freely used in your applications. For details, review the
              package’s license via its repository link.
            </Text>
          </FAQItem>

          <FAQItem question="How can I participate in the Construct Hub community?">
            <Text>
              Construct Hub is itself an open-source construct! Join the{" "}
              <FAQLink href={CONSTRUCT_HUB_REPO_URL}>
                Construct Hub GitHub community
              </FAQLink>
              . You are also welcome to join the <code>#construct-hub-dev</code>{" "}
              channel in the{" "}
              <FAQLink href="https://cdk.dev/">CDK community</FAQLink> Slack
              workspace.
            </Text>
          </FAQItem>

          <FAQItem question="Is there a community slack channel for the CDK community?">
            <Text>
              Please join the CDK Slack channel (
              <FAQLink href="https://cdk.dev/">https://cdk.dev/</FAQLink>). This
              Slack channel is managed by the CDK community for the CDK
              community.
            </Text>
          </FAQItem>
        </FAQSection>

        <FAQSection heading="Getting Started">
          <FAQItem question="Do I need a user account for Construct Hub?">
            <Text>No. Construct Hub doesn’t require any signup.</Text>
          </FAQItem>

          <FAQItem question="How do I get started?">
            <Text>
              Start by exploring featured, community and official libraries for
              the CDK of your interest. Run a free-text search to find libraries
              for your needs, then filter the results by your preferred
              programming language, CDK type, CDK major version and/or author
              type. To learn more about a library, click its card to see helpful
              information like metadata, README, API reference and code samples
              in your preferred programing language.
            </Text>
          </FAQItem>
        </FAQSection>
      </FAQSections>
    </FAQ>
  </Page>
);
