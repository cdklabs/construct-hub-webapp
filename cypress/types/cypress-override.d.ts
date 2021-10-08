/**
 * Cypress declaration override to include typedefs for custom commands.
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-test attribute
     * @example cy.getByDataTest("header")
     */
    getByDataTest(
      ...params: Parameters<Cypress.Chainable["get"]>
    ): ReturnType<Cypress.Chainable["get"]>;
    /**
     * Checks header visibility
     */
    checkHeaderVisibility(): void;
    /**
     * Checks footer visibility
     */
    checkFooterVisibility(): void;
    /**
     * Checks catalog search input presence
     */
    checkCatalogSearchInputs(): void;
    /**
     * Checks count of catalog cards on page
     */
    checkResultCount(count: number): void;
    /**
     * Visits a page with a custom config
     */
    visitWithConfig(url: string, config: import("api/config").Config): void;
  }
}
