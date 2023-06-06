import React from 'react';
import { fireEvent, render } from '@testing-library/react';
// import { getById } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import HomePage from '../../components/landing_page_components/HomePage';

describe('HomePage', () => {
    let getByText;

    beforeEach(() => {
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
        const loginWithRedirectMock = jest.fn();

        const startButton = getByText('Start');

        fireEvent.click(startButton);

        expect(loginWithRedirectMock).toHaveBeenCalledTimes(1);
    });

    // it('renders the ReactPlayer', () => {
    //     const { container } = render(<HomePage />);
    //     const reactPlayerComponent = getById(container, 'video_back');

    //     expect(reactPlayerComponent).toBeInTheDocument();
    //     expect(reactPlayerComponent).toHaveAttribute('url', 'https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4');
    //     expect(reactPlayerComponent).toHaveAttribute('loop', 'true');
    //     expect(reactPlayerComponent).toHaveAttribute('playing', 'true');
    //     expect(reactPlayerComponent).toHaveAttribute('volume', '0');
    //     expect(reactPlayerComponent).toHaveAttribute('muted', 'true');
    //     expect(reactPlayerComponent).toHaveAttribute('controls', 'false');
    // });
});
