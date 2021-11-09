import { Box, BoxProps } from "@chakra-ui/react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import nightOwlLight from "prism-react-renderer/themes/nightOwlLight";
import { FunctionComponent } from "react";
import { MultiLineRenderer } from "./MultiLineRenderer";
import { SingleLineRenderer } from "./SingleLineRenderer";

export interface CodeProps extends BoxProps {
  code: string;
  language: Language;
}

export const Code: FunctionComponent<CodeProps> = ({
  code,
  language,
  ...boxProps
}) => {
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
          borderRadius="md"
          boxShadow="base"
          className={props.className}
          marginX="0.5em"
          style={props.style}
          {...boxProps}
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
