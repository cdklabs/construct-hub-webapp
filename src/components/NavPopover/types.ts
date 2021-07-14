export type NavPopoverLink = {
  display: string;
  isNavLink?: boolean;
  url: string;
};

export interface IGroup {
  display: string;
  links: NavPopoverLink[];
}

export type NavPopoverItems = (NavPopoverLink | IGroup)[];
