import headerTestIds from "components/Header/testIds";
import searchModalTestIds from "components/SearchModal/testIds";
import searchBar from "components/SearchBar/testIds";

const checkBaseElements = () => {
  cy.getByDataTest(headerTestIds.title).should("be.visible");
  cy.getByDataTest(headerTestIds.gettingStartedTrigger).should("be.visible");
  cy.getByDataTest(headerTestIds.resourcesTrigger).should("be.visible");
};

const checkMenuInteractions = () => {
  cy.getByDataTest(headerTestIds.gettingStartedTrigger)
    .should("be.visible")
    .click();

  cy.getByDataTest(headerTestIds.gettingStartedMenu).should("be.visible");
  cy.getByDataTest(headerTestIds.gettingStartedTrigger)
    .should("be.visible")
    .click(); // To close

  cy.getByDataTest(headerTestIds.resourcesTrigger).should("be.visible").click();
  cy.getByDataTest(headerTestIds.resourcesMenu).should("be.visible");
  cy.getByDataTest(headerTestIds.resourcesTrigger).should("be.visible").click(); // To close
};

const checkMobileBaseElements = () => {
  cy.getByDataTest(headerTestIds.title).should("be.visible");
  cy.getByDataTest(headerTestIds.navOpen).should("be.visible");
};

describe("Header", () => {
  describe("Desktop - Without Search", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("has title, Getting Started, and Resources", checkBaseElements);
    it("can open GettingStarted and Resources menus", checkMenuInteractions);
  });

  describe("Desktop - With Search", () => {
    beforeEach(() => {
      // Visible on all routes except / & /search
      cy.visit("/faq");
    });

    it("has title, Getting Started, Resources, and SearchBar", () => {
      checkBaseElements();
      cy.getByDataTest(headerTestIds.searchInput).should("be.visible");
    });

    it("has search capabilities from header", () => {
      cy.getByDataTest(headerTestIds.searchInput).should("be.visible");

      cy.getByDataTest(searchBar.input).should("be.visible").click();

      cy.getByDataTest(searchBar.overlay)
        .should("be.visible")
        .click()
        .should("not.be.visible");

      cy.getByDataTest(searchBar.input).type("@aws-cdk");

      cy.getByDataTest(searchBar.overlay).should("be.visible");
      cy.getByDataTest(searchBar.suggestionsList).should("be.visible");
      cy.getByDataTest(searchBar.suggestion).should("have.length", 5);

      cy.get("body").type("{esc}");
      cy.getByDataTest(searchBar.overlay).should("not.be.visible");
      cy.getByDataTest(searchBar.suggestionsList).should("not.exist");

      cy.getByDataTest(searchBar.input).type("{enter}");
      cy.url().should("include", "/search");
    });
  });

  describe("Mobile - Without Search", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
      cy.visit("/");
    });

    it("has title and button to open nav", checkMobileBaseElements);

    it("nav has dropdowns", () => {
      cy.getByDataTest(headerTestIds.navOpen).should("be.visible").click();
      cy.getByDataTest(headerTestIds.mobileNav)
        .should("be.visible")
        .within(() => {
          cy.getByDataTest(headerTestIds.gettingStartedMenu).should(
            "be.visible"
          );
          cy.getByDataTest(headerTestIds.resourcesMenu).should("be.visible");
        });
    });
  });

  describe("Mobile - With Search", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
      cy.visit("/faq");
    });

    it("has base elements and search icon", () => {
      checkMobileBaseElements();
      cy.getByDataTest(headerTestIds.searchIcon).should("be.visible");
    });

    it("opens search modal when search icon is clicked", () => {
      cy.getByDataTest(headerTestIds.searchIcon).should("be.visible").click();
      cy.getByDataTest(searchModalTestIds.container).should("be.visible");
    });

    it("has search functionality from search modal", () => {
      cy.getByDataTest(headerTestIds.searchIcon).should("be.visible").click();

      cy.getByDataTest(searchModalTestIds.container).within(() => {
        cy.getByDataTest(searchBar.input)
          .type("@aws-cdk{enter}")
          .url()
          .should("include", "/search");
      });
    });
  });
});
