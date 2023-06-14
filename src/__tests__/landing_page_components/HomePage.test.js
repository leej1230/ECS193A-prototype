import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HomePage from '../../components/landing_page_components/HomePage';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('HomePage', () => {
    let getByText;
    
    beforeEach(() => {
        const loginWithRedirectMock = jest.fn();
        useAuth0.mockReturnValue({ loginWithRedirect: loginWithRedirectMock, isAuthenticated: false });
        ({ getByText } = render(<HomePage />));
    });

    it('renders navbar', () => {
        const homeLink = getByText('Home');
        const aboutLink = getByText('About');
        const contactLink = getByText('Contact Us');

        expect(homeLink).toBeInTheDocument();
        expect(aboutLink).toBeInTheDocument();
        expect(contactLink).toBeInTheDocument();
    });

    it('renders the texts', () => {
        const titleElement = getByText('Genomics Browser');
        const descriptionElement = getByText('Helping Researchers and Medical Professionals Work With Genomics Data');

        expect(titleElement).toBeInTheDocument();
        expect(descriptionElement).toBeInTheDocument();
    });

    it('renders the start button', () => {
        const divContainer = getByText('Start').parentElement;
        expect(divContainer).toBeInTheDocument();
        expect(divContainer).toHaveClass('d-flex align-items-center justify-content-center');

        const startButton = getByText('Start');
        expect(startButton).toBeInTheDocument();
        expect(startButton).toHaveClass('btn btn-primary');
        expect(startButton).not.toHaveAttribute('href');

    });

    it('start button functions', () => {
        const startButton = getByText('Start');

        fireEvent.click(startButton);

        expect(useAuth0().loginWithRedirect).toHaveBeenCalled();
        expect(useAuth0().loginWithRedirect).toHaveBeenCalledTimes(1);
    });

});