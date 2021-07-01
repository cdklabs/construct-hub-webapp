import { CheckIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Code,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode, useRef } from "react";
import { createTestIds } from "../../util/createTestIds";

const iconButtonProps = {
  borderRadius: "md",
  color: "white",
  variant: "link",
};

const iconProps = {
  h: 4,
  w: 4,
};

export const testIds = createTestIds("code-popover", [
  "close",
  "content",
  "code",
  "copy",
  "header",
  "trigger",
] as const);

export interface CodePopoverProps {
  code: string;
  header: string;
  trigger: ReactNode;
}

export const CodePopover: FunctionComponent<CodePopoverProps> = ({
  code,
  header,
  trigger,
}) => {
  const { hasCopied, onCopy } = useClipboard(code);
  const disclosure = useDisclosure();
  const focusRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover
      initialFocusRef={focusRef}
      isLazy
      placement="bottom-end"
      {...disclosure}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent bg="blue.500" data-testid={testIds.content}>
        <PopoverHeader
          align="center"
          as={Flex}
          color="white"
          data-testid={testIds.header}
          justify="space-between"
          pr={0}
        >
          <Text>{header}</Text>
          <Flex align="center">
            <IconButton
              aria-label="copy-text-icon"
              data-testid={testIds.copy}
              icon={
                hasCopied ? (
                  <CheckIcon {...iconProps} color="green.200" />
                ) : (
                  <CopyIcon {...iconProps} />
                )
              }
              onClick={onCopy}
              ref={focusRef}
              {...iconButtonProps}
            />
            <IconButton
              aria-label="close-icon"
              data-testid={testIds.close}
              icon={<CloseIcon h={3} w={3} />}
              onClick={disclosure.onClose}
              {...iconButtonProps}
            />
          </Flex>
        </PopoverHeader>
        <PopoverBody
          as={Code}
          bg="gray.100"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
          color="gray.800"
          data-testid={testIds.code}
          overflow="auto"
          variant="code-block"
        >
          {code}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
