import { Grid, Heading, Text } from "@chakra-ui/react";
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
  <Grid
    color="blue.800"
    data-testid={testIds.infoSection}
    px={SECTION_PADDING.X}
    py={SECTION_PADDING.Y}
    templateColumns="1fr"
    templateRows="auto 1fr auto"
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
    <Text data-testid={testIds.infoSectionDescription} fontSize="lg" mb={4}>
      {description}
    </Text>
    {children}
  </Grid>
);
