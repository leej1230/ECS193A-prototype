describe("Home Page", () => {
    beforeEach(() => {
        cy.login("console");
    });

    it("displays the total gene count", () => {
        cy.get(".mb-1").contains("Total Genes Count");
        cy.get(".text-gray-800").contains(/^\d+$/); // Checks if the count is a number
    });

    it("displays the total dataset count", () => {
        cy.get(".mb-1").contains("Total Datasets Count");
        cy.get(".text-gray-800").contains(/^\d+$/); // Checks if the count is a number
    });

    it("navigates to the upload page when Upload button is clicked", () => {
        cy.contains("Upload").click();
        cy.url().should("include", "/upload");
    });

    it("navigates to the gene search page when Genes Search card is clicked", () => {
        cy.contains("Genes Search").click();
        cy.url().should("include", "/search_genes_page");
    });

    it("navigates to the dataset search page when Datasets Search card is clicked", () => {
        cy.contains("Datasets Search").click();
        cy.url().should("include", "/search_datasets_page");
    });

    it("has a sidebar with Home as the default active item", () => {
        cy.get(".active").contains("Home");
    });

    it("navigates to the console page when Home is clicked in the sidebar", () => {
        cy.contains("Home").click();
        cy.url().should("include", "/console");
    });

    it("navigates to the gene search page when Gene Search is clicked in the sidebar", () => {
        cy.contains("Gene Search").click({ force: true });
        cy.url().should("include", "/search_genes_page");
    });

    it("navigates to the dataset search page when Dataset Search is clicked in the sidebar", () => {
        cy.contains("Dataset Search").click({ force: true });
        cy.url().should("include", "/search_datasets_page");
    });

    it("renders the gene search image on the Genes Search card", () => {
        cy.get('a[href="/search_genes_page"]')
            .find('img[alt="gene_search_img"]')
            .should("be.visible");
    });

    it("renders the dataset search image on the Datasets Search card", () => {
        cy.get('a[href="/search_datasets_page"]')
            .find('img[alt="dataset_search_img"]')
            .should("be.visible");
    });

    it("renders the upload button", () => {
        cy.contains("Upload").should("be.visible");
    });

    it("displays the welcome message", () => {
        cy.contains("Welcome! You can search genes or datasets.").should(
            "be.visible"
        );
    });

    it("has the correct title for the Home page", () => {
        cy.title().should("eq", "Human Genomics Web App");
    });

    it("renders the gene count card with a DNA icon", () => {
        cy.get(".mb-1").first().should("contain", "Total Genes Count");
        cy.get(".card-body").find('svg[data-icon="dna"]').should("exist");
    });

    it("renders the dataset count card with a file icon", () => {
        cy.get(".mb-1").last().should("contain", "Total Datasets Count");
        cy.get(".card-body").find('svg[data-icon="file"]').should("exist");
    });
});
