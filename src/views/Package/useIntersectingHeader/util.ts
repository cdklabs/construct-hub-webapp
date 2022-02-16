import { MenuItem } from "../util";

export const normalizeId = (id: string) => id.replace("#", "").toLowerCase();

export const getItemIds = (item: MenuItem) => {
  const ids = [normalizeId(item.id)];

  item.children?.forEach((child) => {
    if (child?.id) {
      ids.push(...getItemIds(child));
    }
  });

  return ids;
};

export const getElementId = (el: Element): string =>
  normalizeId(el.getAttribute("data-heading-id") as string);

export const getSectionIdSet = (items: MenuItem[]): Set<string> =>
  new Set(items.map(getItemIds).flat());
