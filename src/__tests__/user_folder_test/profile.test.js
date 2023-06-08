import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Profile from '../../components/user_folder/Contact';

describe('Profile', () => {
    beforeEach(() => {
        // Mock the useAuth0 return value
        useAuth0.mockReturnValue({
          user: {
            sub: 'auth0|1234567890',
            'https://unique.app.com/user_metadata': {
              given_name: 'John',
              family_name: 'Doe',
            },
          },
        });
    
        // Mock axios get and post methods
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { bookmarked_genes: [], bookmarked_datasets: [], is_admin: false, is_staff: false } });
        jest.spyOn(axios, 'post').mockResolvedValue({ data: [] });
    
        render(<Profile />);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('renders user information correctly', async () => {
        // Wait for user information to be fetched
        await waitFor(() => {
          expect(screen.getByText('User full name: John Doe')).toBeInTheDocument();
        });
      });



});