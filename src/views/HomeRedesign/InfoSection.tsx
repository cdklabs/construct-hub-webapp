import { Grid, Heading, Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactNode } from "react";
import { SECTION_PADDING } from "./constants";

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
    px={SECTION_PADDING.X}
    py={SECTION_PADDING.Y}
    templateColumns="1fr"
    templateRows="minmax(4.5rem, min-content) 1fr auto"
  >
    <Heading
      as="h3"
      fontSize="1.5rem"
      fontWeight="semibold"
      lineHeight="lg"
      mb={4}
    >
      {title}
    </Heading>
    <Text fontSize="lg" mb={4}>
      {description}
    </Text>
    {children}
  </Grid>
);
