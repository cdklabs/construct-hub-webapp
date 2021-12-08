import packageCardIds from "components/PackageCard/testIds";
import searchBar from "components/SearchBar/testIds";
import searchRedesign from "views/Search/testIds";
import { checkHeaderAndFooter } from "../support/helpers";
import { getSearchPath } from "util/url";
import { CatalogSearchSort } from "api/catalog-search/constants";
import { CDKType } from "constants/constructs";
import { SORT_RENDER_MAP } from "views/Search/constants";
import { Language, TEMP_SUPPORTED_LANGUAGES } from "constants/languages";

const checkCard = (cardType: string) => {
  cy.getByDataTest(cardType).within(() => {
    cy.getByDataTest(packageCardIds.title).should("be.visible");
    cy.getByDataTest(packageCardIds.description).should("be.visible");
    cy.getByDataTest(packageCardIds.published).should("be.visible");
    cy.getByDataTest(packageCardIds.author).should("be.visible");
    cy.getByDataTest([packageCardIds.downloads, packageCardIds.version]).should(
      "be.visible"
    );
    cy.getByDataTest(packageCardIds.languages).should("be.visible");
  });
};

describe("Search", () => {
  before(() => {
    cy.visit("/search");
  });

  checkHeaderAndFooter();
});

describe("Search (Redesign / WIP)", () => {
  before(() => {
    cy.visitWithConfig("/search", {
      featureFlags: {
        searchRedesign: true,
      },
    });
  });

  describe("Results Area", () => {
    it("has expected elements for Wide Cards", () => {
      checkCard(packageCardIds.wideContainer);
    });

    it("can go to next page", () => {
      cy.getByDataTest(searchRedesign.nextPage)
        .click()
        .url()
        .should("contain", getSearchPath({ query: "", offset: 1 }));
    });

    it("can go to previous page", () => {
      cy.visitWithConfig(getSearchPath({ offset: 3 }), {
        featureFlags: { searchRedesign: true },
      });

      cy.getByDataTest(searchRedesign.prevPage)
        .click()
        .url()
        .should("contain", getSearchPath({ query: "", offset: 2 }));
    });

    it("can jump to a page", () => {
      cy.visitWithConfig("/search", {
        featureFlags: { searchRedesign: true },
      });

      cy.getByDataTest(searchRedesign.goToPage)
        .clear()
        .type("5{enter}")
        .url()
        .should("contain", getSearchPath({ query: "", offset: 4 }));
    });
  });

  describe("Filters Panel", () => {
    beforeEach(() => {
      cy.visitWithConfig("/search", {
        featureFlags: {
          searchRedesign: true,
        },
      });
    });

    const filterByCDKType = (cdkType: CDKType) => {
      cy.getByDataTest(searchRedesign.cdkTypeFilter)
        .find(`[data-value="${cdkType}"]`)
        .click();

      cy.url().should("contain", getSearchPath({ query: "", cdkType }));
    };

    const filterByCDKMajors = (cdkType: CDKType, versions: number[]) => {
      filterByCDKType(cdkType);

      versions.forEach((cdkMajor) => {
        cy.getByDataTest(searchRedesign.cdkVersionFilter)
          .find(`[data-value="${cdkMajor}"]`)
          .click()
          .url()
          .should("contain", getSearchPath({ query: "", cdkType, cdkMajor }));
      });
    };

    it("has expected core filters", () => {
      cy.getByDataTest(searchRedesign.filtersPanel)
        .should("be.visible")
        .within(() => {
          [
            searchRedesign.cdkTypeFilter,
            searchRedesign.languagesFilter,
          ].forEach((testid) => {
            cy.getByDataTest(testid).should("be.visible");
          });
        });
    });

    // If this test fails, it may be an indication of data failure in catalog.json
    it("can filter by CDK Type", () => {
      cy.getByDataTest(searchRedesign.filtersPanel).within(() => {
        [CDKType.awscdk, CDKType.cdk8s, CDKType.cdktf].forEach(filterByCDKType);
      });
    });

    // Only applies to CDKTypes with more than one version
    it("can filter by CDK Version for each CDK Type", () => {
      cy.getByDataTest(searchRedesign.filtersPanel).within(() => {
        filterByCDKMajors(CDKType.awscdk, [0, 1, 2]);
        filterByCDKMajors(CDKType.cdk8s, [0, 1]);
      });
    });

    it("can filter by languages", () => {
      cy.getByDataTest(searchRedesign.languagesFilter).within(() => {
        const languages = [];

        cy.getByDataTest(searchRedesign.filterItem).each((el) => {
          const lang = el.attr("data-value");

          if (!TEMP_SUPPORTED_LANGUAGES.has(lang as Language)) return;

          languages.push(lang);

          cy.wrap(el)
            .click()
            .url()
            .should("contain", getSearchPath({ query: "", languages }));
        });

        // Now deselect each language
        cy.getByDataTest(searchRedesign.filterItem).each((el) => {
          const lang = el.attr("data-value");

          if (!TEMP_SUPPORTED_LANGUAGES.has(lang as Language)) return;

          languages.shift();

          cy.wrap(el)
            .click()
            .url()
            .should("contain", getSearchPath({ query: "", languages }));
        });
      });
    });
  });

  describe("Sorting", () => {
    it("supports re-ordering of results", () => {
      const sorts = [undefined, ...Object.values(CatalogSearchSort)];

      sorts.forEach((sort) => {
        cy.getByDataTest(searchRedesign.sortButton)
          .click()
          .getByDataTest(searchRedesign.sortDropdown)
          .should("be.visible")
          .within(() => {
            // Not ideal, but for some reason .click() doesn't actually trigger the onClick for the buttons in cypress
            if (sort === undefined) {
              cy.getByDataTest(searchRedesign.sortItem).first().invoke("click");
            } else {
              cy.get(`[data-value="${sort}"]`).invoke("click");
            }
          });

        cy.url().should(
          "contain",
          sort ? getSearchPath({ query: "", sort }) : "/search"
        );

        cy.getByDataTest(searchRedesign.sortButton).should(
          "contain",
          sort ? SORT_RENDER_MAP[sort] : "Relevance"
        );
      });
    });
  });

  describe("Querying", () => {
    it("supports searching by a query", () => {
      cy.getByDataTest(searchRedesign.page).within(() => {
        cy.getByDataTest(searchBar.input)
          .type("@aws-cdk{enter}")
          .url()
          .should("include", `/search?q=${encodeURIComponent("@aws-cdk")}`);

        cy.getByDataTest(searchRedesign.searchDetails).should(
          "contain",
          "@aws-cdk"
        );
      });
    });
  });
});
