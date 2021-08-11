import { checkHeaderAndFooter } from "../support/helpers";

describe("FAQ", () => {
  before(() => {
    cy.visit("/faq");
  });

  checkHeaderAndFooter();
});
