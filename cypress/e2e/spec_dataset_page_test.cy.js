// delete will actually delete

{/*describe('Test Dataset Page - delete button', () => {
    it('Try to delete dataset and go back to home page', () => {
      cy.visit('https://ecs-193-a-prototype.vercel.app/')
      cy.contains('Learn more').click()
      cy.contains('Delete').click()
      cy.url().should('eq', 'https://ecs-193-a-prototype.vercel.app/')
    })
  })*/}

describe('Test Dataset Page - upload button', () => {
  it('Try to go to upload page', () => {
    cy.visit('https://ecs-193-a-prototype.vercel.app/')
    cy.contains('Learn more').click()
    cy.contains('Update').click()
    cy.url().should('includes', '/update/dataset')
  })
})


