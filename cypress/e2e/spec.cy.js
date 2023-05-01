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