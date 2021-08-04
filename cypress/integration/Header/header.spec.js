const checkBaseElements = () => {
  cy.getByDataTest("header-title").should("be.visible");
  cy.getByDataTest("header-gettingStartedTrigger").should("be.visible");
  cy.getByDataTest("header-resourcesTrigger").should("be.visible");
};

const checkMenuInteractions = () => {
  cy.getByDataTest("header-gettingStartedTrigger").should("be.visible").click();
  cy.getByDataTest("header-gettingStartedMenu").should("be.visible");
  cy.getByDataTest("header-gettingStartedTrigger").should("be.visible").click(); // To close
  cy.getByDataTest("header-resourcesTrigger").should("be.visible").click();
  cy.getByDataTest("header-resourcesMenu").should("be.visible");
  cy.getByDataTest("header-resourcesTrigger").should("be.visible").click(); // To close
};

const checkMobileBaseElements = () => {
  cy.getByDataTest("header-title").should("be.visible");
  cy.getByDataTest("header-navOpen").should("be.visible");
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
      cy.getByDataTest("header-searchButton").should("be.visible");
    });

    it("opens search modal by clicking the search button", () => {
      cy.getByDataTest("header-searchButton").should("be.visible").click();
      cy.getByDataTest("searchModal-container").should("be.visible");
    });
  });

  describe("Mobile - Without Search", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
      cy.visit("/");
    });

    it("has title and button to open nav", checkMobileBaseElements);

    it("nav has dropdowns", () => {
      cy.getByDataTest("header-navOpen").should("be.visible").click();
      cy.getByDataTest("header-mobileNav")
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
      cy.getByDataTest("header-searchIcon").should("be.visible");
    });

    it("opens search modal when search icon is clicked", () => {
      cy.getByDataTest("header-searchIcon").should("be.visible").click();
      cy.getByDataTest("searchModal-container").should("be.visible");
    })
  });
});
