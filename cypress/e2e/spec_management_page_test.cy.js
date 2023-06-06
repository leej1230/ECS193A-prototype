describe("Management Page", () => {
    beforeEach(() => {
        cy.login("manage");
        cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
            fixture: "permission_users.json",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }).as("getUserAll");
        cy.wait("@getUserAll");
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
        cy.get('[data-id="testPermissionTable"]').should("have.length", 5);
    });

    it("Toggles the checkbox in the User List", () => {
        cy.get(
            '[data-id="testPermissionTable"] [data-field="is_staff"] input[type="checkbox"]'
        )
            .first()
            .click();
        cy.get(
            '[data-id="testPermissionTable"] [data-field="is_staff"] input[type="checkbox"]'
        )
            .first()
            .uncheck();
    });

    // it("Fetches and displays History Log data", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-role-log", {
    //         fixture: "historyLog.json",
    //     }).as("getRoleLog");

    //     // Wait for the API response
    //     cy.wait("@getRoleLog");

    //     // Assert the presence of history log data in the DataGrid
    //     cy.get('[data-testid="history-log"] [data-testid="row"]').should(
    //         "have.length",
    //         5
    //     );
    // });

    // it("Handles pagination in the User List", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Assert the presence of pagination
    //     cy.get(".MuiTablePagination-root").last().should("be.visible");

    //     // Click on the second page
    //     cy.get('[data-testid="user-list-pagination"] button')
    //         .contains("2")
    //         .click();

    //     // Assert the displayed users in the DataGrid
    //     cy.get('[data-testid="user-list"] [data-testid="row"]').should(
    //         "have.length",
    //         2
    //     );
    // });

    // it("Handles sorting in the User List", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Click on the Email header to sort
    //     cy.get('[data-testid="user-list"] th').contains("Email").click();

    //     // Assert the sorted order
    //     cy.get('[data-testid="user-list"] [data-testid="row"]')
    //         .eq(0)
    //         .find("td")
    //         .first()
    //         .should("contain", "admin@example.com");
    // });

    // it("Filters User List by role", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");
    //     cy.intercept("POST", "http://localhost:8000/api/filter-users").as(
    //         "filterUsers"
    //     );

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Select the "Staff" role from the filter dropdown
    //     cy.get('[data-testid="role-filter"]').select("Staff");

    //     // Wait for the filter request
    //     cy.wait("@filterUsers");

    //     // Assert the filtered users in the DataGrid
    //     cy.get('[data-testid="user-list"] [data-testid="row"]').should(
    //         "have.length",
    //         1
    //     );
    // });

    // it("Searches User List by email", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");
    //     cy.intercept("POST", "http://localhost:8000/api/search-users").as(
    //         "searchUsers"
    //     );

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Enter the email to search
    //     cy.get('[data-testid="search-input"]').type("admin@example.com");

    //     // Press Enter to trigger search
    //     cy.get('[data-testid="search-input"]').type("{enter}");

    //     // Wait for the search request
    //     cy.wait("@searchUsers");

    //     // Assert the searched users in the DataGrid
    //     cy.get('[data-testid="user-list"] [data-testid="row"]').should(
    //         "have.length",
    //         1
    //     );
    // });

    // it("Exports User List data", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");
    //     cy.intercept("GET", "http://localhost:8000/api/export-users").as(
    //         "exportUsers"
    //     );

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Click the export button
    //     cy.get('[data-testid="export-button"]').click();

    //     // Wait for the export request
    //     cy.wait("@exportUsers");

    //     // Assert the file download
    //     cy.get("@exportUsers").then((interception) => {
    //         expect(interception.response.statusCode).to.equal(200);
    //         expect(interception.response.headers["content-type"]).to.equal(
    //             "application/csv"
    //         );
    //     });
    // });

    // it("Disables pagination in User List when there is only one page", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "users.json",
    //     }).as("getUserAll");

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Assert the absence of pagination
    //     cy.get('[data-testid="user-list-pagination"]').should("not.exist");
    // });

    // it("Handles empty User List gracefully", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         fixture: "emptyUsers.json",
    //     }).as("getUserAll");

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Assert the empty state message
    //     cy.contains("No users found").should("be.visible");
    // });

    // it("Handles User List API error gracefully", () => {
    //     cy.intercept("GET", "http://localhost:8000/api/get-user-all", {
    //         statusCode: 500,
    //     }).as("getUserAll");

    //     // Wait for the API response
    //     cy.wait("@getUserAll");

    //     // Assert the error state message
    //     cy.contains("Failed to fetch users").should("be.visible");
    // });

    // it("Handles Invite Form API error gracefully", () => {
    //     cy.intercept("POST", "http://localhost:8000/api/invite-user", {
    //         statusCode: 500,
    //     }).as("inviteUser");

    //     // Fill the email input field
    //     cy.get('input[name="email"]').type("test@example.com");

    //     // Submit the form
    //     cy.get('button[type="submit"]').click();

    //     // Wait for the API response
    //     cy.wait("@inviteUser");

    //     // Assert the error message
    //     cy.contains("Failed to invite user").should("be.visible");
    // });
});
