import { Flex, Heading, Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactNode } from "react";
import { SECTION_PADDING } from "./constants";
import testIds from "./testIds";

export interface InfoSectionProps {
  title: string;
  description: ReactNode;
}

export const InfoSection: FunctionComponent<InfoSectionProps> = ({
  title,
  description,
  children,
}) => (
  <Flex
    color="blue.800"
    data-testid={testIds.infoSection}
    direction="column"
    px={SECTION_PADDING.X.map((p) => p / 2)}
    py={SECTION_PADDING.Y}
  >
    <Heading
      as="h3"
      data-testid={testIds.infoSectionHeading}
      fontSize="1.5rem"
      fontWeight="semibold"
      lineHeight="lg"
      mb={2}
    >
      {title}
    </Heading>
    <Flex direction="column" h="full" justify="space-between">
      <Text data-testid={testIds.infoSectionDescription} fontSize="lg" mb={4}>
        {description}
      </Text>
      {children}
    </Flex>
  </Flex>
);
