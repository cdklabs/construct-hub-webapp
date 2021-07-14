export type ILink = {
  display: string;
  isNavLink?: boolean;
  url: string;
};

export interface IGroup {
  display: string;
  links: ILink[];
}

export type IMenuItems = (ILink | IGroup)[];
