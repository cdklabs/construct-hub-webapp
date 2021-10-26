import { Stack, Image, Text } from "@chakra-ui/react";
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
  return (
    <Stack align="center" direction="row" spacing={2}>
      <Image alt={`${label} icon`} src={icon} w={4} />
      <Text color={color} fontWeight="bold">
        {label}
      </Text>
    </Stack>
  );
};
