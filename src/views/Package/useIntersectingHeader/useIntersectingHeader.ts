import { useEffect, useMemo, useRef, useState } from "react";
import { getSectionIdSet } from ".";
import { DOCS_CONTAINER_ID } from "../constants";
import { useSectionItems } from "../useSectionItems";
import { getElementId } from "./util";

const intersectionObserverOptions: IntersectionObserverInit = {
  // Creates a margin for intersection boundary. For this margin, an entry will only be considered intersecting
  // if it is below the top 15% of the viewport, and above the bottom 15% of the viewport
  rootMargin: "-15% 0% -15% 0%",
};

const mutationObserverOptions: MutationObserverInit = {
  attributes: false,
  childList: true,
  subtree: true,
};

/**
 * A hook which implements the logic to track the currently scrolled header. The value will always be within the bounds
 * of the right nav items, meaning it should never return undefined unless there are no right nav items.
 */
export const useIntersectingHeader = () => {
  const sectionItems = useSectionItems();

  // Create a set of section ids for faster lookups
  // This set will be re-defined whenever the sectionItems change.
  // It is tracked via ref so that we do not need to create a new MutationObserver every time our sectionIds change (i.e on page changes)
  const sectionIdSet = useRef(getSectionIdSet(sectionItems));

  // State to track currently intersecting header, defaults to first item in sectionIdsSet
  const [intersectingHeader, setIntersectingHeader] = useState<
    string | undefined
  >([...sectionIdSet.current][0]);

  // IntersectionObserver instance, which handles updating the intersectingHeader state
  const intersectionObserver: IntersectionObserver = useMemo(() => {
    const intersectionObserverHandler: IntersectionObserverCallback = (
      entries
    ) => {
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

    return new IntersectionObserver(
      intersectionObserverHandler,
      intersectionObserverOptions
    );
  }, []);

  // When sectionItems updates, update the sectionIdSet ref and reset the intersectingHeader
  useEffect(() => {
    const newSectionIdSet = getSectionIdSet(sectionItems);
    sectionIdSet.current = newSectionIdSet;

    const [firstId] = newSectionIdSet;
    setIntersectingHeader(firstId);

    return () => {
      setIntersectingHeader(undefined);
    };
  }, [sectionItems]);

  // Initialize a mutationObserver, which is in charge of telling our intersectionObserver which elements to watch
  useEffect(() => {
    const docContainer = document.getElementById(DOCS_CONTAINER_ID);

    if (!docContainer) return;

    let sections: NodeListOf<Element>;

    const mutationCallback: MutationCallback = (records) => {
      // When mutations occur
      if (records.length) {
        // Stop observing old sections
        sections?.forEach((section) => {
          intersectionObserver.unobserve(section);
        });

        // Get new sections from dom
        sections = document.querySelectorAll("[data-heading-id]");

        // Begin observing new sections which belong to sectionIdSet
        sections.forEach((section) => {
          const sectionId = getElementId(section);

          if (sectionIdSet.current.has(sectionId)) {
            intersectionObserver.observe(section);
          }
        });
      }
    };

    const mutationObserver = new MutationObserver(mutationCallback);

    mutationObserver.observe(docContainer, mutationObserverOptions);

    return () => {
      mutationObserver.disconnect();
    };
  }, [intersectionObserver]);

  return intersectingHeader;
};
