import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'; 
import DatasetNameHolder from '../../components/dataset_folder/DatasetNameHolder';
import { useAuth0 } from '@auth0/auth0-react';


jest.mock('@fortawesome/fontawesome-svg-core/import.macro', () => ({
    icon: ({ prefix, iconName }) => ({ prefix, iconName }),
  }));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: jest.fn(),
  }));

jest.mock('axios');
jest.mock('@auth0/auth0-react');
  
  describe('DatasetNameHolder', () => {
    const inputDataset = {
        name: 'Sample Dataset',
      };
      const inputDatasetId = '123';
    
      beforeEach(() => {
        axios.get.mockResolvedValue({ data: { bookmarked_datasets: [] } });
        axios.post.mockResolvedValue();
        useAuth0.mockReturnValue({ user: { sub: 'auth0|user123' } });
        render(<DatasetNameHolder input_dataset={inputDataset} input_dataset_id={inputDatasetId} />);
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });

    it('renders the dataset name', () => {
        const datasetName = screen.getByText('Sample Dataset');
        expect(datasetName).toBeInTheDocument();
      });

    it('renders the dataset ID', () => {
        const datasetId = screen.getByText('123');
        expect(datasetId).toBeInTheDocument();
      });

      it('renders the dataset name and ID', async () => {
        const dataset = {
          name: 'Sample Dataset',
        };
        const datasetId = '123';
    
        render(
          <DatasetNameHolder input_dataset={dataset} input_dataset_id={datasetId} />
        );
    
        const datasetNameElements = screen.queryAllByText(/Dataset:/i);
        const datasetIdElements = screen.queryAllByText(datasetId);
    
        expect(datasetNameElements).toHaveLength(2);
        expect(datasetNameElements[0]).toHaveTextContent('Dataset:');
        expect(datasetNameElements[1]).toHaveTextContent('Dataset:');
    
        expect(datasetIdElements).toHaveLength(2);
        expect(datasetIdElements[0]).toHaveTextContent(datasetId);
        expect(datasetIdElements[1]).toHaveTextContent(datasetId);
      });

      it('fetches user info and sets bookmarked status', async () => {
        jest.spyOn(axios, 'get').mockResolvedValueOnce({
          data: {
            bookmarked_datasets: ['Sample Dataset/123'],
          },
        });
    
        const dataset = {
          name: 'Sample Dataset',
        };
        const datasetId = '123';
    
        render(
          <DatasetNameHolder input_dataset={dataset} input_dataset_id={datasetId} />
        );
    
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
      });

  });