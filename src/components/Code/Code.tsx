import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, useClipboard } from "@chakra-ui/react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import nightOwlLight from "prism-react-renderer/themes/nightOwlLight";
import { ComponentPropsWithoutRef, FunctionComponent } from "react";

interface CodeProps {
  code: string;
  language: Language;
}

// Unfortunately not exported by prism-react-renderer
type RenderProps = Parameters<
  ComponentPropsWithoutRef<typeof Highlight>["children"]
>[0];

const btnThemes = {
  singleLine: {
    colorScheme: "blue",
    color: "blue.500",
    ml: 4,
  },
  multiLine: {
    color: "white",
    sx: {
      ":hover": {
        bg: "blue.400",
      },
    },
  },
};

const CopyButton: FunctionComponent<{
  value: string;
  isMultiLine?: boolean;
}> = ({ isMultiLine, value }) => {
  const { hasCopied, onCopy } = useClipboard(value);
  const theme = isMultiLine ? btnThemes.multiLine : btnThemes.singleLine;

  return (
    <IconButton
      aria-label="Copy Code"
      h={6}
      icon={hasCopied ? <CheckIcon color="green.200" /> : <CopyIcon />}
      minW="auto"
      onClick={onCopy}
      variant="ghost"
      w={6}
      {...theme}
    />
  );
};

const SingleLineRenderer: FunctionComponent<RenderProps & { code: string }> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <Flex align="center" justify="space-between" p={2}>
    {tokens.map((line, i) => (
      <div key={i} {...getLineProps({ line, key: i })}>
        {line.map((token, key) => (
          <span key={key} {...getTokenProps({ token, key })} />
        ))}
      </div>
    ))}
    <Box>
      <CopyButton value={code} />
    </Box>
  </Flex>
);

const MultiLineRenderer: FunctionComponent<RenderProps & { code: string }> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <>
    <Flex align="center" bg="blue.500" justify="flex-end" px={2} py={1}>
      <CopyButton isMultiLine value={code} />
    </Flex>
    <Box maxW="100%" overflowX="auto" p={2}>
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line, key: i })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token, key })} />
          ))}
        </div>
      ))}
    </Box>
  </>
);

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
