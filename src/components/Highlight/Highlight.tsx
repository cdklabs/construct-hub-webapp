import { Stack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

interface HighlightProps {
  label: string;
  color?: string;
  icon?: string;
}

export const Highlight: FunctionComponent<HighlightProps> = ({
  label,
  color,
  icon,
}: HighlightProps) => {
  const brightness = useColorModeValue("none", "brightness(1.75)");
  return (
    <Stack align="center" direction="row" filter={brightness} spacing={2}>
      <Image alt={`${label} icon`} src={icon} w={4} />
      <Text color={color} fontWeight="bold">
        {label}
      </Text>
    </Stack>
  );
};
