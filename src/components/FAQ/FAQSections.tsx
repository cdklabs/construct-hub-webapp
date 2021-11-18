import { Accordion, AccordionProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const FAQSections: FunctionComponent<AccordionProps> = ({
  children,
  ...accordionProps
}) => (
  <Accordion allowMultiple {...accordionProps}>
    {children}
  </Accordion>
);
