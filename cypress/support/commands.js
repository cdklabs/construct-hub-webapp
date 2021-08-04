// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getByDataTest", (dataTest) =>
  cy.get(`[data-testid="${dataTest}"]`)
);

Cypress.Commands.add("checkHeaderVisibility", () => {
  cy.getByDataTest("header-container").should("be.visible");
});

Cypress.Commands.add("checkCatalogSearchInputs", () => {
  cy.getByDataTest("catalogSearch-input").should("be.visible");
  cy.getByDataTest("catalogSearch-languageDropdown").should("be.visible");
  cy.getByDataTest("catalogSearch-submit").should("be.visible");
});

Cypress.Commands.add("checkResultCount", (count) => {
  cy.getByDataTest("catalogCard-container").should("have.length", count);
});

Cypress.Commands.add("checkFooterVisibility", () => {
  cy.getByDataTest("footer-container").scrollIntoView().should("be.visible");
});
