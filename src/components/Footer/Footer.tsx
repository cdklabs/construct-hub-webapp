import {
  Button,
  ButtonProps,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useShortBread } from "../../contexts/Shortbread";
import { SECTION_PADDING } from "../../views/Home/constants";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import { DISCLAIMER, FOOTER_LINKS } from "./constants";
import testIds from "./testIds";

export interface FooterProps {}

const LinkButton: FunctionComponent<
  ButtonProps & { "data-testid"?: string }
> = (props) => (
  <Button
    color="inherit"
    fontSize="inherit"
    fontWeight="normal"
    variant="link"
    {...props}
  />
);

export const Footer: FunctionComponent<FooterProps> = () => {
  const { customizeCookies } = useShortBread();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="footer"
      bg="brand.800"
      color="white"
      data-testid={testIds.container}
      direction="column"
      fontSize="sm"
      px={SECTION_PADDING.X}
      py={4}
    >
      <Flex
        align="center"
        data-testid={testIds.links}
        gap={4}
        justify="space-between"
        w="full"
        wrap="wrap"
      >
        {/* AWS Links */}
        <Flex align="center" gap={4}>
          {Object.entries(FOOTER_LINKS).map(
            ([key, { display, isExternal = true, testId, url }]) => (
              <Flex
                align="center"
                direction={{ base: "column", md: "row" }}
                key={key}
              >
                {isExternal ? (
                  <ExternalLink
                    color="currentcolor"
                    data-testid={testIds[testId]}
                    hasWarning={false}
                    href={url}
                    mx="auto"
                  >
                    {display}
                  </ExternalLink>
                ) : (
                  <NavLink
                    color="currentcolor"
                    data-testid={testIds[testId]}
                    mx="auto"
                    to={url}
                  >
                    {display}
                  </NavLink>
                )}
              </Flex>
            )
          )}
        </Flex>

        {/* Manage Cookies / Color mode toggle */}
        <Flex align="center" gap={4}>
          <LinkButton
            data-testid={testIds.manageCookies}
            onClick={customizeCookies}
          >
            Manage Cookies
          </LinkButton>
          <LinkButton onClick={toggleColorMode}>
            View in {colorMode === "light" ? "dark" : "light"} mode
          </LinkButton>
        </Flex>
      </Flex>

      {/* Disclaimer Text */}
      <Text data-testid={testIds.disclaimer} mt={4}>
        {DISCLAIMER}
      </Text>
    </Flex>
  );
};
