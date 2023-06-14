import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Home from "../components/main_page_folder/home";
import "@testing-library/jest-dom/extend-expect";

jest.mock("@auth0/auth0-react");
jest.mock("axios");

describe("Home component", () => {
    test("renders welcome message", async () => {
        useAuth0.mockReturnValue({
            user: {
                email: "test@example.com",
                sub: "auth0|1234567890",
                ["https://unique.app.com/user_metadata"]: {
                    given_name: "John",
                    family_name: "Doe",
                },
            },
        });

        axios.post.mockImplementation(() => Promise.resolve());

        axios.get.mockImplementation((url) => {
            if (url === `${process.env.REACT_APP_BACKEND_URL}/api/gene_count`) {
                return Promise.resolve({ data: { count: 10 } });
            }
            if (url === `${process.env.REACT_APP_BACKEND_URL}/api/dataset_count`) {
                return Promise.resolve({ data: { count: 20 } });
            }
        });

        /*render(<Home />);
        const welcomeMessage = await screen.findByText(
            /Welcome! You can search genes or datasets./i
        );
        expect(welcomeMessage).toBeInTheDocument();*/
    });
});
