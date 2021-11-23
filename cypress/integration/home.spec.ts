import searchBar from "components/SearchBar/testIds";
import home from "views/Home/testIds";
import { getSearchPath } from "util/url";
import { CDKType, CDKTYPE_RENDER_MAP } from "constants/constructs";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "constants/languages";
import packageCard from "components/PackageCard/testIds";
import { CatalogSearchSort } from "api/catalog-search/constants";

describe("Home (Redesign / WIP)", () => {
  describe("Hero Section", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("has heading and subtitle", () => {
      cy.getByDataTest(home.heroHeader).should("be.visible");
      cy.getByDataTest(home.heroSubtitle).should("be.visible");
    });

    it("has search capabilities from home page", () => {
      cy.getByDataTest(home.page).within(() => {
        cy.getByDataTest(searchBar.input)
          .should("be.visible")
          .type("@aws-cdk", { force: true });
        cy.getByDataTest(searchBar.overlay).should("be.visible");
        cy.getByDataTest(searchBar.suggestionsList).should("be.visible");
        cy.getByDataTest(searchBar.suggestion).should("have.length", 5);
        cy.getByDataTest(searchBar.input)
          .type("{enter}")
          .url()
          .should("include", "/search");
      });
    });
  });

  describe("Informational Section", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("has expected sections and content", () => {
      cy.getByDataTest(home.infoContainer)
        .should("be.visible")
        .within(() => {
          cy.getByDataTest(home.infoSection)
            .should("have.length", 3)
            .each((el) => {
              cy.wrap(el).within(() => {
                cy.getByDataTest(home.infoSectionHeading).should("be.visible");
                cy.getByDataTest(home.infoSectionDescription).should(
                  "be.visible"
                );
              });
            });
        });
    });

    it("has cdkType icon links with search urls", () => {
      cy.getByDataTest(home.infoSection)
        .first()
        .within(() => {
          cy.getByDataTest(home.infoSectionIcon).each((el, index) => {
            const cdkType = [CDKType.awscdk, CDKType.cdk8s, CDKType.cdktf][
              index
            ];

            cy.wrap(el)
              .should("have.text", CDKTYPE_RENDER_MAP[cdkType].name)
              .should(
                "have.attr",
                "href",
                getSearchPath({
                  cdkType,
                  sort: CatalogSearchSort.DownloadsDesc,
                })
              )
              .find("img")
              .should("have.attr", "src", CDKTYPE_RENDER_MAP[cdkType].imgsrc);
          });
        });
    });

    it("has language icon links with search urls", () => {
      cy.getByDataTest(home.infoSection)
        .last()
        .within(() => {
          cy.getByDataTest(home.infoSectionIcon).each((el, index) => {
            const language = Object.keys(LANGUAGE_NAME_MAP).filter((l) =>
              TEMP_SUPPORTED_LANGUAGES.has(l as Language)
            )[index] as Language;

            cy.wrap(el)
              .should("have.text", LANGUAGE_NAME_MAP[language])
              .should(
                "have.attr",
                "href",
                getSearchPath({
                  languages: [language],
                  sort: CatalogSearchSort.DownloadsDesc,
                })
              );
          });
        });
    });
  });

  describe("Featured Section", () => {
    it("has a header and 4 cards", () => {
      cy.visit("/?ff-fullSite");
      cy.getByDataTest(home.featuredContainer)
        .should("be.visible")
        .within(() => {
          cy.getByDataTest(home.featuredHeader).should("be.visible");
          cy.getByDataTest(home.featuredGrid)
            .should("be.visible")
            .within(() => {
              cy.getByDataTest(packageCard.wideContainer).should(
                "have.length",
                4
              );
            });
        });
    });

    it("shows recently updated if no content is featured", () => {
      cy.visitWithConfig("/?ff-fullSite", {
        featuredPackages: undefined,
      });

      cy.getByDataTest(home.featuredContainer).within(() => {
        cy.getByDataTest(home.featuredHeader).should(
          "have.text",
          "Recently updated"
        );
      });
    });

    it("shows featured content if config provides featured content", () => {
      const featuredPackages = {
        sections: [
          {
            name: "Featured packages",
            showPackages: [
              {
                name: "@aws-cdk/aws-s3",
                comment: "One of the most popular AWS CDK libraries!",
              },
              {
                name: "@aws-cdk/aws-lambda",
              },
              {
                name: "@aws-cdk/aws-iam",
                comment:
                  "Secure your constructs with safe and manageable permission boundaries.",
              },
              {
                name: "@aws-cdk/pipelines",
                comment:
                  "The most recently released L3 construct library from the CDK team!",
              },
            ],
          },
          {
            name: "Recently updated",
            showLastUpdated: 5,
          },
        ],
      };

      cy.visitWithConfig("/?ff-fullSite", {
        featuredPackages,
      });

      cy.getByDataTest(home.featuredContainer).within(() => {
        cy.getByDataTest(home.featuredHeader).should(
          "have.text",
          "Featured packages"
        );

        cy.getByDataTest(packageCard.title).each((title, index) => {
          const expectedName =
            featuredPackages.sections[0].showPackages[index].name;

          cy.wrap(title).should("have.text", expectedName);
        });
      });
    });
  });

  describe("CDK Type Section", () => {
    it("has heading, description, 3 tabs, 4 cards, and a see all button", () => {
      cy.visit("/?ff-fullSite");

      cy.getByDataTest(home.cdkTypeSection).within(() => {
        cy.getByDataTest(home.cdkTypeSectionHeading).should("be.visible");
        cy.getByDataTest(home.cdkTypeSectionDescription).should("be.visible");

        cy.getByDataTest(home.cdkTypeTab).should("have.length", 3);

        cy.getByDataTest(home.packageGrid)
          .first()
          .within(() => {
            cy.getByDataTest(packageCard.wideContainer).should(
              "have.length",
              4
            );
          });

        cy.getByDataTest(home.cdkTypeSeeAllButton).should("be.visible");
      });
    });

    it("reveals different cards for respective tabs", () => {
      cy.visit("/?ff-fullSite");

      cy.getByDataTest(home.cdkTypeSection).within(() => {
        cy.getByDataTest(home.cdkTypeTab).each((tab, index) => {
          const tabName: string = ["Community", "AWS", "HashiCorp"][index];

          cy.wrap(tab).click();

          cy.wrap(tab).should("have.attr", "data-value", tabName);

          // Verify current tab's package grid is visible and others are not
          cy.getByDataTest(home.packageGrid).each((grid, gridIndex) => {
            cy.wrap(grid).should(
              index === gridIndex ? "be.visible" : "not.be.visible"
            );
          });
        });
      });
    });

    it("has a see all button which opens the correct search url", () => {
      cy.visit("/?ff-fullSite");

      const testSeeAll = (tagName: string, index: number) => {
        cy.getByDataTest(home.cdkTypeTab).eq(index).click();

        cy.getByDataTest(home.cdkTypeSeeAllButton)
          .eq(index)
          .should(
            "have.attr",
            "href",
            getSearchPath({
              tags: [tagName],
              sort: CatalogSearchSort.DownloadsDesc,
            })
          );
      };

      ["community", "aws-official", "hashicorp-official"].forEach(testSeeAll);
    });
  });
});
