describe('Analysis pane', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('should let you view the analysis pane', () => {
      localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impvc2lhaEByaXNreXRyZWVzLmNvbSJ9.2DM3dQPime134NxfVLsx-RT6Y0qpNVAdgZoxWGyhNXg");

      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('body').contains('New Project').click()
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('Create New Project').click()
      cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')
      cy.intercept('http://localhost:8000/projects/*/trees/*/dag/down').as('dagDown')

      cy.contains("Tree Viewer", { timeout: 80000 }).click()
      cy.wait('@getProject', { timeout: 20000 })
      cy.wait('@dagDown', { timeout: 20000 })

      cy.wait(1000) // Wait for render

      // lets you select a node
      cy.location().then((loc) => {
        let treeId = loc.search.split('id=')[1].split('&')[0];
  
        cy.contains(treeId, { timeout: 20000 })
      })

      cy.get(':nth-child(2) > .MuiStack-root > .MuiButtonBase-root').click()
      cy.get('#model-dropdown').click()
      cy.get('[data-value="f1644cb9-b2a5-4abb-813f-98d0277e42f2"]').click()

      cy.get('.MuiModal-root > .MuiBox-root').contains("Risk of Attack", { timeout: 80000 })
      cy.get('.MuiBackdrop-root').first().click()
      cy.get('body').should('not.contain', "Risk of Attack")

      // Click analysis button
      cy.get('body').should('contain', 'Show Analysis')
      cy.contains('Show Analysis').click()
      cy.get('body').should('contain', 'Total Tree Risk')
      cy.get('body').should('contain', 'Close Analysis')
      cy.contains('Close Analysis').click()
      cy.get('body').should('contain', 'Show Analysis')
    })


  })