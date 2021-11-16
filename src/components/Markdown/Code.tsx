import { Code as InlineCode } from "@chakra-ui/react";
import { Language } from "prism-react-renderer";
import { Children, FunctionComponent, ReactNode } from "react";
import { Code as BlockCode } from "../Code";

interface CodeProps {
  inline?: boolean;
  children: ReactNode;
  language?: Language;
}

export const Code: FunctionComponent<CodeProps> = ({
  inline,
  children,
  language = "typescript",
}) => {
  if (inline) {
    return (
      <InlineCode
        bg="gray.50"
        border="1px solid"
        borderColor="gray.50"
        borderRadius="md"
        marginTop="md"
        mx={2}
        px={2}
        py={0}
      >
        {children}
      </InlineCode>
    );
  }

  const code = Children.toArray(children)
    .reduce((accum: string, child): string => {
      if (typeof child === "string") {
        return `${accum}${child}`;
      }
      return accum;
    }, "")
    .trim();

  return <BlockCode code={code} fontSize="0.9rem" language={language} />;
};
