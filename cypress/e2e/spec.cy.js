describe('Test Home Page', () => {
  it('Try to visit home page', () => {
    cy.visit('https://ecs-193-a-prototype.vercel.app/')
  })
})

describe('Test Upload Page', () => {
  it('Try to visit upload page', () => {
    cy.visit('https://ecs-193-a-prototype.vercel.app/')
    cy.contains('Upload').click()
    cy.url().should('eq', 'https://ecs-193-a-prototype.vercel.app/upload')
  })
})

describe('Test Gene Page', () => {
  it('Try to visit gene page', () => {
    cy.visit('https://ecs-193-a-prototype.vercel.app/')
    cy.contains('Gene Name:').click()
    cy.url().should('includes', '/gene/')
  })
})

describe('Test Dataset Page', () => {
  it('Try to visit dataset page', () => {
    cy.visit('https://ecs-193-a-prototype.vercel.app/')
    cy.contains('Learn more').click()
    cy.url().should('includes', '/dataset/')
  })
})