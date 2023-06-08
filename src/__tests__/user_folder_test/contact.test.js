import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { MemoryRouter } from 'react-router-dom';
import Contact from '../../components/user_folder/About';

describe('Contact', () => {
    it('renders without errors', () => {
      render(<Contact />);
    });

    it('renders the title correctly', () => {
        render(<Contact />);
        const title = screen.getByText(/Contact Us/i);
    
        expect(title).toBeInTheDocument();
      });

      it('renders the description correctly', () => {
        render(<Contact />);
        const description = screen.getByText((content, element) => {
          const hasText = (node) => node.textContent === content;
          const nodeHasText = hasText(element);
          const childrenDontHaveText = Array.from(element.children).every(
            (child) => !hasText(child)
          );
          return nodeHasText && childrenDontHaveText;
        }, { exact: false, selector: '.blockquote' });
    
        expect(description).toBeInTheDocument();
      });

      it('renders navigation links correctly', () => {
        render(<Contact />);
        const homeLink = screen.getByText('Home');
        const aboutLinks = screen.getAllByText('About');
        const contactLink = screen.getByText('Contact Us');
    
        expect(homeLink).toBeInTheDocument();
        expect(aboutLinks.length).toBeGreaterThan(1);
        expect(contactLink).toBeInTheDocument();
      });

      it('renders the ReactPlayer component correctly', () => {
        render(<Contact />);
        const reactPlayer = screen.getByTestId('react-player');
        const videoElement = reactPlayer.querySelector('video');
      
        expect(reactPlayer).toBeInTheDocument();
        expect(videoElement).toHaveAttribute('src', 'https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4');
      });




});