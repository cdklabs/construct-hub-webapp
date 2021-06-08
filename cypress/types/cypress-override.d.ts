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
  }
}