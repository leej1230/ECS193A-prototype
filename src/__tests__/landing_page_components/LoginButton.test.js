import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../../components/landing_page_components/LoginButton';

jest.mock('@auth0/auth0-react');

describe('LoginButton', () => {
    it('renders the button correctly when not authenticated', () => {
        useAuth0.mockReturnValue({ loginWithRedirect: jest.fn(), isAuthenticated: false });

        const { getByText } = render(<LoginButton />);

        const button = getByText('OAuth Test');
        expect(button).toBeInTheDocument();
    });

    it('check if loginWithRedirect is triggered when the button is clicked', () => {
        const loginWithRedirect = jest.fn();
        useAuth0.mockReturnValue({ loginWithRedirect, isAuthenticated: false });

        const { getByText } = render(<LoginButton />);

        const button = getByText('OAuth Test');
        fireEvent.click(button);

        expect(loginWithRedirect).toHaveBeenCalledTimes(1);
    });

    it('button will not render if user is authenticated', () => {
        useAuth0.mockReturnValue({ loginWithRedirect: jest.fn(), isAuthenticated: true });

        const { queryByText } = render(<LoginButton />);

        const button = queryByText('OAuth Test');
        expect(button).toBeNull();
    });
});
