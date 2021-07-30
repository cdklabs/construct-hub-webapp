import {
  Heading,
  Text,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import type { FunctionComponent, ReactChild } from "react";

export interface FAQItemProps {
  question: ReactChild;
}

export const FAQItem: FunctionComponent<FAQItemProps> = ({
  question,
  children,
}) => (
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" py={2} textAlign="left">
        <Heading as="h3" ml={8} size="sm">
          {question}
        </Heading>
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel px={12} py={4}>
      <Text
        color="gray.800"
        fontSize="md"
        sx={{ p: { marginTop: "0", marginBottom: "4" } }}
      >
        {children}
      </Text>
    </AccordionPanel>
  </AccordionItem>
);
