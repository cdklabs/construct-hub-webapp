import { checkHeaderAndFooter } from "../support/helpers";

describe("Home Page", () => {
  describe("Renders expected content", () => {
    before(() => {
      cy.visit("/");
    });

    checkHeaderAndFooter();

    it("has hero section headings", () => {
      cy.getByDataTest("home-headings")
        .should("be.visible")
        .children()
        .should("have.length", 3);
    });

    it("has search inputs", cy.checkCatalogSearchInputs);

    it("displays 20 packages", () => {
      cy.checkResultCount(20);
    });

    it("has page controls", () => {
      cy.getByDataTest("home-nextPageBtn")
        .scrollIntoView()
        .should("be.visible");
      cy.getByDataTest("home-prevIcon").should("be.visible");
      cy.getByDataTest("home-nextIcon").should("be.visible");
    });
  });
});
