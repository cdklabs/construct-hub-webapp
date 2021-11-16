import { Flex, Heading, Text, Button, Wrap, WrapItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Category } from "../../api/config";
import { NavLink } from "../../components/NavLink";
import { useConfigValue } from "../../hooks/useConfigValue";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import testIds from "./testIds";

/**
 * Categories used if config does not have specific categories
 */
const DEFAULT_CATEGORIES: Category[] = [
  { title: "Monitoring", searchKeyword: "monitoring" },
  { title: "Kubernetes", searchKeyword: "kubernetes" },
  { title: "Serverless", searchKeyword: "serverless" },
  { title: "Databases", searchKeyword: "databases" },
  { title: "Utilities", searchKeyword: "utilities" },
  { title: "Deployment", searchKeyword: "deployment" },
  { title: "Partners", searchKeyword: "partners" },
  { title: "Websites", searchKeyword: "web" },
  { title: "Security", searchKeyword: "security" },
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
        Solve for your use case with pre-built constructs
      </Heading>
      <Text
        color="white"
        data-testid={testIds.categoriesDescription}
        lineHeight="md"
        mb={5}
      >
        Constructs solve a lot of helpful use cases you may be trying to solve.
        They will save you and your team a bunch of time and headaches.
      </Text>

      <Wrap>
        {categories.map((category) => (
          <WrapItem key={category.title}>
            <Button
              as={NavLink}
              color="blue.800"
              colorScheme="gray"
              size="md"
              style={{ boxShadow: "0px 4px 4px rgba(73, 73, 73, 0.63)" }}
              to={getSearchPath({ query: category.searchKeyword })}
            >
              {category.title}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};
