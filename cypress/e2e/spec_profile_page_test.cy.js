describe("Profile Page", () => {
    beforeEach(() => {
        cy.login("profile");
    });

    it("displays user information correctly", () => {
        // Assuming userMetadata is available
        cy.get(".user-info").within(() => {
            cy.contains("User full name: ur mother");
        });

        cy.get(".role-list").within(() => {
            cy.contains("User Role: Admin and Staff");
            cy.get("a").should("exist");
        });
    });

    it("displays gene bookmarks correctly", () => {
        // Assuming bookmarkedGenes is an array with 3 gene URLs
        cy.get(".card-title2").contains("Gene Bookmarks");
        cy.get(".card-body").within(() => {
            cy.get("h4").should("not.exist");
            cy.get("a").should("have.length", 3);
        });
    });

    it("displays dataset bookmarks correctly", () => {
        // Assuming bookmarkedDatasets is an array with 2 dataset URLs
        cy.get(".card-title2").contains("Dataset Bookmarks");
        cy.get(".card-body").within(() => {
            cy.get("h4").should("not.exist");
            cy.get("a").should("have.length", 2);
        });
    });

    it("removes gene bookmark on click", () => {
        // Assuming bookmarkedGenes is not empty
        cy.get(".card-title2").contains("Gene Bookmarks");
        cy.get(".card-body").within(() => {
            cy.get("a")
                .first()
                .then(($link) => {
                    const geneUrl = $link.text();

                    cy.get("a").first().click();
                    cy.get("a").contains(geneUrl).should("not.exist");
                });
        });
    });

    it("removes dataset bookmark on click", () => {
        // Assuming bookmarkedDatasets is not empty
        cy.get(".card-title2").contains("Dataset Bookmarks");
        cy.get(".card-body").within(() => {
            cy.get("a")
                .first()
                .then(($link) => {
                    const datasetUrl = $link.text();

                    cy.get("a").first().click();
                    cy.get("a").contains(datasetUrl).should("not.exist");
                });
        });
    });

    it("redirects to manage page for admin users", () => {
        // Assuming is_admin is true
        cy.get(".role-list").within(() => {
            cy.contains("User Role: Admin");
            cy.get("a").should(
                "have.attr",
                "href",
                "http://localhost:3000/manage"
            );
        });
    });
});
