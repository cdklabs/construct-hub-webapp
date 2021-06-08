
describe('Home Page Sample Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Has a header', () => {
    cy.getByDataTest("header").should("be.visible");
  });
});
