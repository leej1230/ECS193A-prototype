import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Contact from '../../components/user_folder/contact.js';

describe('Contact', () => {
    it('renders without errors', () => {
      render(<Contact />);
    });

    it('renders the title correctly', () => {
      render(<Contact />);
      const titleElement = screen.getByText('Contact Information');
      expect(titleElement).toBeInTheDocument();
    });

    it('renders the project proposer card correctly', () => {
      render(<Contact />);
      const proposerCard = screen.getByText('Project Proposer');
      expect(proposerCard).toBeInTheDocument();
    });
    
    it('renders the developers card correctly', () => {
      render(<Contact />);
      const developersCard = screen.getByText('Developers');
      expect(developersCard).toBeInTheDocument();
    });

    it('renders external links correctly', () => {
      render(<Contact />);
      const externalLinks = screen.getAllByText('External Link if needed');
      expect(externalLinks.length).toBe(2);
    });

    it('renders navigation links correctly', () => {
      render(<Contact />);
      const homeLink = screen.getByText('Home');
      const aboutLinks = screen.getByText('About');
      const contactLink = screen.getByText('Contact Us');
  
      expect(homeLink).toBeInTheDocument();
      expect(aboutLinks).toBeInTheDocument();
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