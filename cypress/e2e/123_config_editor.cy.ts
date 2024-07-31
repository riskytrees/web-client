describe('Config Editor', () => {
  const newProjectUUID = self.crypto.randomUUID();

  it('loads tree page', () => {
    localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impvc2lhaEByaXNreXRyZWVzLmNvbSJ9.2DM3dQPime134NxfVLsx-RT6Y0qpNVAdgZoxWGyhNXg");

    cy.visit('/')
    cy.get('body').should('contain', 'Home')
    cy.get('body').contains('New Project').click()
    cy.get('#createProjectButtonField').type(newProjectUUID)
    cy.contains('Create New Project').click()
    cy.intercept('http://localhost:8000/projects/*/trees/*').as('getProject')
    cy.intercept('PUT', 'http://localhost:8000/projects/*/configs/*').as('putConfig')
    cy.intercept('POST', 'http://localhost:8000/projects/*/configs').as('postConfig')
    cy.intercept('GET', 'http://localhost:8000/projects/*/configs').as('getConfig')
    cy.intercept('PUT', 'http://localhost:8000/projects/*/config').as('putConfig')

    cy.get('.MuiButton-subtreeButton').click()
    cy.contains("Tree Viewer", { timeout: 80000 }).click()
    cy.wait('@getProject', { timeout: 20000 })

    cy.contains(newProjectUUID, { timeout: 80000 })

    // Lets you create a config
    cy.get(':nth-child(2) > .MuiStack-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(3) > .MuiGrid-root > .MuiButtonBase-root').click()
    cy.wait('@postConfig', { timeout: 20000 })
    cy.wait('@getConfig', { timeout: 20000 })
    cy.wait('@putConfig', { timeout: 20000 })

    // Can take a few ms to update the selected config async
    cy.wait(10)

    cy.get(':nth-child(2) > .MuiGrid-root > .MuiButtonBase-root').click()

    cy.url().should('include', '/config/')
    cy.get('body').should('contain', 'Configuration')
    cy.wait(1000)

    // lets you provide json
    cy.get('.w-tc-editor-text').type("{backspace}{backspace}{{}\"Hello\": \"World\"\}")
    cy.wait('@putConfig', { timeout: 20000 }).its('response.body.result.attributes.Hello').should('equal', 'World')

    // If refresh we should see the same data
    cy.intercept('GET', 'http://localhost:8000/projects/*/configs/*').as('getConfig')

    cy.reload(true)
    cy.wait('@getConfig', { timeout: 20000 })

    cy.get('.w-tc-editor-text').contains("Hello")
  })



})