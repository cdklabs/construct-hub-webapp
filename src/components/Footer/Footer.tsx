import { Box, Button, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useShortBread } from "../../contexts/Shortbread";
import { createTestIds } from "../../util/createTestIds";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import { DISCLAIMER, FOOTER_LINKS } from "./constants";

export interface FooterProps {}

export const testIds = createTestIds("footer", [
  "container",
  "links",
  "disclaimer",
  ...Object.values(FOOTER_LINKS).map(({ testId }) => testId),
] as const);

export const Footer: FunctionComponent<FooterProps> = () => {
  const { customizeCookies } = useShortBread();

  return (
    <Flex
      align="center"
      as="footer"
      bg="blue.800"
      color="white"
      data-testid={testIds.container}
      direction="column"
      justify="center"
      py={4}
    >
      <SimpleGrid columnGap={6} columns={[1, 2, 4]} data-testid={testIds.links}>
        {Object.entries(FOOTER_LINKS).map(
          ([key, { display, isExternal = true, testId, url }], index) => (
            <Flex
              align="center"
              direction={{ base: "column", md: "row" }}
              key={key}
            >
              {/* Single Row Divider */}
              <Box
                display={{ base: "none", md: index !== 0 ? "initial" : "none" }}
                h={5}
              >
                <Divider borderColor="white" mr={6} orientation="vertical" />
              </Box>
              {isExternal ? (
                <ExternalLink
                  color="currentcolor"
                  data-testid={testIds[testId]}
                  hasWarning={false}
                  href={url}
                  lineHeight={10}
                  mx="auto"
                >
                  {display}
                </ExternalLink>
              ) : (
                <NavLink
                  color="currentcolor"
                  data-testid={testIds[testId]}
                  href={url}
                  lineHeight={10}
                  mx="auto"
                >
                  {display}
                </NavLink>
              )}
              {/* 2 Row Divider */}
              <Box
                display={{
                  base: "none",
                  sm: index < 2 ? "initial" : "none",
                  md: "none",
                }}
                w="100%"
              >
                <Divider borderColor="white" />
              </Box>
            </Flex>
          )
        )}
      </SimpleGrid>
      <Text data-testid={testIds.disclaimer} fontSize="xs" mt={4}>
        {DISCLAIMER}
      </Text>
      <Button
        color="white"
        fontSize="xs"
        fontWeight="normal"
        mt={4}
        onClick={customizeCookies}
        variant="link"
      >
        Manage Cookies
      </Button>
    </Flex>
  );
};
