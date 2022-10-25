describe('Condition field', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('New Project').click()
      cy.contains(newProjectUUID, { timeout: 80000 }).click()

      cy.get('body').should('contain', 'Create New Tree')
      cy.get('#treeNameField').type('HelloTree')
      cy.get('button').click()
      cy.get('body', { timeout: 80000 }).should('contain', 'HelloTree')
      cy.contains('HelloTree').click()
      cy.get('body').contains("Tree Viewer", { timeout: 80000 })
    })

    it('should let you select the condition field', () => {
        cy.get('#node-type-dropdown').click()
        cy.get('[data-value="condition"]').click()
        cy.get('#node-type-dropdown').should('contain', 'Condition')
    })
  })