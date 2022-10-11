describe('Deselect Node', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      cy.visit('/')
      cy.get('body').should('contain', 'technicolor')
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.get('button').click()
      cy.contains(newProjectUUID, { timeout: 80000 }).click()

      cy.get('body').should('contain', 'Create New Tree')
      cy.get('#treeNameField').type('HelloTree')
      cy.get('button').click()
      cy.get('body', { timeout: 80000 }).should('contain', 'HelloTree')
      cy.contains('HelloTree').click()
      cy.get('body').contains("Tree Viewer", { timeout: 80000 }).click()
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

            cy.get('body').should('not.contain', 'This is the root node')

        })
      })
  })