import {
  Accordion,
  OrderedList,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { FAQ, FAQHeading, FAQItem, FAQLink } from "../../components/FAQ";
import { Page } from "../../components/Page";

export const Contribute: FunctionComponent = () => (
  <Page
    meta={{
      description: "Learn about contributing to Construct Hub.",
      title: "Contribute",
    }}
    pageName="contribute"
  >
    <FAQ>
      <FAQHeading>Contributing to Construct Hub</FAQHeading>

      <Accordion allowMultiple allowToggle defaultIndex={[0]}>
        <FAQItem question="How can I add my construct to Construct Hub?">
          <Text>
            Constructs intended for Construct Hub must be published to the{" "}
            <FAQLink href="https://www.npmjs.com/">NPM registry</FAQLink> under
            a permissive license (such as Apache, BSD, EPL, MPL-2.0, ISC and
            CDDL or MIT) and annotated with a keyword recognized by Construct
            Hub (awscdk, cdk8s, or cdktf).
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
            Construct Hub continuously monitors the NPM Registry. Packages that
            meet the above requirements appear in Construct Hub within 5-10
            minutes. If your package does not appear in Construct Hub, but meets
            these requirements, please file an issue against our GitHub
            repository.
          </Text>

          <Text>
            The community has provided some great resources about publishing
            construct libraries that meet Construct Hub requirements. For
            example, see “A Beginner&apos;s Guide to Create AWS CDK Construct
            Library with{" "}
            <FAQLink href="https://dev.to/aws-builders/a-beginner-s-guide-to-create-aws-cdk-construct-library-with-projen-5eh4">
              projen
            </FAQLink>
            ” by <FAQLink href="https://hayao-k.dev/">hayao-k</FAQLink>.
          </Text>

          <Text>
            If you already have a library written in TypeScript and want to
            migrate it to JSII so it can be included in Construct Hub, see the{" "}
            <FAQLink href="https://aws.github.io/jsii/user-guides/#library-author-guide">
              JSII library author guide.
            </FAQLink>
          </Text>
        </FAQItem>

        <FAQItem question="What are the best practices for improving discoverability of a construct library on Construct Hub?">
          <Text>
            To improve your construct library’s visibility on Construct Hub,
            follow these best practices:
          </Text>
          <OrderedList sx={{ li: { mt: 4 } }}>
            <ListItem>
              <strong>Helpful description.</strong> Publish your library with a
              description. Libraries without description have lower chances to
              be discovered by users. When you write your library’s description,
              think: Why would someone use it? What makes it unique? Make the
              description as accurate and differentiated as possible.
            </ListItem>

            <ListItem>
              <strong>Helpful keywords.</strong> Publish your library with
              helpful keywords, ones that can help potential users to find your
              package. Helpful keywords can be technologies that are being used
              by the library, use cases the library is useful for, service names
              that are being used by the library etc. For example: ‘Monitoring’,
              ‘Kubernetes’, ‘Cost Management’, ‘Websites’, ‘AI’, ‘Containers’
              and more.
            </ListItem>

            <ListItem>
              <strong>Helpful keywords.</strong> Publish your library with
              helpful keywords, ones that can help potential users to find your
              package. Helpful keywords can be technologies that are being used
              by the library, use cases the library is useful for, service names
              that are being used by the library etc. For example: ‘Monitoring’,
              ‘Kubernetes’, ‘Cost Management’, ‘Websites’, ‘AI’, ‘Containers’
              and more.
            </ListItem>

            <ListItem>
              <strong>Helpful README.</strong> Review your library’s README
              file. Is it developer-friendly? That is, can developers quickly
              understand the use case you’re trying to solve? Does your README
              make it easy to get started with your library? Does it explain how
              your library is different from other libraries? Is it easy to
              understand at first glance the value developers gain from the
              library? For more information see *“Q: What are the best practices
              for a developer-friendly README file?”.*
            </ListItem>

            <ListItem>
              <strong>API documentation.</strong> Document the library classes,
              methods, properties in the library’s code. Construct Hub will
              display this information when it automatically generates the API
              documentation.
            </ListItem>

            <ListItem>
              <strong>Maintain your library.</strong> Developers prefer
              libraries that are updated on a regular basis. Our experience
              shows that successful libraries are those where publishers engage
              and collaborate with the user community, respond to issues and
              pull requests, fix bugs, and add capabilities. To gain more
              developers trust, maintain the releases section on your code
              repository and make sure to describe the changes between different
              releases. You may consider to link the libraries you’ve published
              with your code repository.
            </ListItem>

            <ListItem>
              <strong>Amazon Partner Network (APN) badge.</strong> If you’re an
              AWS partner and you are publishing a library for your service,
              please reach out to us and we will be happy to add a badge to your
              libraries with your company’s name.
            </ListItem>

            <ListItem>
              <strong>
                Enable support for multiple programming languages.
              </strong>{" "}
              Make your library usable by a broader set of users and increase
              its value to the ecosystem. Starting with your library written in
              TypeScript, JSII will create packages in the other CDK programming
              languages. Construct Hub will then automatically generate API
              reference and transliterate code samples. All you need to do is to
              follow the instructions under *“Q: How can I add my construct to
              Construct Hub?”.*
            </ListItem>

            <ListItem>
              <strong>
                Mention official names of technologies and services your’e using
                in your documentation.
              </strong>{" "}
              Describe technologies and services the construct is integrating
              with by using their official names. For example, don’t mention
              ‘eks’ or ‘EKS’ but ‘AWS EKS’; Don’t mention ‘vue’ or ‘Vue’ but
              ‘Vue.js’.
            </ListItem>
          </OrderedList>
        </FAQItem>

        <FAQItem question="What are the best practices for writing a developer-friendly README file?">
          <Text>
            Developer-friendly READMEs help readers quickly understand your
            library’s relevance to their needs and its unique value in
            comparison to similar libraries on the Construct Hub. Below is a
            suggestion for a README file structure:
          </Text>

          <UnorderedList sx={{ li: { mt: 4 } }}>
            <ListItem>
              <strong>State and maturity of the library.</strong> Start your
              READMEs with helpful badges like{" "}
              <FAQLink href="https://www.npmjs.com/package/cdk-codepipeline-badge-notification">
                CDK pipelines badges
              </FAQLink>
              . It will help users see the state of your package.
            </ListItem>

            <ListItem>
              <strong>Short description</strong>. What does this library do?
              Which use case does it solve? Which technologies and services does
              it use or support?
            </ListItem>

            <ListItem>
              <strong>What is unique about this library?</strong> Help readers
              quickly find the right library for their needs by stating its
              special advantages right up front. How does it compare to other
              libraries addressing the same need or that use the same
              technologies and services? You don’t need an explicit “us vs.
              them” feature checklist; just make sure you communicate your
              library’s unique value.
            </ListItem>

            <ListItem>
              <strong>Code samples.</strong> Include as many complete and
              working code samples as you can to help developers quickly
              understand how they can use your library. Some developers start
              reading code samples before anything else. Write your code samples
              in TypeScript, and Construct Hub will transliterate them to the
              other programming languages your library supports. A good practice
              is to include a minimal code sample of how to use your library in
              the first page of your README.
            </ListItem>

            <ListItem>
              <strong>Author information.</strong> Share information about you,
              other packages you’ve published, and additional helpful links that
              can improve your credibility with readers.
            </ListItem>

            <ListItem>
              <strong>License and support.</strong> Include a “License” and
              “Contributing” sections that invite users to contribute via links
              to your source code repository and issue tracker. (Construct Hub
              provides these links in your library’s package page, but it’s
              convenient to have them in the README too.)
            </ListItem>

            <ListItem>
              <strong>Diagrams.</strong> Diagrams always help readers quickly
              understand what a library does. Consider adding diagrams for
              libraries that create multiple services that work together.
            </ListItem>

            <ListItem>
              <strong>Explanatory videos.</strong> Consider sharing links to
              videos that can help potential customers engage with your library.
            </ListItem>

            <ListItem>
              <strong>Absolute links vs. relative.</strong> Use absolute links
              (those that start with http:// or https://) and not relative
              links. Relative links are prone to breaking when the content is
              shared elsewhere.
            </ListItem>
          </UnorderedList>
        </FAQItem>

        <FAQItem question="Why isn’t my package displayed on Construct Hub?">
          <Text>
            Construct Hub includes publicly-available constructs that are
            JSII-compatible and that were published to the NPM registry with a
            permissive open-source license and a CDK keyword: aws-cdk, cdk8s, or
            cdktf. If you believe your package qualifies, but it still does not
            appear in Construct Hub, please raise an issue{" "}
            <FAQLink href="https://github.com/cdklabs/construct-hub/issues/new">
              here
            </FAQLink>
            .
          </Text>
        </FAQItem>

        <FAQItem question="Can I update my package after it has been displayed?">
          <Text>
            Yes, you can and should! After you publish a new valid version to
            the public NPM registry, it should appear on Construct Hub within
            5-10 minutes.
          </Text>
        </FAQItem>

        <FAQItem question="How can I report a bug or contribute code to a construct?">
          <Text>
            Each package is owned by its publisher, so contributions, such as
            bug reports and pull requests, should be made via the repository
            link provided by the publisher. You may press the ‘Provide feedback’
            link at the package page to open a new issue in at the package’s
            repository.
          </Text>
        </FAQItem>

        <FAQItem question="How can I participate in link the Construct Hub community?">
          Construct Hub is itself an open-source construct! Join the{" "}
          <FAQLink href="https://github.com/cdklabs/construct-hub">
            Construct Hub GitHub community
          </FAQLink>
          . You are also welcome to join the #construct-hub-dev channel in the{" "}
          <FAQLink href="https://cdk.dev/">
            CDK community Slack workspace
          </FAQLink>
        </FAQItem>

        <FAQItem question="Is there a Slack channel for the CDK community?">
          <Text>
            Please join the{" "}
            <FAQLink href="https://cdk.dev/">CDK Slack channel</FAQLink>. This
            Slack channel is managed by the CDK community, for the CDK
            community.
          </Text>
        </FAQItem>
      </Accordion>
    </FAQ>
  </Page>
);
