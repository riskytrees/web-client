describe('Page should not crash when selecting nodes', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('body').contains('New Project').click()
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('Create New Project').click()
      cy.contains(newProjectUUID, { timeout: 80000 }).click()

      cy.get('body').should('contain', 'Create New Tree')
      cy.get('#treeNameField').type('HelloTree')
      cy.get('button').click()
      cy.get('body', { timeout: 80000 }).should('contain', 'HelloTree')
      cy.contains('HelloTree').click()
      cy.get('body').contains("Tree Viewer", { timeout: 80000 }).click()
    })

    it('lets you select a risk model', () => {
        cy.contains('New Root node', { timeout: 20000 })
        cy.get('.MuiBox-root > .MuiButton-root').click()
        cy.get('#model-dropdown').click()
        cy.get('[data-value="bf4397f7-93ae-4502-a4a2-397f40f5cc49"]').click()
        cy.get('.MuiModal-root > .MuiBox-root').contains("EVITA", { timeout: 80000 })
        cy.get('.MuiBackdrop-root').first().click()
        cy.get('body').should('not.contain', "EVITA")
      })

      it('lets you add nodes', () => {
        cy.get('canvas').then(canvas => {
            const width = canvas.width();
            const height = canvas.height();
            const canvasCenterX = width / 2;
            const canvasCenterY = height / 2;

            cy.wrap(canvas)
            .click(canvasCenterX - 45, canvasCenterY)

            cy.contains('Add Node').click()

            cy.get('canvas').then(canvas => {
                cy.wrap(canvas)
                .click(canvasCenterX - 45, canvasCenterY + 50)
                cy.get('#node-type-dropdown').click()
                cy.contains("And").click()
                cy.wait(1000)

                cy.get('canvas').then(canvas => {
                    cy.wrap(canvas)
                    .click(canvasCenterX - 45, canvasCenterY)
                    cy.wait(1000)

                    cy.get('#node-type-dropdown').click()
                    cy.contains("Or").click()
                })

            })
        })
      })
  })