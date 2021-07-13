import { Code as InlineCode } from "@chakra-ui/react";
/* import { Language } from "prism-react-renderer"; */
import { Children, FunctionComponent, ReactNode } from "react";
/* import { useLanguage } from "../../hooks/useLanguage"; */
import { Code as BlockCode } from "../Code";

interface CodeProps {
  inline?: boolean;
  children: ReactNode;
}

export const Code: FunctionComponent<CodeProps> = ({ inline, children }) => {
  /* const [lang] = useLanguage(); */

  if (inline) {
    return <InlineCode p={2}>{children}</InlineCode>;
  }

  const code = Children.toArray(children)
    .reduce((accum: string, child): string => {
      if (typeof child === "string") {
        return `${accum}${child}`;
      }
      return accum;
    }, "")
    .trim();

  return <BlockCode code={code} language={"python"} />;
};
