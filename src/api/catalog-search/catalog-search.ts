import lunr from "lunr";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { PackageStats } from "../stats";
import { CatalogSearchSort } from "./constants";
import { FILTER_FUNCTIONS, SORT_FUNCTIONS } from "./util";

export interface ExtendedCatalogPackage extends CatalogPackage {
  id: string;
  downloads: number;

  scope?: string;
  packageName?: string;
  authorName?: string;
  authorEmail?: string;
}

export interface CatalogConstructFrameworks {
  [CDKType.awscdk]: CatalogConstructFrameworkMeta;
  [CDKType.cdktf]: CatalogConstructFrameworkMeta;
  [CDKType.cdk8s]: CatalogConstructFrameworkMeta;
}
export interface CatalogConstructFrameworkMeta {
  pkgCount: number;
  majorVersions: number[];
}

export interface CatalogSearchFilters {
  /**
   * The CDK Output Type to filter by. This functionality is not yet deployed on any BE so the implementation on the client is not final.
   */
  cdkType?: CDKType;
  /**
   * The CDK Type's major version to filter by. This param is ignored if no major is set
   */
  cdkMajor?: number;
  /**
   * A list of languages to filter by. Constructs that are not yet filtered out, will be
   * returned if they support any of the languages in this list.
   */
  languages?: Language[];
  /**
   * A list of tags to filter by.
   */
  tags?: string[];
}

export type CatalogSearchResults = Map<string, ExtendedCatalogPackage>;

export interface CatalogSearchParams {
  query?: string;
  filters?: CatalogSearchFilters;
  sort?: CatalogSearchSort;
}

export class CatalogSearchAPI {
  private readonly map: CatalogSearchResults;
  private index: lunr.Index;
  /**
   * A map of detected Construct Frameworks which provides a count of libraries for that framework and a set of major versions detected
   */
  public readonly constructFrameworks: CatalogConstructFrameworks;

  constructor(catalogData: CatalogPackage[], stats: PackageStats) {
    const catalogMap = catalogData
      // Packages with the "construct-hub/hide-from-search" keyword are shadow-banned from search results
      .filter(
        (pkg) => !pkg.keywords?.includes("construct-hub/hide-from-search")
      )
      .reduce((map, pkg) => {
        const { name, version } = pkg;
        const id = [name, version].join("@");

        const downloads = stats.packages[name]?.downloads?.npm ?? 0;

        map.set(id, {
          ...pkg,
          downloads,
          id,
        });

        return map;
      }, new Map<string, ExtendedCatalogPackage>());

    this.map = this.sort(catalogMap, CatalogSearchSort.PublishDateDesc);

    this.constructFrameworks = this.detectConstructFrameworks();

    this.index = lunr(function () {
      this.ref("id");
      this.field("name");
      this.field("scope");
      this.field("packageName");
      this.field("description");
      this.field("authorName");
      this.field("authorEmail");

      [...catalogMap.values()].forEach((pkg) => {
        const { author, name } = pkg;

        const [scope, packageName] = name.split("/");

        if (scope && packageName) {
          pkg.scope = scope;
          pkg.packageName = packageName;
        }

        if (typeof author === "string") {
          pkg.authorName = author;
        } else {
          if (author?.name) {
            pkg.authorName = author.name;
          }

          if (author?.email) {
            pkg.authorEmail = author.email;
          }
        }

        this.add(pkg);
      });
    });
  }

  /**
   * Performs a Search against the catalog and returns a Map with results ordered
   * by search score / relevance
   */
  public search(params?: {
    query?: string;
    filters?: CatalogSearchFilters;
    sort?: CatalogSearchSort;
  }): CatalogSearchResults {
    const { query, filters, sort } = params ?? {};

    let results = query ? this.query(query) : new Map(this.map);

    if (filters) {
      results = this.filter(results, filters);
    }

    if (sort) {
      results = this.sort(results, sort);
    }

    return results;
  }

  /**
   * This calls the index search method and returns a map of results ordered by relevance.
   */
  private query(query: string): CatalogSearchResults {
    let refs: lunr.Index.Result[] = [];

    try {
      refs = this.index.search(query);
    } catch (e) {
      console.error(e);
    }

    return refs.reduce((packages, { ref }) => {
      const pkg = this.map.get(ref);

      if (pkg) {
        packages.set(ref, pkg);
      }

      return packages;
    }, new Map() as CatalogSearchResults);
  }

  /**
   * Filters query results. Mutates the passed-in map
   */
  private filter(
    results: CatalogSearchResults,
    filters: CatalogSearchFilters
  ): CatalogSearchResults {
    const { cdkType, cdkMajor, languages, tags } = filters;
    const copiedResults = new Map(results);

    const filterFunctions = [
      FILTER_FUNCTIONS.cdkType(cdkType),
      // Ignore major version filter if no CDK Type is defined
      FILTER_FUNCTIONS.cdkMajor(cdkType ? cdkMajor : undefined),
      FILTER_FUNCTIONS.languages(languages),
      FILTER_FUNCTIONS.tags(tags),
    ].filter(Boolean) as ((pkg: ExtendedCatalogPackage) => boolean)[];

    copiedResults.forEach((result) => {
      let isFiltered = false;

      filterFunctions.forEach((filterFn) => {
        if (!isFiltered && !filterFn(result)) {
          isFiltered = true;
        }
      });

      if (isFiltered) {
        copiedResults.delete(result.id);
      }
    });

    return copiedResults;
  }

  /**
   * Sort filtered results
   */
  private sort(
    results: CatalogSearchResults,
    strategy: CatalogSearchSort
  ): CatalogSearchResults {
    if (strategy) {
      return new Map(
        [...results.entries()].sort(([, p1], [, p2]) =>
          SORT_FUNCTIONS[strategy](p1, p2)
        )
      );
    } else {
      return results;
    }
  }

  /**
   * Creates an object of found construct frameworks in the catalog map.
   * They are indexed by the name of the construct framework and record the count
   * of packages for that framework as well as a list of major versions.
   */
  private detectConstructFrameworks() {
    const results: CatalogConstructFrameworks = [...this.map.values()].reduce(
      (frameworks: CatalogConstructFrameworks, pkg: ExtendedCatalogPackage) => {
        const { metadata } = pkg;

        const frameworkName = metadata?.constructFramework?.name;
        const majorVersion = metadata?.constructFramework?.majorVersion;

        if (frameworkName) {
          const entry = frameworks[frameworkName];

          if (
            majorVersion !== undefined &&
            !entry.majorVersions.includes(majorVersion)
          ) {
            entry.majorVersions.push(majorVersion);
          }

          entry.pkgCount += 1;
        }

        return frameworks;
      },
      {
        [CDKType.awscdk]: {
          majorVersions: [],
          pkgCount: 0,
        },
        [CDKType.cdk8s]: {
          majorVersions: [],
          pkgCount: 0,
        },
        [CDKType.cdktf]: {
          majorVersions: [],
          pkgCount: 0,
        },
      }
    );

    return results;
  }
}
