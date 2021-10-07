/**
 * Cypress declaration override to include typedefs for custom commands.
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-test attribute
     * @example cy.getByDataTest("header")
     */
    getByDataTest(value: string): Chainable<Element>;
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

    /**
     * Checks SearchBar functionality on a page
     */
    checkSearchFunctionality(options?: {
      expectSuggestions?: boolean;
      expectOverlay?: boolean;
      expectSearchPage?: boolean;
    }): void;
  }
}
