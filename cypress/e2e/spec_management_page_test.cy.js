describe("Management Page", () => {
    describe("Uses Common User List", () => {
        beforeEach(() => {
            cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
                statusCode: 200,
                body: [
                    {
                        id: 0,
                        index: 1,
                        email: "test1@test1.com",
                        first_name: "First_1",
                        last_name: "Last_1",
                        auth0_uid: "",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: false,
                        is_admin: false,
                    },
                    {
                        id: 1,
                        index: 2,
                        email: "test4@test4.com",
                        first_name: "First_4",
                        last_name: "Last_4",
                        auth0_uid: "4",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: true,
                        is_admin: false,
                    },
                    {
                        id: 2,
                        index: 3,
                        email: "test2@test2.com",
                        first_name: "First_2",
                        last_name: "Last_2",
                        auth0_uid: "2",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: false,
                        is_admin: true,
                    },
                    {
                        id: 3,
                        index: 4,
                        email: "test5@test5.com",
                        first_name: "First_5",
                        last_name: "Last_5",
                        auth0_uid: "5",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: true,
                        is_admin: true,
                    },
                    {
                        id: 4,
                        index: 5,
                        email: "test3@test3.com",
                        first_name: "First_3",
                        last_name: "Last_3",
                        auth0_uid: "3",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: true,
                        is_admin: true,
                    },
                    {
                        id: 5,
                        index: 6,
                        email: "test6@test6.com",
                        first_name: "First_6",
                        last_name: "Last_6",
                        auth0_uid: "6",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: false,
                        is_admin: false,
                    },
                ],
            }).as("getUsers");
            cy.login("manage");
            cy.wait("@getUsers");
        });

        it("Displays the Authorize User List header", () => {
            cy.contains(".card-title2", "Authorize User").should("be.visible");
        });

        it("Displays the User List header", () => {
            cy.contains(".card-title2", "User List").should("be.visible");
        });

        it("Displays the History Log header", () => {
            cy.contains(".card-title2", "History Log").should("be.visible");
        });

        it("Submits the Invite Form successfully", () => {
            cy.get('input[type="email"]').type("test@example.com");
            cy.get('button[type="submit"]').click();
            cy.contains("You have successfully registered an email").should(
                "be.visible"
            );
        });

        it("Fetches and displays user list data", () => {
            cy.get(".MuiDataGrid-virtualScrollerRenderZone")
                .first()
                .children()
                .should("have.length", 5);
        });

        it("Toggles the checkbox in the User List", () => {
            cy.get(
                '[data-id="0"] [data-field="is_staff"] input[type="checkbox"]'
            )
                .first()
                .click();
            cy.get(
                '[data-id="0"] [data-field="is_staff"] input[type="checkbox"]'
            )
                .first()
                .uncheck();
        });

        it("Fetches and displays History Log data", () => {
            cy.intercept("GET", "http://localhost:8000/api/get-role-log", {
                fixture: "historyLog.json",
            }).as("getRoleLog");

            // Wait for the API response
            cy.wait("@getRoleLog");

            // Assert the presence of history log data in the DataGrid
            cy.get('[data-testid="history-log"] [data-testid="row"]').should(
                "have.length",
                5
            );
        });

        it("Handles pagination in the User List", () => {
            // Assert the presence of pagination
            cy.get(".MuiTablePagination-root").first().should("be.visible");

            cy.get("div.MuiTablePagination-actions")
                .contains("button", "Go to next page")
                .click();

            // Assert the displayed users in the DataGrid
            cy.get('[data-testid="user-list"] [data-testid="row"]').should(
                "have.length",
                2
            );
        });

        it("Handles sorting in the User List", () => {
            // Click on the Email header to sort
            cy.get('[data-testid="user-list"] th').contains("Email").click();

            // Assert the sorted order
            cy.get('[data-testid="user-list"] [data-testid="row"]')
                .eq(0)
                .find("td")
                .first()
                .should("contain", "test1@test1.com");
        });

        it("Filters User List by role", () => {
            cy.intercept("POST", "http://localhost:8000/api/filter-users").as(
                "filterUsers"
            );

            cy.get('[data-testid="role-filter"]').select("Staff");

            cy.wait("@filterUsers");

            cy.get('[aria-label="Admin"] > button').first().click();

            cy.get('[data-testid="user-list"] [data-testid="row"]').should(
                "have.length",
                1
            );

            cy.get(".MuiDataGrid-virtualScrollerRenderZone")
                .first()
                .children()
                .first()
                .children()[5]
                .uncheck();

            cy.get(".MuiDataGrid-virtualScrollerRenderZone")
                .first()
                .children()
                .should("have.length", 4);
        });

        it("Searches User List by email", () => {
            cy.intercept("POST", "http://localhost:8000/api/search-users").as(
                "searchUsers"
            );

            // Enter the email to search
            cy.get('[data-testid="search-input"]').type("admin@example.com");

            // Press Enter to trigger search
            cy.get('[data-testid="search-input"]').type("{enter}");

            // Wait for the search request
            cy.wait("@searchUsers");

            // Assert the searched users in the DataGrid
            cy.get('[data-testid="user-list"] [data-testid="row"]').should(
                "have.length",
                1
            );
        });

        it("Does not send POST request on malformed authorization email", () => {
            let count = 0;
            cy.intercept("POST", "http://localhost:8000/*", (req) => {
                throw new Error(
                    "Should not send POST request on malformed authorization email"
                );
            });
            cy.get('input[type="email"]').type("test");
            cy.get('button[type="submit"]').click();
        });

        it("Handles Invite Form API error gracefully", () => {
            cy.intercept(
                "POST",
                "http://localhost:8000/api/submit_authorized_email",
                {
                    statusCode: 500,
                }
            ).as("inviteUser");

            // Fill the email input field
            cy.get('input[type="email"]').type("test1@test1.com");

            // Submit the form
            cy.get('button[type="submit"]').click();

            // Wait for the API response
            cy.wait("@inviteUser");

            // Assert the error message
            cy.contains("Failed to invite user").should("be.visible");
        });
    });

    describe("Uses A Minimal User List", () => {
        beforeEach(() => {
            cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
                statusCode: 200,
                body: [
                    {
                        id: 0,
                        index: 1,
                        email: "test1@test1.com",
                        first_name: "First_1",
                        last_name: "Last_1",
                        auth0_uid: "",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: false,
                        is_admin: false,
                    },
                    {
                        id: 1,
                        index: 2,
                        email: "test4@test4.com",
                        first_name: "First_4",
                        last_name: "Last_4",
                        auth0_uid: "4",
                        date_created: "2023-05-16T22:47:27.865952Z",
                        bookmarked_genes: [],
                        bookmarked_datasets: [],
                        is_staff: true,
                        is_admin: false,
                    },
                ],
            }).as("getUsers");
            cy.login("manage");
            cy.wait("@getUsers");
        });
        it("Disables pagination in User List when there is only one page", () => {
            // Assert the absence of pagination
            cy.get('[data-testid="user-list-pagination"]').should("not.exist");
        });
    });

    describe("Uses An Empty User List", () => {
        beforeEach(() => {
            cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
                statusCode: 200,
                body: [],
            }).as("getUsers");
            cy.login("manage");
            cy.wait("@getUsers");
        });

        it("Has an empty user list table", () => {
            cy.get(".MuiDataGrid-virtualScrollerRenderZone")
                .first()
                .children()
                .should("have.length", 0);
        });
    });
});
