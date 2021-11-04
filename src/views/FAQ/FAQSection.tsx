import {
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Heading,
  Box,
  Accordion,
} from "@chakra-ui/react";

import type { FunctionComponent } from "react";

export interface FAQSectionProps {
  heading: string;
}

export const FAQSection: FunctionComponent<FAQSectionProps> = ({
  heading,
  children,
}) => (
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" textAlign="left">
        <Heading as="h2" ml={4} my={4} size="lg">
          {heading}
        </Heading>
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel p={0}>
      <Accordion allowMultiple w="100%">
        {children}
      </Accordion>
    </AccordionPanel>
  </AccordionItem>
);
