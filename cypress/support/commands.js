// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { display } from "@mui/system";
import { log } from "console";

Cypress.Commands.add(
    "checkFuzzyDiffOne",
    (current_input_str, str_reference) => {
        if (Math.abs(current_input_str.length - str_reference.length) > 1) {
            // rand number more than 1 to be discarded when filtered
            return 5;
        } else if (
            Math.abs(current_input_str.length - str_reference.length) == 1
        ) {
            // distance is 1, make sure no other diff, or else not dist 1

            let larger_str = current_input_str;
            let smaller_str = str_reference;
            if (current_input_str.length < str_reference.length) {
                larger_str = str_reference;
                smaller_str = current_input_str;
            }

            let num_errors = 0;
            let smaller_index = 0;
            let larger_index = 0;

            for (
                ;
                smaller_index < smaller_str.length &&
                larger_index < larger_str.length;

            ) {
                if (smaller_str[smaller_index] == larger_str[larger_index]) {
                    smaller_index++;
                    larger_index++;
                } else if (
                    larger_index + 1 < larger_str.length &&
                    smaller_str[smaller_index] == larger_str[larger_index + 1]
                ) {
                    larger_index = larger_index + 2;
                    smaller_index++;
                    num_errors++;
                } else {
                    larger_index++;
                    smaller_index++;
                    num_errors++;
                }
            }

            return num_errors;
        } else {
            // equal length

            let num_errors = 0;
            let first_index = 0;
            let second_index = 0;

            for (
                ;
                first_index < current_input_str.length &&
                second_index < str_reference.length;

            ) {
                if (
                    current_input_str[first_index] ==
                    str_reference[second_index]
                ) {
                    first_index++;
                    second_index++;
                } else {
                    second_index++;
                    first_index++;
                    num_errors++;
                }
            }

            return num_errors;
        }
    }
);

Cypress.Commands.add("login", (route) => {
    const username = Cypress.env("auth0_username");
    const password = Cypress.env("auth0_password");
    const url = Cypress.env("auth0_url");
    const log = Cypress.log({
        displayName: "AUTH0 LOGIN",
        message: [`Authenticating ${username}`],
        autoEnd: false,
    });
    log.snapshot("before");

    cy.visit(`http://localhost:3000/${route}`);
    cy.origin(
        url,
        { args: { username, password } },
        ({ username, password }) => {
            cy.get("input#1-email").type(username);
            cy.get("input#1-password").type(password, { log: false });
            cy.get("button#1-submit").click();
        }
    );
    cy.url().should("include", `${route}`);
    log.snapshot("after");

    log.end();
    cy.visit(`http://localhost:3000/${route}`);
});
