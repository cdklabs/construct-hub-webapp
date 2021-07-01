import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const DisabledLangPopover: FunctionComponent = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Disabled language popover"
          icon={<QuestionOutlineIcon />}
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Why are some languages disabled?</PopoverHeader>
        <PopoverBody>
          This construct has not yet implemented libraries for all available
          languages.
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
