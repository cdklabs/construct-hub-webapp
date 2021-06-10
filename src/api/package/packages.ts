import { Metadata } from "./metadata";

export interface Packages {
  packages: {
    name: string;
    version: string;
    metadata: Metadata;
  }[];
}

export async function fetchPackages(): Promise<Packages> {
  const response = await fetch("/index/packages.json");

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Failed fetching packages index: ${response.statusText}`);
  }

  return response.json();
}
