import { getPackagePath } from "util/url";
import header from "components/Header/testIds";
import packagePage from "views/Package/testIds";

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
            "https://github.com/cdklabs/construct-hub/issues"
          );
      });
  });
});
