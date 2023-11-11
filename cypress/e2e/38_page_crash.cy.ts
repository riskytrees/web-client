
describe('Page should not crash when selecting nodes', () => {
  const newProjectUUID = self.crypto.randomUUID();

  it('loads tree page', () => {
    localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impvc2lhaEByaXNreXRyZWVzLmNvbSJ9.2DM3dQPime134NxfVLsx-RT6Y0qpNVAdgZoxWGyhNXg");
    cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')


    cy.visit('/')
    cy.get('body').should('contain', 'Home')
    cy.get('body').contains('New Project').click()
    cy.get('#createProjectButtonField').type(newProjectUUID)
    cy.contains('Create New Project').click()

    cy.contains("Tree Viewer", { timeout: 80000 }).click()
    cy.wait('@getProject', { timeout: 20000 })

    cy.location().then((loc) => {

      cy.contains(newProjectUUID, { timeout: 20000 })
      cy.get(':nth-child(2) > .MuiStack-root > .MuiButtonBase-root').click()
      cy.get('#model-dropdown').click()
      cy.get('[data-value="bf4397f7-93ae-4502-a4a2-397f40f5cc49"]').click()
      cy.get('.MuiModal-root > .MuiBox-root').contains("EVITA", { timeout: 80000 })
      cy.get('.MuiBackdrop-root').first().click()
      cy.get('body').should('not.contain', "EVITA")

      // Lets you add nodes
      cy.get('canvas').then(canvas => {
        const width = canvas.width();
        const height = canvas.height();
        const canvasCenterX = width / 2;
        const canvasCenterY = height / 2;

        cy.wrap(canvas)
          .click(canvasCenterX - 45, canvasCenterY)
        cy.wait(100)

        cy.contains('Add Node').click()

        cy.get('body').then(canvas => {
          const width = canvas.width();
          const height = canvas.height();
          const canvasCenterX = width / 2;
          const canvasCenterY = height / 2;
          cy.wrap(canvas)
            .click(canvasCenterX - 45, canvasCenterY - 30)
          cy.wait(100)
          cy.get('#node-type-dropdown').click()
          cy.contains("And").click()

          cy.get('body').then(canvas => {
            const width = canvas.width();
            const height = canvas.height();
            const canvasCenterX = width / 2;
            const canvasCenterY = height / 2;
            cy.wrap(canvas)
              .click(canvasCenterX - 45, canvasCenterY - 30)

            cy.get('#node-type-dropdown').click()
            cy.contains("Or").click()
          })

        })
      })
    })


  })

})