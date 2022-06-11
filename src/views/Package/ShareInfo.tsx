import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
} from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code } from "../../components/Code";
import { getPackagePath } from "../../util/url";
import { usePackageState } from "./PackageState";

export const ShareInfo: FunctionComponent = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { scope, name } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;
  const encodedName = encodeURIComponent(pkgName);

  useEffect(() => {
    setTabIndex(0);
  }, []);

  const baseUrl = window.location.hostname; // e.g. "constructs.dev"
  const packagePath = getPackagePath({ name: pkgName });

  const codeSamples = (darkMode: boolean) => {
    const imageUrl = `https://${baseUrl}/badge?package=${encodedName}${
      darkMode ? "&darkMode=true" : ""
    }`;
    const linkUrl = `https://${baseUrl}${packagePath}`;
    const markdown = `[![View on Construct Hub](${imageUrl})](${linkUrl})`;
    const html = `<a href="${linkUrl}"><img src="${imageUrl}" alt="View on Construct Hub"/></a>`;
    return { markdown, html };
  };

  const lightModeCode = codeSamples(false);
  const darkModeCode = codeSamples(true);

  return (
    <Box bg="bgPrimary" py={1} width="100%">
      <Text>
        Use the snippets below in your Git repositories or elsewhere to add a
        button that links to this package.
      </Text>

      <Heading as="h2" color="textPrimary" fontSize="2xl" mx="auto" py={5}>
        Light Button
      </Heading>
      <Link to="/packages/constructs">
        <Image src="/badge.svg" />
      </Link>

      <Tabs index={tabIndex} my={3} onChange={setTabIndex} variant="line">
        <TabList borderBottom="base" px={{ base: 0, lg: 6 }}>
          <Tab>Markdown</Tab>
          <Tab>HTML</Tab>
        </TabList>
        <TabPanels maxW="full">
          <TabPanel>
            <Code
              boxShadow="none"
              code={lightModeCode.markdown}
              fontSize="inherit"
              language={"markdown"}
              mt={2}
            />
          </TabPanel>

          <TabPanel>
            <Code
              boxShadow="none"
              code={lightModeCode.html}
              fontSize="inherit"
              language={"markdown"}
              mt={2}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Heading as="h2" color="textPrimary" fontSize="2xl" mx="auto" py={5}>
        Dark Button
      </Heading>
      <Link to="/packages/constructs">
        <Image src="/badge-dark.svg" />
      </Link>

      <Tabs index={tabIndex} my={3} onChange={setTabIndex} variant="line">
        <TabList borderBottom="base" px={{ base: 0, lg: 6 }}>
          <Tab>Markdown</Tab>
          <Tab>HTML</Tab>
        </TabList>
        <TabPanels maxW="full">
          <TabPanel>
            <Code
              boxShadow="none"
              code={darkModeCode.markdown}
              fontSize="inherit"
              language={"markdown"}
              mt={2}
            />
          </TabPanel>

          <TabPanel>
            <Code
              boxShadow="none"
              code={darkModeCode.html}
              fontSize="inherit"
              language={"markdown"}
              mt={2}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
