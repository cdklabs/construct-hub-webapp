import lunr from "lunr";
import { CDKType } from "../../constants/constructs";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { PackageStats } from "../stats";
import { CatalogSearchSort } from "./constants";
import { FILTER_FUNCTIONS, SORT_FUNCTIONS } from "./util";

const INDEX_FIELDS = {
  AUTHOR_EMAIL: {
    name: "authorEmail",
    boost: 1,
  },
  AUTHOR_NAME: {
    name: "authorName",
    boost: 3,
  },
  DESCRIPTION: {
    name: "description",
    boost: 2,
  },
  KEYWORDS: {
    name: "keywords",
    boost: 2,
  },
  NAME: {
    name: "name",
    boost: 5,
  },
  PACKAGE_NAME: {
    name: "packageName",
    boost: 5,
  },
  SCOPE: {
    name: "scope",
    boost: 5,
  },
  TAG_NAMES: {
    name: "tagNames",
    boost: 2,
  },
} as const;

export interface ExtendedCatalogPackage extends CatalogPackage {
  authorEmail?: string;
  authorName?: string;
  downloads: number;
  id: string;
  packageName?: string;
  tagNames: string[];
  scope?: string;
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
   * A list of keywords to filter by.
   */
  keywords?: string[];
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
  exactQuery?: boolean;
}

export class CatalogSearchAPI {
  private readonly map: CatalogSearchResults;
  private index: lunr.Index;
  /**
   * A map of detected keywords with a key representing the keyword, and a value representing the amount of occurences
   * the keyword has in the catalog.
   */
  public readonly keywords: Map<string, number>;
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
        const { author, name, version } = pkg;
        const id = [name, version].join("@");
        const downloads = stats.packages[name]?.downloads?.npm ?? 0;
        let [scope, packageName] = name.split("/");

        if (!packageName) {
          packageName = scope;
        }

        let authorName: string | undefined;
        let authorEmail: string | undefined;

        if (typeof author === "string") {
          authorName = author;
        } else {
          if (author?.name) {
            authorName = author.name;
          }

          if (author?.email) {
            authorEmail = author.email;
          }
        }
        map.set(id, {
          ...pkg,
          authorName,
          authorEmail,
          keywords: pkg.keywords?.filter(
            (keyword) => !KEYWORD_IGNORE_LIST.has(keyword)
          ),
          downloads,
          id,
          packageName,
          scope,
          tagNames: (pkg.metadata.packageTags ?? []).map((t) => t.id),
        });

        return map;
      }, new Map<string, ExtendedCatalogPackage>());

    this.map = this.sort(catalogMap, CatalogSearchSort.PublishDateDesc);

    this.constructFrameworks = this.detectConstructFrameworks();
    this.keywords = this.detectKeywords();

    this.index = lunr(function () {
      this.tokenizer.separator = /[\s\-/@]+/;
      this.ref("id");

      for (const key in INDEX_FIELDS) {
        const field = INDEX_FIELDS[key as keyof typeof INDEX_FIELDS];
        this.field(field.name, { boost: field.boost });
      }

      [...catalogMap.values()].forEach((pkg) => {
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
    exactQuery?: boolean;
  }): CatalogSearchResults {
    const { query, filters, sort, exactQuery } = params ?? {};

    let results = query ? this.query(query, exactQuery) : new Map(this.map);

    // TODO: Investigate if we can leverage lunr for filtering
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
  private query(query: string, exact?: boolean): CatalogSearchResults {
    let refs: lunr.Index.Result[] = [];

    try {
      let tokenizedQuery = lunr.tokenizer(query);

      if (tokenizedQuery.length > 1) {
        // A large number of libraries include the term cdk within the title - which will lead to an
        // inflated result count. TODO: determine if there are other terms to filter out
        tokenizedQuery = tokenizedQuery.filter(
          (token) => token.toString() !== "cdk"
        );
      }

      refs = this.index.query((q) => {
        q.term(tokenizedQuery, {});
      });
    } catch (e) {
      console.error(e);
    }

    return refs.reduce((packages, { ref }) => {
      const pkg = this.map.get(ref);

      if (exact === true && pkg?.name !== query) {
        return packages;
      }

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
    const { cdkType, cdkMajor, keywords, languages, tags } = filters;
    const copiedResults = new Map(results);

    const filterFunctions = [
      FILTER_FUNCTIONS.cdkType(cdkType),
      // Ignore major version filter if no CDK Type is defined
      FILTER_FUNCTIONS.cdkMajor(cdkType ? cdkMajor : undefined),
      FILTER_FUNCTIONS.keywords(keywords),
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
   * Creates a map of keywords with values representing the occurence of the keyword within the catalog.
   */
  private detectKeywords() {
    const results = [...this.map.values()].reduce(
      (keywords: Map<string, number>, pkg: ExtendedCatalogPackage) => {
        pkg.keywords?.forEach((keyword) => {
          if (!KEYWORD_IGNORE_LIST.has(keyword)) {
            const entry = keywords.get(keyword);
            keywords.set(keyword, (entry ?? 0) + 1);
          }
        });

        return keywords;
      },
      new Map<string, number>()
    );

    return results;
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
