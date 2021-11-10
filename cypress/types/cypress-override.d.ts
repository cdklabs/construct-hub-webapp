/**
 * Cypress declaration override to include typedefs for custom commands.
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute or multiple data-testid attributes (treated as an OR)
     * @example cy.getByDataTest("header");
     * @example cy.getByDataTest(["header", "footer"]);
     */
    getByDataTest(
      testId: string | string[],
      options?: Parameters<Chainable["get"]>[1]
    ): Chainable;
    /**
     * Checks header visibility
     */
    checkHeaderVisibility(): void;
    /**
     * Checks footer visibility
     */
    checkFooterVisibility(): void;
    /**
     * Visits a page with a custom config
     */
    visitWithConfig(url: string, config: import("api/config").Config): void;
  }
}
