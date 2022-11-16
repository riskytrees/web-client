describe('Condition field', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('body').contains('New Project').click()
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('Create New Project').click()
      cy.contains("Tree Viewer", { timeout: 80000 }).click()
    })

    it('should let you select the condition field', () => {
        cy.get('#node-type-dropdown').click()
        cy.get('[data-value="condition"]').click()
        cy.get('#node-type-dropdown').should('contain', 'Condition')
    })
  })