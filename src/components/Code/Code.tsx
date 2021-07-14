import { Box } from "@chakra-ui/react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import nightOwlLight from "prism-react-renderer/themes/nightOwlLight";
import { FunctionComponent } from "react";
import { MultiLineRenderer } from "./MultiLineRenderer";
import { SingleLineRenderer } from "./SingleLineRenderer";

export interface CodeProps {
  code: string;
  language: Language;
}

export const Code: FunctionComponent<CodeProps> = ({ code, language }) => {
  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={nightOwlLight}
    >
      {(props) => (
        <Box
          as="pre"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          className={props.className}
          maxW="100%"
          overflow="hidden"
          style={props.style}
          w="min-content"
        >
          {props.tokens.length > 1 ? (
            <MultiLineRenderer {...props} code={code} />
          ) : (
            <SingleLineRenderer {...props} code={code} />
          )}
        </Box>
      )}
    </Highlight>
  );
};
