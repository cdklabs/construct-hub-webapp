export interface NavItemConfig {
  "data-event"?: string;
  /**
   * NavItems to be shown as a descendant of this NavItem
   */
  children: NavItemConfig[];
  /**
   * A unique identifier for the navItem
   */
  id: string;
  /**
   * The text to be displayed for the navItem
   */
  title: string;
  /**
   * An optional path for the navItem, allowing it to behave as a link
   */
  path?: string;
}

export type GetIsActiveItemFunction = (
  item: Omit<NavItemConfig, "data-event">
) => boolean;
