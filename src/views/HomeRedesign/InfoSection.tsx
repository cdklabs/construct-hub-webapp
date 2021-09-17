import { Heading, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactNode } from "react";

export interface InfoSectionProps {
  title: string;
  description: ReactNode;
}

export const InfoSection: FunctionComponent<InfoSectionProps> = ({
  title,
  description,
  children,
}) => (
  <Stack color="blue.800" spacing={4}>
    <Heading as="h3" size="md">
      {title}
    </Heading>
    <Text size="sm">{description}</Text>
    {children}
  </Stack>
);
