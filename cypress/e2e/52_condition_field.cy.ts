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

    it('lets you select a node', () => {
      cy.contains('New Root node', { timeout: 20000 })

      cy.get('canvas').then(canvas => {
          const width = canvas.width();
          const height = canvas.height();
          const canvasCenterX = width / 2;
          const canvasCenterY = height / 2;

          cy.wrap(canvas)
          .click(canvasCenterX - 45, canvasCenterY)

          cy.contains('This is the root node')
      })
    })

    it('should let you select the condition field', () => {
        cy.get('#node-type-dropdown').click()
        cy.get('[data-value="condition"]').click()
        cy.get('#node-type-dropdown').should('contain', 'Condition')
    })
  })