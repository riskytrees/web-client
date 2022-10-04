describe('Basic tests to ensure page loads', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('body').contains("riskytrees")
  })
})