import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Collapse, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Card } from "../Card";
import { ExternalLink } from "../ExternalLink";

export const DevPreviewBanner: FunctionComponent = () => {
  return (
    <Box h="max-content">
      <Collapse in={true}>
        <Card
          aria-label="Preview Banner"
          bg="blue.500"
          border="none"
          boxShadow="none"
          color="white"
          mt={4}
          mx={4}
          p={4}
          position="relative"
          role="alertdialog"
        >
          <InfoOutlineIcon h={5} left={4} position="absolute" top={4} w={5} />
          <Text fontSize="md" mx={8} textAlign="center">
            This application is in preview. Some features may change. If you
            find any issues, please report them{" "}
            <ExternalLink
              color="inherit"
              hasWarning={false}
              href="https://github.com/cdklabs/construct-hub-webapp/issues"
              textDecoration="underline"
            >
              here
            </ExternalLink>
          </Text>
        </Card>
      </Collapse>
    </Box>
  );
};
