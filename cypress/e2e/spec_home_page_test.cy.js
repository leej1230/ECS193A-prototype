describe('Test Home Page', () => {
  it('Try to visit home page', () => {
    cy.visit('http://localhost:3000/')
  })
})

describe('Test Upload Page', () => {
  it('Try to visit upload page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Upload').click()
    cy.url().should('eq', 'http://localhost:3000/upload')
  })
})

describe('Test Dataset Page', () => {
  it('Try to visit dataset page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.url().should('includes', '/dataset/')
  })
})