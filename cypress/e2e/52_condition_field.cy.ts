describe('Condition field', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impvc2lhaEByaXNreXRyZWVzLmNvbSJ9.2DM3dQPime134NxfVLsx-RT6Y0qpNVAdgZoxWGyhNXg");

      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('body').contains('New Project').click()
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('Create New Project').click()
      cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')
      cy.intercept('http://localhost:8000/projects/*/trees/*/dag/down').as('dagDown')

      cy.get('.MuiButton-subtreeButton').click()
      cy.contains("Tree Viewer", { timeout: 80000 }).click()
      cy.wait('@getProject', { timeout: 20000 })
      cy.wait('@dagDown', { timeout: 20000 })

      cy.wait(1000) // Wait for render

      // lets you select a node
      cy.location().then((loc) => {
        let treeId = loc.search.split('id=')[1].split('&')[0];
  
        cy.contains(newProjectUUID, { timeout: 20000 })

        cy.get('canvas').as('canvas').then(canvas => {
            const width = canvas.width();
            const height = canvas.height();
            const canvasCenterX = width / 2;
            const canvasCenterY = height / 2;
  
            cy.get('@canvas')
            .click(canvasCenterX - 45, canvasCenterY)
  
            cy.contains('This is the root node')
        })
      })

      // should let you select the condition field
      cy.get('#node-type-dropdown:not([disabled])', { timeout: 20000 }).click()
      cy.get('[data-value="condition"]', {timeout: 10000 }).click()
      cy.get('#node-type-dropdown').should('contain', 'Condition')
    })


  })