import { Stack, Image, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CDKType } from "../../constants/constructs";
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
  [`official-${CDKType.cdktf}`]: {
    imgsrc: "/assets/construct.png",
    label: "Published by HashiCorp",
    color: "#ED3B00",
  },
  [`official-${CDKType.awscdk}`]: {
    imgsrc: "/assets/construct.png",
    label: "Published by AWS",
    color: "#ED3B00",
  },
  [`official-${CDKType.cdk8s}`]: {
    imgsrc: "/assets/construct.png",
    label: "Published by CDK8s Team",
    color: "#ED3B00",
  },
} as const;

const getHighlightRender = (
  cdkType: CDKType | undefined,
  isOfficial: boolean
) => {
  const key = !isOfficial
    ? "community"
    : cdkType
    ? `official-${cdkType}`
    : "official";
  return HIGHLIGHT_RENDER_MAP[key] ?? HIGHLIGHT_RENDER_MAP.official;
};

export const Highlight: FunctionComponent = () => {
  const { metadata } = usePackageCard();
  const cdkType = metadata.constructFramework?.name;
  const packageTags = metadata.packageTags ?? [];

  // const highlightType = isOfficial ? "official" : "community";
  const isOfficial = packageTags.some((t) => t.label === "Official");
  const { imgsrc, color, label } = getHighlightRender(cdkType, isOfficial);

  return (
    <Stack align="center" direction="row" spacing={2}>
      <Image alt={`${label} icon`} src={imgsrc} w={4} />
      <Text color={color} fontWeight="bold">
        {label}
      </Text>
    </Stack>
  );
};
