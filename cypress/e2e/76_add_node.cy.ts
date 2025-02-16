describe('Add Node', () => {
  const newProjectUUID = self.crypto.randomUUID();

  it('loads tree page', () => {
    localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHBpcmF0aW9uIjoiMzQ3NjIzNTgxNCJ9.v_ROJ4EXdZdJl9dAVTD42b8F3mPf2y51AMnbt57FWq0");
    cy.intercept('http://localhost:8000/projects/*/trees/*/dag/down').as('dagDown')
    cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')
    cy.intercept('http://localhost:8000/models').as('getModels')


    cy.visit('/')
    cy.get('body').should('contain', 'Home')
    cy.get('body').contains('New Project').click()
    cy.get('#createProjectButtonField').type(newProjectUUID)
    cy.contains('Create New Project').click()

    cy.get('.MuiButton-subtreeButton').click()
    cy.contains("Tree Viewer", { timeout: 80000 })
    cy.wait('@getProject', { timeout: 20000 })

    // lets you select a node
    cy.location().then((loc) => {
      let treeId = loc.search.split('id=')[1].split('&')[0];


      cy.contains(newProjectUUID, { timeout: 20000 })

      cy.wait('@dagDown', { timeout: 20000 })
      cy.wait('@getModels', { timeout: 20000 })
      cy.wait(1000) // Wait for render

      cy.get('canvas').then(canvas => {
        const width = canvas.width();
        const height = canvas.height();
        const canvasCenterX = width / 2;
        const canvasCenterY = height / 2;

        cy.wrap(canvas)
          .click(canvasCenterX - 45, canvasCenterY)

        cy.contains('This is the root node')
        cy.contains('Add Node').click()

        cy.get('canvas').as('canvas').then(canvas => {
          const width = canvas.width();
          const height = canvas.height();
          const canvasCenterX = width / 2;
          const canvasCenterY = height / 2;

          cy.get('@canvas')
            .click(canvasCenterX - 40, canvasCenterY + 55)


          cy.get('body').should('not.contain', 'This is the root node')
        })
      })
    })
  })

})