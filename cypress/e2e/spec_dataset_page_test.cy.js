// delete will actually delete

{/*describe('Test Dataset Page - delete button', () => {
    it('Try to delete dataset and go back to home page', () => {
      cy.visit('http://localhost:3000/')
      cy.contains('Learn more').click()
      cy.contains('Delete').click()
      cy.url().should('eq', 'http://localhost:3000/')
    })
  })*/}

describe('Test Dataset Page - update button', () => {
  it('Try to go to update page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.contains('Update').click()
    cy.url().should('includes', '/update/dataset')
  })
})

describe('Test Dataset Page - seach gene list', () => {
  it('Search for a gene in the genes list of the dataset', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('ENSG00000000421.6')
    //cy.get('#gene_list_search').click()
    //cy.get('#gene_list_single_link').should('eq', 'ENSG00000000421.6').nextAll().should('eq','[]')
  })
})


