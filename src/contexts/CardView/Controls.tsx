import { Flex, IconButton, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageCardType } from "../../components/PackageCard";
import { GridIcon } from "../../icons/GridIcon";
import { ListIcon } from "../../icons/ListIcon";

const viewIcons = [
  {
    viewType: PackageCardType.Compact,
    icon: GridIcon,
    name: "Grid View",
  },
  {
    viewType: PackageCardType.Wide,
    icon: ListIcon,
    name: "List View",
  },
];

export interface ControlsProps {
  currentCardView?: PackageCardType;
  setCardView?: (v: PackageCardType) => void;
}

export const Controls: FunctionComponent<ControlsProps> = ({
  currentCardView,
  setCardView,
}) => {
  return (
    <Flex align="center">
      <Text mr={2}>View as</Text>
      {viewIcons.map(({ name, icon: Icon, viewType }) => {
        return (
          <IconButton
            aria-label={`${
              currentCardView === viewType ? "Show" : "Showing"
            } ${name}`}
            icon={
              <Icon
                fill={currentCardView === viewType ? "blue.500" : "black"}
                height={5}
                width={5}
              />
            }
            key={name}
            onClick={() => setCardView?.(viewType)}
            p={0}
            variant="ghost"
          />
        );
      })}
    </Flex>
  );
};
