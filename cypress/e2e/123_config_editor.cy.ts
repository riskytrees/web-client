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

    cy.contains("Tree Viewer", { timeout: 80000 }).click()
    cy.wait('@getProject', { timeout: 20000 })

    cy.contains(newProjectUUID, { timeout: 80000 })

    // Lets you create a config
    cy.get('#treeNameSelect').click();
    cy.get(':nth-child(3) > .MuiGrid-root > .MuiButtonBase-root').click()
    cy.wait('@postConfig', { timeout: 20000 })
    cy.wait('@getConfig', { timeout: 20000 })
    cy.wait('@putConfig', { timeout: 20000 })

    cy.get(':nth-child(2) > .MuiGrid-root > .MuiButtonBase-root').click()

    cy.url().should('include', '/config/')
    cy.get('body').should('contain', 'Configuration')

    // lets you provide json and will visualize types
    cy.get('#config-json-field').type("{backspace}{backspace}{{}\"Hello\": \"World\"\}")
    cy.get('body').contains("1 Items")
    cy.get('body').contains("string")
    cy.wait('@putConfig', { timeout: 20000 }).its('response.body.result.attributes.attributes.Hello').should('equal', 'World')

    // If refresh we should see the same data
    cy.intercept('GET', 'http://localhost:8000/projects/*/configs/*').as('getConfig')

    cy.reload(true)
    cy.wait('@getConfig', { timeout: 20000 })

    cy.get('body').contains("1 Items")
    cy.get('body').contains("string")
  })



})