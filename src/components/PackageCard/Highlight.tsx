import { Box } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { usePackageCard } from "./PackageCard";
import { highlightsFrom } from "../../util/package";
import { Highlight as HighlightComponent } from "../Highlight";

export const Highlight: FunctionComponent = () => {
  const { packageTags = [] } = usePackageCard()?.metadata ?? {};
  const [highlight] = highlightsFrom(packageTags);

  if (!highlight) return null;

  return (
    <Box fontSize="xs">
      <HighlightComponent {...highlight} />
    </Box>
  );
};
