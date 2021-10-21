import packageCardIds from "components/PackageCard/testIds";
import searchBar from "components/SearchBar/testIds";
import searchRedesign from "views/SearchRedesign/testIds";
import { checkHeaderAndFooter } from "../support/helpers";

const checkCard = (cardType: string) => {
  cy.getByDataTest(cardType).within(() => {
    // TODO: Figure out how to assert visibility (cypress doesn't count these as visible due to link overlays)
    cy.getByDataTest(packageCardIds.title).should("exist");
    cy.getByDataTest(packageCardIds.description).should("exist");
    cy.getByDataTest(packageCardIds.published).should("exist");
    cy.getByDataTest(packageCardIds.author).should("exist");
    // This will be fixed by the search e2e PR
    // cy.getByDataTest(packageCardIds.version).should("exist");
    cy.getByDataTest(packageCardIds.languages).should("exist");
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

  it("has expected elements for Wide Cards", () => {
    checkCard(packageCardIds.wideContainer);
  });

  it("has search bar functionality", () => {
    cy.getByDataTest(searchRedesign.page).within(() => {
      cy.getByDataTest(searchBar.input)
        .type("@aws-cdk{enter}")
        .url()
        .should("include", `/search?q=${encodeURIComponent("@aws-cd")}`);
    });
  });
});
