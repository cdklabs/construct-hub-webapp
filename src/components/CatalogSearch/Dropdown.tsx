import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export interface DropdownProps<T = Record<string, string>> {
  testIds: {
    item: string;
    menu: string;
    trigger: string;
    value: string;
  };
  placeholder: string;
  selected?: T[keyof T];
  onSelect: (val?: keyof T) => void;
  items: T;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  placeholder,
  items,
  onSelect,
  selected,
  testIds,
}) => {
  const text = selected ? items[selected] : placeholder;
  const options = Object.entries(items);

  return (
    <Menu strategy="fixed">
      <MenuButton
        as={Button}
        bg="white"
        borderColor="blue.100"
        boxShadow="base"
        data-testid={testIds.trigger}
        rightIcon={<ChevronDownIcon color="blue.500" />}
        variant="outline"
      >
        <Text data-testid={testIds.value}>{text}</Text>
      </MenuButton>
      <MenuList data-testid={testIds.menu}>
        <MenuItem data-testid={testIds.item} onClick={() => onSelect()}>
          Any
        </MenuItem>
        {options.map(([name, displayName]) => (
          <MenuItem
            data-testid={testIds.item}
            key={name}
            onClick={() => onSelect(name)}
          >
            {displayName}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
