import testIds from "components/Footer/testIds";

const footerTests = (viewport?: Cypress.ViewportPreset) => {
  before(() => {
    cy.visit("/terms");
  });

  beforeEach(() => {
    if (viewport) {
      cy.viewport(viewport);
    }
    cy.checkFooterVisibility();
  });

  it("has expected elements", () => {
    Object.values(testIds).forEach((testId) => {
      cy.getByDataTest(testId).should("be.visible");
    });
  });
};

describe("Footer", () => {
  describe("Desktop", footerTests);

  describe("Tablet", () => footerTests("ipad-2"));

  describe("Mobile", () => footerTests("iphone-xr"));
});
