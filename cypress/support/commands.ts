import header from "components/Header/testIds";
import footer from "components/Footer/testIds";
import catalogSearch from "components/CatalogSearch/testIds";
import catalogCard from "components/CatalogCard/testIds";
import { Config } from "api/config";

Cypress.Commands.add("visitWithConfig", (url: string, config: Config) => {
  cy.clearLocalStorage();
  cy.visit(url, {
    onBeforeLoad: (win) => {
      win.configOverride = config;
    },
  });
});

Cypress.Commands.add("getByDataTest", (dataTest: string | string[], options) =>
  cy.get(
    (typeof dataTest === "string" ? [dataTest] : dataTest)
      .map((d) => `[data-testid="${d}"]`)
      .join(", "),
    options
  )
);

Cypress.Commands.add("checkHeaderVisibility", () => {
  cy.getByDataTest(header.container).scrollIntoView().should("be.visible");
});

Cypress.Commands.add("checkCatalogSearchInputs", () => {
  cy.getByDataTest(catalogSearch.input).should("be.visible");
  cy.getByDataTest(catalogSearch.languageDropdown).should("be.visible");
  cy.getByDataTest(catalogSearch.submit).should("be.visible");
});

Cypress.Commands.add("checkResultCount", (count) => {
  cy.getByDataTest(catalogCard.container).should("have.length", count);
});

Cypress.Commands.add("checkFooterVisibility", () => {
  cy.getByDataTest(footer.container).scrollIntoView().should("be.visible");
});
