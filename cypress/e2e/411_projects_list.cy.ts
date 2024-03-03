describe('Adding projects', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('should let you add multiple projects', () => {
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

      cy.get(':nth-child(1) > .MuiStack-root > .MuiButtonBase-root').click()
      cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click()

      cy.get('#primaryButton').click()

      cy.get('#treeNameField').type("Other Tree")
      cy.get('.riskyModal > .MuiStack-root > .MuiButtonBase-root').first().click()

      cy.reload()
      cy.get('body').should('contain', 'Other Tree')


    })


  })