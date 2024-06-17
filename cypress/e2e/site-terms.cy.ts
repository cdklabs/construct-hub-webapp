import { checkHeaderAndFooter } from "../support/helpers";

describe("Site Terms", () => {
  beforeEach(() => {
    cy.visit("/terms");
  });

  checkHeaderAndFooter();
});
