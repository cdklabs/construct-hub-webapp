import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { HOME_ANALYTICS, SECTION_PADDING } from "./constants";
import testIds from "./testIds";
import { Category } from "../../api/config";
import { NavLink } from "../../components/NavLink";
import { useConfigValue } from "../../hooks/useConfigValue";
import { getSearchPath } from "../../util/url";

/**
 * Categories used if config does not have specific categories
 */
const DEFAULT_CATEGORIES: Category[] = [
  { title: "Monitoring", url: getSearchPath({ keywords: ["monitoring"] }) },
  { title: "Containers", url: getSearchPath({ keywords: ["containers"] }) },
  { title: "Serverless", url: getSearchPath({ keywords: ["serverless"] }) },
  { title: "Databases", url: getSearchPath({ keywords: ["databases"] }) },
  { title: "Utilities", url: getSearchPath({ keywords: ["utilities"] }) },
  { title: "Deployment", url: getSearchPath({ keywords: ["deployment"] }) },
  { title: "Websites", url: getSearchPath({ keywords: ["websites"] }) },
  { title: "Security", url: getSearchPath({ keywords: ["security"] }) },
  { title: "Compliance", url: getSearchPath({ keywords: ["compliance"] }) },
  { title: "Network", url: getSearchPath({ keywords: ["network"] }) },
  {
    title: "Artificial Intelligence (AI)",
    url: getSearchPath({ keywords: ["artificial intelligence (ai)"] }),
  },
  {
    title: "Cloud Services Integrations",
    url: getSearchPath({ keywords: ["cloud services integrations"] }),
  },
];

export const Categories: FunctionComponent = () => {
  const categories = useConfigValue("categories") ?? DEFAULT_CATEGORIES;

  return (
    <Flex
      data-testid={testIds.categoriesContainer}
      direction="column"
      my={4}
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
      zIndex="0"
    >
      <Heading
        as="h3"
        color="white"
        data-testid={testIds.categoriesHeader}
        fontSize="1.5rem"
        fontWeight="semibold"
        lineHeight="lg"
        mb={1}
      >
        Search by use case
      </Heading>
      <Text
        color="white"
        data-testid={testIds.categoriesDescription}
        lineHeight="md"
        mb={5}
      >
        Find the right construct for your problem set from a community that’s
        already tackled it.
      </Text>

      <Wrap>
        {categories.map((category) => (
          <WrapItem key={category.title}>
            <NavLink
              data-event={HOME_ANALYTICS.USE_CASE.eventName(category.title)}
              to={category.url}
            >
              <Button
                as={Box}
                boxShadow="0px 4px 4px rgba(73, 73, 73, 0.63)"
                color="textPrimary"
                colorScheme="gray"
                size="md"
              >
                {category.title}
              </Button>
            </NavLink>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};
