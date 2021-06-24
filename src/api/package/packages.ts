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

export async function fetchPackages(): Promise<Packages> {
  const response = await fetch("/catalog.json");

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Failed fetching packages index: ${response.statusText}`);
  }

  return response.json();
}
