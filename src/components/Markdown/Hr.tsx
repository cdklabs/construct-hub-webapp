import { ClassAttributes, HTMLAttributes } from "react";
import type { ReactNode } from "react";
import { ReactMarkdownProps } from "react-markdown/src/ast-to-react";

// HRs are abused in API reference docs so a temporary hack is to simply filter
// them out until we remove them from the generated docs.
export const Hr = (
  _props: ClassAttributes<HTMLHRElement> &
    HTMLAttributes<HTMLHRElement> &
    ReactMarkdownProps
): ReactNode => <></>;
