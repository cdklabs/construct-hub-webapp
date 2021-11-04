import { getPackagePath } from "util/url";
import header from "components/Header/testIds";
import packagePage from "views/Package/testIds";
import assemblyFixture from "../fixtures/assembly.json";
import { sanitizeVersion } from "api/package/util";
import { CONSTRUCT_HUB_REPO_URL } from "../../src/constants/links";

describe("Package Page", () => {
  beforeEach(() => {
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
              `ConstructHub - Report of abusive package: construct-hub`
            )}`
          );

        cy.getByDataTest(packagePage.githubLink)
          .should("be.visible")
          .should(
            "have.attr",
            "href",
            `${CONSTRUCT_HUB_REPO_URL}/issues`
          );
      });
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
