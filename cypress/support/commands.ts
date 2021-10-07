import header from "components/Header/testIds";
import footer from "components/Footer/testIds";
import catalogSearch from "components/CatalogSearch/testIds";
import searchBar from "components/SearchBar/testIds";
import catalogCard from "components/CatalogCard/testIds";
import { Config } from "api/config";

Cypress.Commands.add("visitWithConfig", (url: string, config: Config) => {
  cy.visit(url, {
    onBeforeLoad: (win) => {
      win.configOverride = config;
    },
  });
});

Cypress.Commands.add("getByDataTest", (dataTest) =>
  cy.get(`[data-testid="${dataTest}"]`)
);

Cypress.Commands.add("checkHeaderVisibility", () => {
  cy.getByDataTest(header.container).should("be.visible");
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

Cypress.Commands.add(
  "checkSearchFunctionality",
  ({
    expectSuggestions = true,
    expectOverlay = true,
    expectSearchPage = true,
  } = {}) => {
    const focusInput = () =>
      cy.getByDataTest(searchBar.input).should("be.visible").click();

    /**
     * Test interactions for Overlay and Suggestions. Suggestions will not exist in DOM if none are available or
     * input is not focused.
     */
    const testDisclosureVisibility = (selector: string, shouldExist = true) => {
      const visibilityAssertion = shouldExist ? "not.be.visible" : "not.exist";
      focusInput();

      cy.getByDataTest(selector).should("be.visible");
      cy.get("body").click();
      cy.getByDataTest(selector).should(visibilityAssertion);

      focusInput();

      cy.getByDataTest(selector).should("be.visible");
      cy.get("body").type("{esc}");
      cy.getByDataTest(selector).should(visibilityAssertion);
    };

    if (expectOverlay) {
      testDisclosureVisibility(searchBar.overlay);
    }

    if (expectSuggestions) {
      focusInput().type("@aws-cdk");
      testDisclosureVisibility(searchBar.suggestionsList, false);
      focusInput();
      cy.getByDataTest(searchBar.suggestion).should("have.length", 5);
    }

    if (expectSearchPage) {
      focusInput().type("@aws-cdk{enter}");
      cy.url().should("include", "/search");
    }
  }
);
