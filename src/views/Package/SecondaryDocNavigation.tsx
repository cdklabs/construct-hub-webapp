import { FunctionComponent, useCallback } from "react";
import { GetIsActiveItemFunction, NavTree } from "../../components/NavTree";
import { PACKAGE_ANALYTICS } from "./constants";
import { normalizeId, useIntersectingHeader } from "./useIntersectingHeader";
import { useSectionItems } from "./useSectionItems";

export const SecondaryDocNavigation: FunctionComponent = () => {
  const intersectingHeader = useIntersectingHeader();
  const sectionItems = useSectionItems();

  const getIsLinkActive: GetIsActiveItemFunction = useCallback(
    ({ id }) => normalizeId(id) === intersectingHeader,
    [intersectingHeader]
  );

  return (
    <NavTree
      data-event={PACKAGE_ANALYTICS.SCOPE}
      getIsActiveItem={getIsLinkActive}
      items={sectionItems}
      variant="sm"
    />
  );
};
