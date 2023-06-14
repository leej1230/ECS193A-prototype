import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import LoadingSpinner from '../../components/spinner/spinner.js';

jest.mock('../../components/spinner/gene.png', () => 'mocked-image-path');

describe('LoadingSpinner', () => {
  it('renders the image correctly', () => {
    const { getByAltText } = render(<LoadingSpinner />);
    const image = getByAltText('Dancing Rabbit');

    expect(image).toBeInTheDocument();
    expect(image.src).toContain('mocked-image-path');
  });
});

