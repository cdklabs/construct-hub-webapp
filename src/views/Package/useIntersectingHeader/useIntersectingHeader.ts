/**
 * This hook is used to determine the most recently visible doc header
 */
import { useEffect, useMemo, useState } from "react";
import { useSectionItems } from "../useSectionItems";
import { getElementId, getItemIds } from "./util";

const observerOptions = {
  // Creates a margin for intersection boundary. For this margin, an entry will only be considered intersecting
  // if it is below the top 15% of the viewport, and above the bottom 15% of the viewport
  rootMargin: "-15% 0% -15% 0%",
};

/**
 * A hook which implements the logic to track the currently scrolled header. The value will always be within the bounds
 * of the right nav items, meaning it should never return undefined unless there are no right nav items.
 */
export const useIntersectingHeader = () => {
  const sectionItems = useSectionItems();

  // Create a set of section ids for faster lookups
  // This set will be re-defined whenever the sectionItems change
  const sectionIdSet = useMemo(() => {
    const sectionIds = sectionItems.map(getItemIds).flat();

    return new Set(sectionIds);
  }, [sectionItems]);

  // State to track currently intersecting header, defaults to first item in sectionIdsSet
  const [intersectingHeader, setIntersectingHeader] = useState<
    string | undefined
  >([...sectionIdSet][0]);

  // When sectionIdsSet changes, set intersectingHeader to first item, and initialize an intersection observer to watch
  // for intersecting headers
  useEffect(() => {
    const [firstId] = sectionIdSet;
    setIntersectingHeader(firstId);

    // If no headers to observe, don't setup observer
    if (sectionIdSet.size < 1) return;

    // Only look for sections with in the section id set
    const sections = [...document.querySelectorAll("[data-heading-id]")].filter(
      (section) => sectionIdSet.has(getElementId(section))
    );

    if (!sections.length) return;

    const observerHandler: IntersectionObserverCallback = (entries) => {
      let entry: Element | undefined;

      entries.forEach((e) => {
        if (e.isIntersecting) {
          entry = e.target;
        }
      });

      if (entry) {
        setIntersectingHeader(getElementId(entry));
      }
    };

    const observer = new IntersectionObserver(observerHandler, observerOptions);

    sections.forEach((t) => {
      observer.observe(t);
    });

    return () => {
      setIntersectingHeader(undefined);
      observer.disconnect();
    };
  }, [sectionIdSet]);

  return intersectingHeader;
};
