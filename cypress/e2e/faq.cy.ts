import { checkHeaderAndFooter } from "../support/helpers";

describe("FAQ", () => {
  beforeEach(() => {
    cy.visit("/faq");
  });

  checkHeaderAndFooter();
});
