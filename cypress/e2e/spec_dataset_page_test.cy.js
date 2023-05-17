// delete will actually delete

{/*describe('Test Dataset Page - delete button', () => {
    it('Try to delete dataset and go back to home page', () => {
      cy.visit('http://localhost:3000/')
      cy.contains('Learn more').click()
      cy.contains('Delete').click()
      cy.url().should('eq', 'http://localhost:3000/')
    })
  })*/}

/*describe('Test Dataset Page - update button', () => {
  it('Try to go to update page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.contains('Update').click()
    cy.url().should('includes', '/update/dataset')
  })
})

describe('Test Dataset Page - search gene list, single case', () => {
  it('Search for a gene in the genes list of the dataset', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('ENSG00000000003.14')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').contains('ENSG00000000003.14');
    cy.get('#gene_list_single_link').each(($match) => {
      cy.wrap($match).invoke('text').should('eq', 'ENSG00000000003.14')
    })
  })
})


describe('Test Dataset Page - search gene list, multiple fuzzy matches', () => {
  it('Search for a gene in the genes list with multiple fuzzy matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('ENSG00000000420.6')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').contains('ENSG00000000420.6');
    cy.get('#gene_list_single_link').each(($match) => {
      cy.checkFuzzyDiffOne( cy.wrap($match).invoke('text') , 'ENSG00000000420.6' ).should('be.lte', 1)
    })
  })
})

describe('Test Dataset Page - search gene list, zero matches', () => {
  it('Search for a gene in the genes list with no matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('AAAA')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').should('have.length', 0);
  })
})

describe('Test Dataset Page - search gene list, empty input, zero matches', () => {
  it('Search for a gene in the genes list with empty search and no matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').should('have.length', 0);
  })
})

describe('Test Dataset Page - search gene list, extra big input, zero matches', () => {
  it('Search for a gene in the genes list with big input search and no matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('QQD232ENSG0045000000420.6XXX7X0')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').should('have.length', 0);
  })
})

describe('Test Dataset Page - search gene list, 2 less input, zero matches', () => {
  it('Search for a gene in the genes list with big input search and no matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('ENSG000000420.6')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').should('have.length', 0);
  })
})

describe('Test Dataset Page - search gene list, 2 more input, zero matches', () => {
  it('Search for a gene in the genes list with big input search and no matches', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    cy.get('[data-cy="genelistinputbox"]').type('ENSG00000q0000420.6')
    cy.get('#gene_list_search').click()
    cy.get('#gene_list_single_link').should('have.length', 0);
  })
})*/

describe('Test Dataset Page - link of dataset', () => {
  it('Click on dataset link in its information', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Learn more').click()
    let found_url = 'false'
    cy.get(".MuiTableCell-alignLeft").each(($match) => {
      let current_element_txt = ""
      
      cy.wrap($match).invoke('text').then((extracted_txt) => {
        current_element_txt = extracted_txt

        let re = new RegExp("http.*");

        if(re.test(current_element_txt)){
          // it is a url
          found_url = 'true'
        }
      })

    }).should(() => {
      expect(found_url).eq('true')
    });;

    
  })
})
