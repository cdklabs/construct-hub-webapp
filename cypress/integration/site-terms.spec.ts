import { checkHeaderAndFooter } from "../support/helpers";

describe("Site Terms", () => {
  before(() => {
    cy.visit("/terms");
  });

  checkHeaderAndFooter();
});
