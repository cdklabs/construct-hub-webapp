const footerTests = (viewport) => {
  before(() => {
    cy.visit("/terms");
  });

  beforeEach(() => {
    if (viewport) {
      cy.viewport(viewport);
    }
    cy.checkFooterVisibility();
  });

  it("has expected links", () => {
    [
      "footer-service-terms",
      "footer-privacy",
      "footer-site-terms",
      "footer-legal",
    ].forEach((testId) => {
      cy.getByDataTest(testId).should("be.visible");
    });
  });

  it("shows a disclaimer", () => {
    cy.getByDataTest("footer-disclaimer").should("be.visible");
  });

  it("shows manage cookies button", () => {
    cy.getByDataTest("footer-manageCookies").should("be.visible");
  });
};

describe("Footer", () => {
  describe("Desktop", footerTests);

  describe("Tablet", () => footerTests("ipad-2"));

  describe("Mobile", () => footerTests("iphone-xr"));
});
