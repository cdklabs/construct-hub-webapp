import lunr from "lunr";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { CatalogSearchSort } from "./constants";
import { SORT_FUNCTIONS } from "./util";

export interface CatalogPackageWithId extends CatalogPackage {
  id: string;
}

export interface CatalogSearchFilters {
  language?: Language;
}

export type CatalogSearchResults = Map<string, CatalogPackageWithId>;

export class CatalogSearchAPI {
  public readonly map: CatalogSearchResults;
  private index: lunr.Index;
  /**
   * Contains the map of the most recent search(). If search() hasn't been called
   * or was called with empty parameters, it returns the complete data set.
   */

  constructor(catalogData: CatalogPackage[]) {
    const catalogMap = catalogData.reduce((map, pkg) => {
      const { name, version } = pkg;
      const id = [name, version].join("@");

      map.set(id, {
        ...pkg,
        id,
      });

      return map;
    }, new Map());

    this.map = this.sort(catalogMap, CatalogSearchSort.PublishDateDesc);

    this.index = lunr(function () {
      this.ref("id");
      this.field("name");
      this.field("description");
      this.field("readme");
      this.field("authorName");
      this.field("authorEmail");

      [...catalogMap.values()].forEach((pkg) => {
        const { author } = pkg;

        if (typeof author === "string") {
          pkg.authorName = author;
        }

        if (author?.name) {
          pkg.authorName = author.name;
        }

        if (author?.email) {
          pkg.authorEmail = author.email;
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
   * Filters query results
   */
  private filter(
    results: CatalogSearchResults,
    filters: CatalogSearchFilters
  ): CatalogSearchResults {
    const { language } = filters;
    const copiedResults = new Map(results);

    copiedResults.forEach((result) => {
      if (language && language !== Language.TypeScript) {
        if (result.languages[language] === undefined) {
          copiedResults.delete(result.id);
          return;
        }
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
}
