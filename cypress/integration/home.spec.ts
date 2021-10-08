import { checkHeaderAndFooter } from "../support/helpers";
import searchBar from "components/SearchBar/testIds";
import homeRedesign from "views/HomeRedesign/testIds";

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

describe("Home (Redesign / WIP)", () => {
  beforeEach(() => {
    cy.visitWithConfig("/", {
      featureFlags: {
        homeRedesign: true,
      },
    });
  });

  it("has search capabilities from home page", () => {
    cy.getByDataTest(homeRedesign.page).within(() => {
      cy.getByDataTest(searchBar.input)
        .should("be.visible")
        .type("@aws-cdk", { force: true });
      cy.getByDataTest(searchBar.overlay).should("be.visible");
      cy.getByDataTest(searchBar.suggestionsList).should("be.visible");
      cy.getByDataTest(searchBar.suggestion).should("have.length", 5);
      cy.getByDataTest(searchBar.input)
        .type("{enter}")
        .url()
        .should("include", "/search");
    });
  });
});
