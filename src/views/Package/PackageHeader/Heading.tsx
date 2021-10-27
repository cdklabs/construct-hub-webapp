import {
  Stack,
  StackProps,
  Heading as ChakraHeading,
  Text,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Metadata } from "../../../api/package/metadata";
import { CDKTypeIcon, CDKTypeText } from "../../../components/CDKType";

interface HeadingProps extends StackProps {
  name: string;
  description?: string;
  metadata: Metadata;
}

export const Heading: FunctionComponent<HeadingProps> = ({
  name,
  description,
  metadata,
  ...stackProps
}) => (
  <Stack lineHeight="1.5" spacing={2} {...stackProps}>
    <ChakraHeading color="blue.800" fontSize="1.5rem">
      {name}
    </ChakraHeading>

    <Text fontSize="1rem">{description}</Text>

    <Stack align="center" direction="row" spacing={2}>
      <CDKTypeIcon metadata={metadata} />
      <CDKTypeText
        color="gray.700"
        fontSize=".75rem"
        fontWeight="semibold"
        metadata={metadata}
      />
    </Stack>
  </Stack>
);
