describe('Deselect Node', () => {
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

            // Click somewhere else on the canvas
            cy.wrap(canvas)
            .click(canvasCenterX + 45, canvasCenterY)
            cy.wait(1000)

            cy.get('body').should('not.contain', 'This is the root node')

        })
      })
  })