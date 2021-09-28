import packageCardIds from "components/PackageCard/testIds";
import cardViewIds from "contexts/CardView/testIds";
import { checkHeaderAndFooter } from "../support/helpers";

const checkCard = (cardType: string) => {
  cy.getByDataTest(cardType).within(() => {
    // TODO: Figure out how to assert visibility (cypress doesn't count these as visible due to link overlays)
    cy.getByDataTest(packageCardIds.title).should("exist");
    cy.getByDataTest(packageCardIds.description).should("exist");
    cy.getByDataTest(packageCardIds.published).should("exist");
    cy.getByDataTest(packageCardIds.author).should("exist");
    cy.getByDataTest(packageCardIds.version).should("exist");
    cy.getByDataTest(packageCardIds.languages).should("exist");
  });
};

describe("Search", () => {
  before(() => {
    cy.visit("/search");
  });

  checkHeaderAndFooter();
});

describe.skip("Search (Redesign / WIP)", () => {
  before(() => {
    cy.visitWithConfig("/search", {
      featureFlags: {
        searchRedesign: true,
      },
    });
  });

  it("has card view controls which change view when clicked", () => {
    cy.getByDataTest(cardViewIds.controls).should("be.visible");

    cy.getByDataTest(cardViewIds.gridView).click({ force: true });
    cy.getByDataTest(packageCardIds.compactContainer).should("be.visible");

    cy.getByDataTest(cardViewIds.controls).scrollIntoView();
    cy.getByDataTest(cardViewIds.listView).click({ force: true });
    cy.getByDataTest(packageCardIds.wideContainer).should("be.visible");
  });

  it("has expected elements for Wide Cards", () => {
    cy.getByDataTest(cardViewIds.controls).scrollIntoView();
    cy.getByDataTest(cardViewIds.listView).click({ force: true });
    checkCard(packageCardIds.wideContainer);
  });

  it("has expected elements for Compact Cards", () => {
    cy.getByDataTest(cardViewIds.controls).scrollIntoView();
    cy.getByDataTest(cardViewIds.gridView).click({ force: true });
    checkCard(packageCardIds.compactContainer);
  });
});
