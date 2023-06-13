import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect'; 
import DatasetPage from '../../components/dataset_folder/DatasetPage';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
  }));

jest.mock('../../components/spinner/gene.png', () => 'mocked-image-path');


describe('DatasetPage', () => {

  it('renders without errors', async () => {
    const mockResponse = { data: {} };
    axios.get.mockResolvedValue(mockResponse);
    render(
      <Router>
        <DatasetPage />
      </Router>
    );
  });

  test('renders loading spinner when dataset is not set', () => {
    render(
      <Router>
        <DatasetPage />
      </Router>
    );
    const loadingSpinner = screen.getByRole('img', { alt: 'Dancing Rabbit' });
    expect(loadingSpinner).toBeInTheDocument();
  });


  test('fetches dataset data from the backend', async () => {
    const mockDataset = {
      name: 'Sample Dataset',
      gene_ids: '0',
      patient_ids: '0',
      DATASET_ID: '1',
    };

    axios.get.mockResolvedValueOnce({ data: mockDataset });

    render(
        <Router>
          <DatasetPage />
        </Router>
      );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/api/dataset/`);
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/api/patients_in_dataset/`);
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/api/genes_in_dataset/`);

    });
  });

});
