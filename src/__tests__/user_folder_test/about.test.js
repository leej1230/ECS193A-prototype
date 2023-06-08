import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import About from '../../components/user_folder/About';

describe('About', () => {
  it('renders without errors', () => {
    render(<About />);
  });

  it('renders the title correctly', () => {
    render(<About />);
    const titleRegex = /^About$/i;
    const titles = screen.queryAllByText(titleRegex);
    const title = titles[1];
    expect(title).toBeInTheDocument();
  });

  it('renders the description correctly', () => {
    render(<About />);
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
    render(<About />);
    const homeLink = screen.getByText('Home');
    const aboutLinks = screen.getAllByText('About');
    const contactLink = screen.getByText('Contact Us');

    expect(homeLink).toBeInTheDocument();
    expect(aboutLinks.length).toBeGreaterThan(1);
    expect(contactLink).toBeInTheDocument();
  });

  it('renders the ReactPlayer component correctly', () => {
    render(<About />);
    const reactPlayer = screen.getByTestId('react-player');
    const videoElement = reactPlayer.querySelector('video');
  
    expect(reactPlayer).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', 'https://static.videezy.com/system/resources/previews/000/018/787/original/Komp_2.mp4');
  });
});