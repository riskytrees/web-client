describe('Basic tests to ensure page loads', () => {

  it('passes', () => {
    localStorage.setItem("sessionToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHBpcmF0aW9uIjoiMzQ3NjIzNTgxNCJ9.v_ROJ4EXdZdJl9dAVTD42b8F3mPf2y51AMnbt57FWq0");

    cy.visit('/')
    cy.get('body').contains("Home")
  })
})