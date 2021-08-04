export const checkHeaderAndFooter = () => {
  const withViewport = (viewport, assertion) => () => {
    cy.viewport(viewport);
    assertion();
  };

  describe("Header Present", () => {
    it(
      "is present on desktop",
      withViewport("macbook-11", cy.checkHeaderVisibility)
    );

    it(
      "is present on tablet",
      withViewport("ipad-2", cy.checkHeaderVisibility)
    );

    it(
      "is present on mobile",
      withViewport("iphone-xr", cy.checkHeaderVisibility)
    );
  });

  describe("Footer Present", () => {
    it(
      "is present on desktop",
      withViewport("macbook-11", cy.checkFooterVisibility)
    );

    it(
      "is present on tablet",
      withViewport("ipad-2", cy.checkFooterVisibility)
    );

    it(
      "is present on mobile",
      withViewport("iphone-xr", cy.checkFooterVisibility)
    );
  });
};
