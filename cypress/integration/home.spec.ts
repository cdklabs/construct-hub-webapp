import { checkHeaderAndFooter } from "../support/helpers";
import searchBar from "components/SearchBar/testIds";
import homeRedesign from "views/HomeRedesign/testIds";
import { getSearchPath } from "util/url";
import { CDKType, CDKTYPE_RENDER_MAP } from "constants/constructs";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "constants/languages";
import packageCard from "components/PackageCard/testIds";

describe("Home Page", () => {
  describe("Renders expected content", () => {
    before(() => {
      cy.visitWithConfig("/", {
        featureFlags: { homeRedesign: false },
      });
    });

    checkHeaderAndFooter();

    it("has hero section headings", () => {
      cy.getByDataTest("home-headings")
        .should("be.visible")
        .children()
        .should("have.length", 3);
    });

    it("has search inputs", cy.checkCatalogSearchInputs);

    it("displays 20 packages", () => {
      cy.checkResultCount(20);
    });

    it("has page controls", () => {
      cy.getByDataTest("home-nextPageBtn")
        .scrollIntoView()
        .should("be.visible");
      cy.getByDataTest("home-prevIcon").should("be.visible");
      cy.getByDataTest("home-nextIcon").should("be.visible");
    });
  });
});

describe("Home (Redesign / WIP)", () => {
  beforeEach(() => {
    cy.visitWithConfig("/", {
      featureFlags: {
        homeRedesign: true,
      },
    });
  });

  describe("Hero Section", () => {
    it("has heading and subtitle", () => {
      cy.getByDataTest(homeRedesign.heroHeader).should("be.visible");
      cy.getByDataTest(homeRedesign.heroSubtitle).should("be.visible");
    });

    it("has search capabilities from home page", () => {
      cy.getByDataTest(homeRedesign.page).within(() => {
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
    it("has expected sections and content", () => {
      cy.getByDataTest(homeRedesign.infoContainer)
        .should("be.visible")
        .within(() => {
          cy.getByDataTest(homeRedesign.infoSection)
            .should("have.length", 2)
            .each((el) => {
              cy.wrap(el).within(() => {
                cy.getByDataTest(homeRedesign.infoSectionHeading).should(
                  "be.visible"
                );
                cy.getByDataTest(homeRedesign.infoSectionDescription).should(
                  "be.visible"
                );
              });
            });
        });
    });

    it("has cdkType icon links with search urls", () => {
      cy.getByDataTest(homeRedesign.infoSection)
        .first()
        .within(() => {
          cy.getByDataTest(homeRedesign.infoSectionIcon).each((el, index) => {
            const cdkType = [CDKType.awscdk, CDKType.cdk8s, CDKType.cdktf][
              index
            ];

            cy.wrap(el)
              .should("have.text", CDKTYPE_RENDER_MAP[cdkType].name)
              .should("have.attr", "href", getSearchPath({ cdkType }))
              .find("img")
              .should("have.attr", "src", CDKTYPE_RENDER_MAP[cdkType].imgsrc);
          });
        });
    });

    it("has language icon links with search urls", () => {
      cy.getByDataTest(homeRedesign.infoSection)
        .last()
        .within(() => {
          cy.getByDataTest(homeRedesign.infoSectionIcon).each((el, index) => {
            const language = Object.keys(LANGUAGE_NAME_MAP).filter((l) =>
              TEMP_SUPPORTED_LANGUAGES.has(l as Language)
            )[index] as Language;

            cy.wrap(el)
              .should("have.text", LANGUAGE_NAME_MAP[language])
              .should(
                "have.attr",
                "href",
                getSearchPath({ languages: [language] })
              );
          });
        });
    });
  });

  describe("Featured Section", () => {
    it("has a header and 4 cards", () => {
      cy.getByDataTest(homeRedesign.featuredContainer)
        .should("be.visible")
        .within(() => {
          cy.getByDataTest(homeRedesign.featuredHeader).should("be.visible");
          cy.getByDataTest(homeRedesign.featuredGrid)
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
      cy.visitWithConfig("/", {
        featureFlags: {
          homeRedesign: true,
        },
        featuredPackages: undefined,
      });

      cy.getByDataTest(homeRedesign.featuredContainer).within(() => {
        cy.getByDataTest(homeRedesign.featuredHeader).should(
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

      cy.visitWithConfig("/", {
        featureFlags: {
          homeRedesign: true,
        },
        featuredPackages,
      });

      cy.getByDataTest(homeRedesign.featuredContainer).within(() => {
        cy.getByDataTest(homeRedesign.featuredHeader).should(
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
    it("has heading, description, 4 tabs, 4 cards, and a see all button", () => {
      cy.getByDataTest(homeRedesign.cdkTypeSection).within(() => {
        cy.getByDataTest(homeRedesign.cdkTypeSectionHeading).should(
          "be.visible"
        );
        cy.getByDataTest(homeRedesign.cdkTypeSectionDescription).should(
          "be.visible"
        );

        cy.getByDataTest(homeRedesign.cdkTypeTab).should("have.length", 4);

        cy.getByDataTest(homeRedesign.packageGrid)
          .first()
          .within(() => {
            cy.getByDataTest(packageCard.wideContainer).should(
              "have.length",
              4
            );
          });

        cy.getByDataTest(homeRedesign.cdkTypeSeeAllButton).should("be.visible");
      });
    });

    it("reveals different cards for respective tabs", () => {
      cy.getByDataTest(homeRedesign.cdkTypeSection).within(() => {
        cy.getByDataTest(homeRedesign.cdkTypeTab).each((tab, index) => {
          const cdkType: CDKType | undefined = [
            undefined,
            CDKType.awscdk,
            CDKType.cdk8s,
            CDKType.cdktf,
          ][index];

          cy.wrap(tab).click();

          if (cdkType) {
            cy.wrap(tab).should("have.attr", "data-cdktype", cdkType);
          }

          cy.getByDataTest(homeRedesign.packageGrid)
            .eq(index)
            .should("be.visible");
        });
      });
    });
    it("has a see all button which opens the correct search url", () => {
      const testSeeAll = (cdkType: CDKType | undefined, index: number) => {
        cy.visitWithConfig("/", { featureFlags: { homeRedesign: true } });
        cy.getByDataTest(homeRedesign.cdkTypeTab).eq(index).click();
        cy.getByDataTest(homeRedesign.cdkTypeSeeAllButton).eq(index).click();
        cy.url().should("contain", getSearchPath({ cdkType }));
      };

      [undefined, CDKType.awscdk, CDKType.cdk8s, CDKType.cdktf].forEach(
        testSeeAll
      );
    });
  });
});
