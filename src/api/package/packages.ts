export interface Packages {
  packages: {
    name: string;
    version: string;
    metadata: {
      name: string;
      description: string;
      scope: string;
      version: string;
      keywords: string[];
      date: string;
      links: {
        npm: string;
        homepage: string;
        repository: string;
        bugs: string;
      };
      author: {
        name: string;
        url: string;
      };
      publisher: {
        username: string;
        email: string;
      };
      mantainers: {
        username: string;
        email: string;
      }[];
    };
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
