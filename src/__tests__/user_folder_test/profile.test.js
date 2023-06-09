import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import axios from 'axios';
import Profile from '../../components/user_folder/Contact';


jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(),
  }));

describe('Profile', () => {
    beforeEach(() => {

    useAuth0.mockReturnValue({
      user: {
        sub: 'auth0|1234567890',
        'https://unique.app.com/user_metadata': {
          given_name: 'John',
          family_name: 'Doe',
        },
      },
    });

    jest.spyOn(axios, 'get').mockResolvedValue({ data: { bookmarked_genes: [], bookmarked_datasets: [], is_admin: false, is_staff: false } });
    jest.spyOn(axios, 'post').mockResolvedValue({ data: [] });

        render(<Profile />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders user information correctly', async () => {
      await waitFor(() => {
        expect(
          screen.getByText((content, element) => {
            const hasText = (node) => node.textContent.trim().includes(content.trim());
            const nodeHasText = hasText(element);
            const childrenDontHaveText = Array.from(element.children).every((child) => !hasText(child));
            return nodeHasText && childrenDontHaveText;
          }, { exact: false }).toBeInTheDocument()
        );
      });
    });
    


});