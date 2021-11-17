import { getPackagePath } from "util/url";
import header from "components/Header/testIds";
import packagePage from "views/Package/testIds";
import markdown from "components/Markdown/testIds";
import assemblyFixture from "../fixtures/assembly-constructs@3.3.161.json";
import { sanitizeVersion } from "api/package/util";
import { Language } from "constants/languages";

describe("Package Page", () => {
  beforeEach(() => {
    cy.intercept("**/constructs/v3.3.161/assembly.json", async (req) => {
      req.reply({
        fixture: "assembly-constructs@3.3.161",
      });
    });

    cy.intercept("**/constructs/v3.3.161/metadata.json", async (req) => {
      req.reply({
        fixture: "metadata-constructs@3.3.161",
      });
    });

    cy.intercept("**/constructs/v3.3.161/docs-typescript.md", async (req) => {
      req.reply({
        fixture: "docs-typescript-constructs@3.3.161.md",
      });
    }).as("getDocs");

    cy.intercept("**/constructs/v10.0.9/assembly.json", async (req) => {
      req.reply({
        fixture: "assembly-constructs@10.0.9",
      });
    });

    cy.intercept("**/constructs/v10.0.9/metadata.json", async (req) => {
      req.reply({
        fixture: "metadata-constructs@10.0.9",
      });
    });

    cy.intercept("**/constructs/v10.0.9/docs-typescript.md", async (req) => {
      req.reply({
        fixture: "docs-typescript-constructs@10.0.9.md",
      });
    });

    cy.intercept("**/catalog.json", async (req) => {
      req.reply({
        fixture: "catalog",
      });
    }).as("getCatalog");

    cy.visit(
      getPackagePath({
        name: "constructs",
        version: "3.3.161",
        language: "typescript" as any,
      })
    );

    cy.wait("@getDocs");
    cy.wait("@getCatalog");

    cy.getByDataTest(header.container).should("be.visible");
  });

  it("Has feedback and report links", () => {
    cy.getByDataTest(packagePage.feedbackLinks)
      .should("be.visible")
      .within(() => {
        cy.getByDataTest(packagePage.reportLink)
          .should("be.visible")
          .should(
            "have.attr",
            "href",
            `mailto:abuse@amazonaws.com?subject=${encodeURIComponent(
              `ConstructHub - Report of abusive package: constructs`
            )}`
          );

        cy.getByDataTest(packagePage.githubLink)
          .should("be.visible")
          .should(
            "have.attr",
            "href",
            `https://github.com/aws/constructs/issues`
          );
      });
  });

  it("Can switch between versions of a package", () => {
    cy.getByDataTest(markdown.container)
      .should("contain", "Fake README description for v3.3.161");

    cy.getByDataTest(packagePage.selectVersionButton)
      .click()
      .getByDataTest(packagePage.selectVersionDropdown)
      .should("be.visible")
      .within(() => {
        cy.getByDataTest(packagePage.selectVersionItem).last().invoke("click");
      });

    cy.url().should(
      "contain",
      getPackagePath({
        name: "constructs",
        version: "10.0.9",
        language: Language.TypeScript,
      }),
    );

    // validate that new metadata has loaded
    cy.getByDataTest(packagePage.description)
      .should("contain", "A programming model for software-defined state");

    // validate that new docs have loaded
    cy.getByDataTest(markdown.container)
      .should("contain", "Fake README description for v10.0.9");

    cy.getByDataTest(packagePage.selectVersionButton)
      .should("be.visible")
      .should("contain", "v10.0.9");
  });

  it("has a dependencies tab with dependency links", () => {
    const depEntries = Object.entries(assemblyFixture.dependencies);

    cy.getByDataTest(packagePage.dependenciesTab).should("be.visible").click();

    cy.getByDataTest(packagePage.dependenciesList)
      .should("be.visible")
      .within(() => {
        cy.getByDataTest(packagePage.dependenciesLink)
          .should("have.length", depEntries.length)
          .each((el, i) => {
            const [name, version] = depEntries[i];

            cy.wrap(el).should(
              "have.attr",
              "href",
              getPackagePath({ name, version: sanitizeVersion(version) })
            );
          });
      });
  });
});
