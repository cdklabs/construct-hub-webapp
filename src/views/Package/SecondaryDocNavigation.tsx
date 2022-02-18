import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { GetIsActiveItemFunction, NavTree } from "../../components/NavTree";
import { PACKAGE_ANALYTICS } from "./constants";
import { normalizeId, useIntersectingHeader } from "./useIntersectingHeader";
import { useSectionItems } from "./useSectionItems";

export const SecondaryDocNavigation: FunctionComponent = () => {
  const intersectingHeader = useIntersectingHeader();
  const sectionItems = useSectionItems();
  const { hash } = useLocation();

  // This ref is used to direct control over highlight state between
  // recentlyClickedItem and intersectingHeader
  const allowIntersectTakeover = useRef(false);

  // Tracks the link which was clicked, is set to undefined when the intersectingHeader state takes over
  const [recentlyClickedItem, setRecentlyClickedItem] = useState<
    string | undefined
  >(hash);

  // When a user clicks a link, we give control of highlights to the recentlyClickedItem state for 500ms
  // Afterwards, intersectingHeader state via intersection observer takes control of state
  useEffect(() => {
    setRecentlyClickedItem(hash);
    allowIntersectTakeover.current = false;

    setTimeout(() => {
      allowIntersectTakeover.current = true;
    }, 500);
  }, [hash]);

  // When intersectingHeader changes from scroll and allowIntersectTakeover is true,
  // we set the recentlyClickedItem state to undefined so link highlight state will be dictated
  // by the intersectingHeader state
  useEffect(() => {
    if (recentlyClickedItem && allowIntersectTakeover.current) {
      setRecentlyClickedItem(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectingHeader]);

  // If recentlyClickedItem is defined, use it to compare for highlight state
  // Otherwise compare item id against intersectingHeader
  const getIsLinkActive: GetIsActiveItemFunction = useCallback(
    ({ path, id }) => {
      if (recentlyClickedItem) {
        return new URL(path ?? "", window.origin).hash === recentlyClickedItem;
      }

      return normalizeId(id) === intersectingHeader;
    },
    [intersectingHeader, recentlyClickedItem]
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
