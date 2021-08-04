
describe('Home Page Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Has a header', () => {
    cy.getByDataTest("header").should("be.visible");
  });
});
