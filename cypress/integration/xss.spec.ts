/**
 * @fileoverview Tests the potential xss vectors in the application
 * @todo: Commented tests are for code that is not merged yet
 */
import catalogSearch from "components/CatalogSearch/testIds";
import header from "components/Header/testIds";
import markdown from "components/Markdown/testIds";
// import searchBar from "components/SearchBar/testIds";
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

const testSearchURL = async (query: string, isRedesign = false) => {
  withWindowAlertCheck(async () => {
    cy.visitWithConfig(decodeURIComponent(getSearchPath({ query })), {
      featureFlags: {
        searchRedesign: isRedesign,
      },
    });
  });
};

const testInput = async ({
  inputSelector = catalogSearch.input,
  isRedesign = false,
  input = "",
  url = "/",
}) => {
  withWindowAlertCheck(async () => {
    cy.visitWithConfig(url, {
      featureFlags: {
        homeRedesign: isRedesign,
        searchRedesign: isRedesign,
      },
    });

    cy.getByDataTest(inputSelector).type(input + "{enter}", { force: true });

    checkURL({ query: input });
  });
};

const testMarkdown = async (input: string) => {
  withWindowAlertCheck(async () => {
    cy.intercept(
      {
        url: "/data/@aws-cdk/region-info/v1.126.0/docs-typescript.md",
        times: 1,
      },
      (req) => {
        req.on("before:response", (res) => {
          // force all API responses to not be cached
          res.headers["cache-control"] = "no-store";
        });

        req.continue((res) => {
          const { body } = res;
          res.body = input + "\n" + body;
        });
      }
    ).as("docs");

    cy.visit(
      getPackagePath({
        name: "@aws-cdk/region-info",
        version: "1.126.0",
        language: "typescript" as any,
      })
    );

    cy.getByDataTest(header.container).should("be.visible");
    cy.getByDataTest(markdown.container).should("exist", {
      timeout: 15000,
    });
  });
};

describe("XSS - Stable Featureset", () => {
  describe("Package Page - Markdown Rendering", () => {
    it("will not execute malicious HTML Markdown", () => {
      testMarkdown(alertHTML);
    });

    it("will not execute malicious JS Markdown", () => {
      testMarkdown(alertJS);
    });
  });
});

describe("XSS - Dev Preview Featureset", () => {
  describe("Home Page - Input", () => {
    it("will not execute malicious HTML input", () => {
      testInput({ input: alertHTML });
    });

    it("will not execute malicious JavaScript input", () => {
      testInput({ input: alertJS });
    });
  });

  describe("Search Page - Input & URL", () => {
    it("will not execute malicious HTML urls", () => {
      testSearchURL(alertHTML);
    });

    it("will not execute malicious JavaScript urls", () => {
      testSearchURL(alertJS);
    });

    it("will not execute malicious HTML input", () => {
      testInput({
        url: "/search",
        input: alertHTML,
      });
    });

    it("will not execute malicious JavaScript input", () => {
      testInput({
        url: "/search",
        input: alertJS,
      });
    });
  });
});

describe("XSS - GA Featureset", () => {
  // describe("Home Page - Input", () => {
  //   it("will not execute malicious HTML input", () => {
  //     testInput({
  //       isRedesign: true,
  //       input: alertHTML,
  //       inputSelector: searchBar.input,
  //     });
  //   });

  //   it("will not execute malicious JavaScript input", () => {
  //     testInput({
  //       isRedesign: true,
  //       input: alertJS,
  //       inputSelector: searchBar.input,
  //     });
  //   });
  // });

  describe("Search Page - URL & Input", () => {
    it("will not execute malicious HTML urls", () => {
      testSearchURL(alertHTML, true);
    });

    it("will not execute malicious JS urls", () => {
      testSearchURL(alertJS, true);
    });

    it("will not execute malicious HTML input", () => {
      testInput({
        url: "/search",
        input: alertHTML,
        isRedesign: true,
      });
    });

    it("will not execute malicious JS input", () => {
      testInput({
        url: "/search",
        input: alertJS,
        isRedesign: true,
      });
    });
  });
});
