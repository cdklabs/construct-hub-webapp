import headerTestIds from "components/Header/testIds";
import searchModalTestIds from "components/SearchModal/testIds";

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

    it("has title, Getting Started, Resources, and Search Button", () => {
      checkBaseElements();
      cy.getByDataTest(headerTestIds.searchButton).should("be.visible");
    });

    it("opens search modal by clicking the search button", () => {
      cy.getByDataTest(headerTestIds.searchButton).should("be.visible").click();
      cy.getByDataTest(searchModalTestIds.container).should("be.visible");
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
        .within(checkMenuInteractions);
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
  });
});
