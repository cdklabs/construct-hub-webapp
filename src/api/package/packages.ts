import * as consts from "../../constants/paths";
import { Metadata } from "./metadata";

export interface Author {
  readonly name: string;
  readonly url: string;
}

export interface Packages {
  packages: {
    name: string;
    version: string;
    description: string;
    author: Author;
    keywords: string[];
    metadata: Metadata;
  }[];
}

export const fetchPackages = async (): Promise<Packages> => {
  const response = await fetch(consts.CATALOG_SUFFIX);

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Failed fetching packages index: ${response.statusText}`);
  }

  return response.json();
};
