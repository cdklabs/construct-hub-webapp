/**
 * @fileoverview Tests the potential xss vectors in the application
 * @todo: Commented tests are for code that is not merged yet
 */
import catalogSearch from "components/CatalogSearch/testIds";
import header from "components/Header/testIds";
import markdown from "components/Markdown/testIds";
import searchBar from "components/SearchBar/testIds";
import { getPackagePath, getSearchPath } from "util/url";

const alertHTML = "<script>window.alert()</script>";
const alertJS = "window.alert()";

const withWindowAlertCheck = (assertion: () => Promise<unknown>) => {
  cy.window().then((win) => {
    cy.spy(win, "alert");

    assertion().then(() => {
      expect(win.alert).not.to.be.called;
    });
  });
};

const checkURL = (params: Parameters<typeof getSearchPath>[0]) => {
  cy.url().should("eq", `http://localhost:3000${getSearchPath(params)}`);
};

const testSearchURL = async (query: string) => {
  withWindowAlertCheck(async () => {
    cy.visit(decodeURIComponent(getSearchPath({ query })));

    cy.getByDataTest(header.container).should("be.visible");
  });
};

const testInput = async ({
  inputSelector = catalogSearch.input,
  input = "",
  url = "/",
}) => {
  withWindowAlertCheck(async () => {
    cy.visit(url);

    cy.getByDataTest(inputSelector).type(input + "{enter}", { force: true });

    checkURL({ query: input });
  });
};

const testMarkdown = async () => {
  withWindowAlertCheck(async () => {
    cy.intercept("**/assembly.json", async (req) => {
      req.reply({
        fixture: "assembly",
      });
    });

    cy.intercept("**/metadata.json", async (req) => {
      req.reply({
        fixture: "metadata",
      });
    });

    cy.intercept("**/docs-typescript.md", async (req) => {
      req.reply({
        fixture: "xss-docs.md",
      });
    }).as("getDocs");

    cy.visit(
      getPackagePath({
        name: "construct-hub",
        version: "0.2.31",
        language: "typescript" as any,
      })
    );

    cy.wait("@getDocs");

    cy.getByDataTest(header.container).should("be.visible");
    // Give extra long timeout for CI
    cy.getByDataTest(markdown.container, { timeout: 60000 }).should("exist");
  });
};

describe("XSS - Stable Featureset", () => {
  describe("Package Page - Markdown Rendering", () => {
    it("will not execute malicious HTML or JS Markdown", () => {
      testMarkdown();
    });
  });
});

describe("XSS - GA Featureset", () => {
  describe("Home Page - Input", () => {
    it("will not execute malicious HTML input", () => {
      testInput({
        input: alertHTML,
        inputSelector: searchBar.input,
      });
    });

    it("will not execute malicious JavaScript input", () => {
      testInput({
        input: alertJS,
        inputSelector: searchBar.input,
      });
    });
  });

  describe("Search Page - URL & Input", () => {
    it("will not execute malicious HTML urls", () => {
      testSearchURL(alertHTML);
    });

    it("will not execute malicious JS urls", () => {
      testSearchURL(alertJS);
    });

    it("will not execute malicious HTML input", () => {
      testInput({
        url: "/search",
        input: alertHTML,
        inputSelector: searchBar.input,
      });
    });

    it("will not execute malicious JS input", () => {
      testInput({
        url: "/search",
        input: alertJS,
        inputSelector: searchBar.input,
      });
    });
  });
});
