import { Stack, Image, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { OFFICIAL_SCOPES } from "../../constants/constructs";
import { usePackageCard } from "./PackageCard";

const HIGHLIGHT_RENDER_MAP = {
  official: {
    imgsrc: "/assets/construct.png",
    label: "Official",
    color: "#ED3B00",
  },
  community: {
    imgsrc: "/assets/community.png",
    label: "Community",
    color: "#2F50FE",
  },
  highQuality: {
    imgsrc: "/assets/medal.png",
    label: "High Quality",
    color: "#1F02D4",
  },
} as const;

// TODO: We will need a similar solution to tags for determining High Quality, and likely Official
export const Highlight: FunctionComponent = () => {
  const { name } = usePackageCard();

  const isOfficial = OFFICIAL_SCOPES.some((scope) => name.includes(scope));
  const highlightType = isOfficial ? "official" : "community";
  const { imgsrc, color, label } = HIGHLIGHT_RENDER_MAP[highlightType];

  return (
    <Stack align="center" direction="row" spacing={2}>
      <Image alt={`${label} icon`} src={imgsrc} w={4} />
      <Text color={color} fontWeight="bold">
        {label}
      </Text>
    </Stack>
  );
};
