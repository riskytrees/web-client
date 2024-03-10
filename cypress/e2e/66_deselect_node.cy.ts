describe('Deselect Node', () => {
    const newProjectUUID = self.crypto.randomUUID();

    it('loads tree page', () => {
      localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impvc2lhaEByaXNreXRyZWVzLmNvbSJ9.2DM3dQPime134NxfVLsx-RT6Y0qpNVAdgZoxWGyhNXg");

      cy.visit('/')
      cy.get('body').should('contain', 'Home')
      cy.get('body').contains('New Project').click()
      cy.get('#createProjectButtonField').type(newProjectUUID)
      cy.contains('Create New Project').click()
      cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')
      cy.intercept('http://localhost:8000/models').as('getModels')
      cy.intercept('http://localhost:8000/projects/*/trees/*/dag/down').as('dagDown')

      cy.get('.MuiButton-subtreeButton').click()
      cy.contains("Tree Viewer", { timeout: 80000 }).click()
      cy.wait('@getProject', { timeout: 20000 })
      cy.wait('@getModels', { timeout: 20000 })
      cy.wait('@dagDown', { timeout: 20000 })

      cy.wait(1000) // Wait for render

      // lets you select a node
      cy.location().then((loc) => {
        let treeId = loc.search.split('id=')[1].split('&')[0];


        cy.contains(newProjectUUID, { timeout: 20000 })

        cy.get('canvas').as('canvas').as('canvas');
        cy.get('canvas').then(canvas => {
            const width = canvas.width();
            const height = canvas.height();
            const canvasCenterX = width / 2;
            const canvasCenterY = height / 2;

            cy.get('@canvas')
            .click(canvasCenterX - 45, canvasCenterY)

            cy.contains('This is the root node')

            // Click somewhere else on the canvas
            cy.get('@canvas')
            .click(canvasCenterX + 45, canvasCenterY)
            cy.wait(1000)

            cy.get('body').should('not.contain', 'This is the root node')

        })
      })
    })

  })