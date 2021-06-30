import { chakra, HTMLChakraProps, forwardRef } from "@chakra-ui/react";

export interface FormProps extends HTMLChakraProps<"form"> {}

export const Form = forwardRef<FormProps, "form">((props, ref) => (
  <chakra.form {...props} ref={ref} />
));

Form.displayName = "Form";
