import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Collapse,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Card } from "../Card";
import { ExternalLink } from "../ExternalLink";

const STORAGE_KEY = "showing-dev-preview-banner";

export const DevPreviewBanner: FunctionComponent = () => {
  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen: JSON.parse(
      window.sessionStorage.getItem(STORAGE_KEY) ?? "true"
    ),
    onClose: () => window.sessionStorage.setItem(STORAGE_KEY, "false"),
  });

  return (
    <Box h="max-content">
      <Collapse in={isOpen}>
        <Card
          bg="white"
          color="blue.800"
          mt={4}
          mx={4}
          p={4}
          position="relative"
        >
          <Text fontSize="md" mr={8} textAlign="center">
            This application is in Developer Preview. Some features may change.
            If you find any issues, please report them{" "}
            <ExternalLink
              hasWarning={false}
              href="https://github.com/cdklabs/construct-hub-webapp/issues"
            >
              here
            </ExternalLink>
          </Text>
          <IconButton
            aria-label="Dismiss banner"
            colorScheme="blue"
            icon={<CloseIcon />}
            onClick={onClose}
            position="absolute"
            right={4}
            size="sm"
            top="50%"
            transform="translateY(-50%)"
            variant="ghost"
          />
        </Card>
      </Collapse>
    </Box>
  );
};
