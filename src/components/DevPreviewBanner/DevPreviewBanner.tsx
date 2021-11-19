import { CloseIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Collapse,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CONSTRUCT_HUB_REPO_URL } from "../../constants/links";
import { useConfig } from "../../contexts/Config";
import { Card } from "../Card";
import { ExternalLink } from "../ExternalLink";

const STORAGE_KEY = "showing-dev-preview-banner";

export const DevPreviewBanner: FunctionComponent = () => {
  const { data: config } = useConfig();
  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen: JSON.parse(
      window.sessionStorage.getItem(STORAGE_KEY) ?? "true"
    ),
    onClose: () => window.sessionStorage.setItem(STORAGE_KEY, "false"),
  });

  // we keep the box because otherwise layout breaks
  if (config?.featureFlags?.fullSite) {
    return <Box h="max-content" />;
  }

  return (
    <Box h="max-content">
      <Collapse in={isOpen}>
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
            This application is in Dev Preview. Some features may change. If you
            find any issues, please report them{" "}
            <ExternalLink
              color="inherit"
              hasWarning={false}
              href={`${CONSTRUCT_HUB_REPO_URL}/issues`}
              textDecoration="underline"
            >
              here
            </ExternalLink>
          </Text>
          <IconButton
            aria-label="Dismiss banner"
            colorScheme="white"
            icon={<CloseIcon />}
            onClick={onClose}
            position="absolute"
            right={4}
            size="xs"
            top={3}
            variant="ghost"
          />
        </Card>
      </Collapse>
    </Box>
  );
};
