import { DividerProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

// HRs are abused in API reference docs so a temporary hack is to simply filter
// them out until we remove them from the generated docs.
export const Hr: FunctionComponent<DividerProps> = () => <></>;
